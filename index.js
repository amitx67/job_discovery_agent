
import "dotenv/config";
import { searchJobs } from "./src/services/tavily.service.js";
import { exportJobsToCSV } from "./src/services/export.service.js";
import { extractJobContent } from "./src/services/tavily.service.js";
import { verifyJobResult } from "./src/services/verification.service.js";
import { cleanJobsWithGemini } from "./src/services/llm-cleaner.service.js";
import connectToDB from "./src/config/db.js";
import saveJobsToDB from "./src/services/database.service.js";
import mongoose from "mongoose";

async function main() {
    try {
        // Connect to MongoDB before processing jobs
        await connectToDB();

        const queries = [
            '"software engineering intern" careers 2026',
            '"junior backend developer" entry level jobs',
            'remote software developer internships worldwide',
            'site:jobs.lever.co software engineer intern',
            'site:boards.greenhouse.io backend developer intern'
        ];

        const seenUrls = new Set();
        const allJobs = [];

        for (const query of queries) {
            console.log(`\nSearching: ${query}`);

            const results = await searchJobs(query, 5);

            for (const result of results) {
                if (seenUrls.has(result.url)) {
                    continue;
                }

                seenUrls.add(result.url);
                allJobs.push(result);

                console.log({
                    title: result.title,
                    url: result.url,
                    score: result.score
                });
            }
        }

        console.log(`\nTotal unique search results: ${allJobs.length}`);

        console.log("\nExtracting webpage content...");

        const extractedJobs = await extractJobContent(allJobs);

        console.log("\nApplying basic verification rules...");

        const verifiedJobs = extractedJobs.map((job) =>
            verifyJobResult(job)
        );

        console.log("\nCleaning job data with Gemini...");

        const cleanedJobs = await cleanJobsWithGemini(verifiedJobs);

        for (const job of cleanedJobs) {
            console.log({
                title: job.extractedJobTitle || job.title,
                company: job.company ?? null,
                location: job.location ?? null,
                jobType: job.jobType ?? "unknown",
                llmCleaningStatus: job.llmCleaningStatus
            });
        }

        // Save cleaned jobs to MongoDB Atlas
        console.log("\nSaving jobs to MongoDB...");

        await saveJobsToDB(cleanedJobs);

        // Preserve your existing CSV export
        console.log("\nExporting jobs to CSV...");

        await exportJobsToCSV(cleanedJobs);

        console.log("\nJob discovery pipeline completed successfully.");

    } catch (error) {
        console.error("Job search failed:", error.message);
        process.exitCode = 1;
    } finally {
        // Close the database connection when processing finishes
        await mongoose.disconnect();
    }
}

main();
