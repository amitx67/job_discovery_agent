import "dotenv/config";
import mongoose from "mongoose";

import { config } from "./config/env.js";
import connectToDB from "./config/db.js";
import Job from "./models/job.model.js";
import { searchJobs, extractJobContent } from "./services/tavily.service.js";
import { verifyJobResult } from "./services/verification.service.js";
import { cleanJobsWithGemini } from "./services/llm-cleaner.service.js";
import saveJobsToDB from "./services/database.service.js";
import { exportJobsToCSV } from "./services/export.service.js";
import { readCompaniesFromCSV } from "./services/company-csv.service.js";
import { dedupeJobs } from "./utils/dedupe.js";
import { normalizeUrl } from "./utils/url.js";
import {
    buildDiscoveryQueries,
    careersDomainFromUrl,
} from "./utils/query-builder.js";

// Runs the full discovery pipeline once and returns a summary object.
// It is used by the CLI entry point (index.js) and by the scheduler inside
// the API server, so it never closes the database connection itself unless
// `disconnectDb` is explicitly requested.
export async function runDiscoveryPipeline(options = {}) {
    const { disconnectDb = false } = options;

    const summary = {
        status: "completed",
        startedAt: new Date().toISOString(),
        companiesLoaded: 0,
        queriesRun: 0,
        searchResults: 0,
        uniqueResults: 0,
        knownJobsSkipped: 0,
        extracted: 0,
        cleaned: 0,
        savedToDb: 0,
        newJobs: 0,
        updatedJobs: 0,
        exportPath: null,
    };

    try {
        await connectToDB();

        // 1. Load the optional company list.
        const companies = await readCompaniesFromCSV();
        summary.companiesLoaded = companies.length;

        if (companies.length === 0) {
            console.warn(
                "No valid companies found in data/companies.csv - " +
                "continuing with generic queries only."
            );
        } else {
            console.log(`Loaded ${companies.length} companies from CSV.`);
        }

        // 2. Build and run the search queries.
        const queries = buildDiscoveryQueries({
            companies,
            maxQueries: config.maxQueries,
        });
        summary.queriesRun = queries.length;

        const allResults = [];

        for (const query of queries) {
            console.log(`\nSearching: ${query}`);

            try {
                const results = await searchJobs(query, config.searchMaxResults);

                for (const result of results) {
                    allResults.push({ ...result, searchQuery: query });
                }
            } catch (error) {
                // One failing query should not abort the whole run.
                console.error(`Query failed, skipping: "${query}" -`, error.message);
            }
        }

        summary.searchResults = allResults.length;

        // 3. Cross-query deduplication on normalized URLs.
        const uniqueJobs = dedupeJobs(allResults);
        summary.uniqueResults = uniqueJobs.length;
        console.log(`\nTotal unique search results: ${uniqueJobs.length}`);

        // 4. Skip jobs already stored in MongoDB (saves extraction + LLM cost).
        let jobsToProcess = uniqueJobs;

        if (config.skipKnownJobs && uniqueJobs.length > 0) {
            const urls = uniqueJobs.map((job) => normalizeUrl(job.url) || job.url);

            const knownJobs = await Job.find({ url: { $in: urls } })
                .select("url")
                .lean();

            const knownUrls = new Set(knownJobs.map((job) => job.url));
            jobsToProcess = uniqueJobs.filter(
                (job) => !knownUrls.has(normalizeUrl(job.url) || job.url)
            );

            summary.knownJobsSkipped = uniqueJobs.length - jobsToProcess.length;
            console.log(
                `Skipping ${summary.knownJobsSkipped} already-known jobs ` +
                `(SKIP_KNOWN_JOBS=${config.skipKnownJobs}).`
            );
        }

        if (jobsToProcess.length === 0) {
            console.log("\nNo new jobs to process. Pipeline finished.");
            return summary;
        }

        // 5. Extract webpage content.
        console.log("\nExtracting webpage content...");
        const extractedJobs = await extractJobContent(jobsToProcess);
        summary.extracted = extractedJobs.length;

        // 6. Rule-based verification (companies improve source attribution).
        console.log("\nApplying basic verification rules...");
        const careersDomains = companies
            .map((company) => careersDomainFromUrl(company.careersUrl))
            .filter(Boolean);

        const verifiedJobs = extractedJobs.map((job) =>
            verifyJobResult(job, careersDomains)
        );

        // 7. LLM cleaning and normalization.
        console.log("\nCleaning job data with Gemini...");
        const cleanedJobs = await cleanJobsWithGemini(verifiedJobs);
        summary.cleaned = cleanedJobs.filter(
            (job) => job.llmCleaningStatus === "cleaned"
        ).length;

        for (const job of cleanedJobs) {
            console.log({
                title: job.extractedJobTitle || job.title,
                company: job.company ?? null,
                location: job.location ?? null,
                jobType: job.jobType ?? "unknown",
                llmCleaningStatus: job.llmCleaningStatus,
            });
        }

        // 8. Save to MongoDB (upsert keyed on the normalized URL).
        console.log("\nSaving jobs to MongoDB...");
        const dbResult = await saveJobsToDB(cleanedJobs);
        summary.savedToDb = dbResult.savedCount;
        summary.newJobs = dbResult.insertedCount;
        summary.updatedJobs = dbResult.updatedCount;

        // 9. CSV export.
        console.log("\nExporting jobs to CSV...");
        summary.exportPath = await exportJobsToCSV(cleanedJobs);

        return summary;
    } catch (error) {
        summary.status = "failed";
        summary.error = error.message;
        throw error;
    } finally {
        if (disconnectDb) {
            await mongoose.disconnect();
        }
    }
}
