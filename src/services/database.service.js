import Job from "../models/job.model.js";
import { extractDomain, normalizeUrl } from "../utils/url.js";

// Upserts jobs into MongoDB keyed on the normalized URL. All cleaned and
// verified fields are persisted so the API can filter and export them.
const saveJobsToDB = async (jobs) => {
    let savedCount = 0;
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const job of jobs) {
        try {
            // Prefer the LLM-normalized title; fall back to the search title.
            const title = (job.extractedJobTitle || job.title || "").trim();
            const url = normalizeUrl(job.url) || job.url?.trim();

            if (!title || !url) {
                skippedCount++;
                continue;
            }

            // Identity fields are always refreshed. Verification and LLM
            // fields are only overwritten when the incoming record actually
            // carries them, so a partial record cannot degrade an existing
            // one. The source domain is derived from the URL as a fallback.
            const updateSet = {
                title,
                company: job.company || "Unknown",
                location: job.location || "Unknown",
                jobType: (job.jobType || "unknown").toLowerCase(),
                remoteStatus: (job.remoteStatus || "unknown").toLowerCase(),
                url,
                source: job.source || extractDomain(url),
            };

            if (job.sourceType) {
                updateSet.sourceType = job.sourceType;
            }

            if (job.verificationStatus) {
                updateSet.verificationStatus = job.verificationStatus;
            }

            if (job.verificationEvidence) {
                updateSet.verificationEvidence = job.verificationEvidence;
            }

            if (job.extractionStatus) {
                updateSet.extractionStatus = job.extractionStatus;
            }

            if (job.llmCleaningStatus === "cleaned") {
                // The LLM summary doubles as the searchable description.
                const summary = job.summary || job.description || "";

                updateSet.llmCleaningStatus = "cleaned";
                updateSet.llmConfidence = (job.llmConfidence || "low").toLowerCase();
                updateSet.llmEvidenceNotes = job.llmEvidenceNotes || "";
                updateSet.missingFields = Array.isArray(job.missingFields)
                    ? job.missingFields
                    : [];

                if (summary) {
                    updateSet.description = summary;
                }

                if (job.summary) {
                    updateSet.summary = job.summary;
                }

                if (Array.isArray(job.requiredSkills) && job.requiredSkills.length) {
                    updateSet.requiredSkills = job.requiredSkills;
                }

                if (job.applicationUrl) {
                    updateSet.applicationUrl = job.applicationUrl;
                }
            }

            const result = await Job.updateOne(
                { url },
                { $set: updateSet },
                { upsert: true }
            );

            savedCount++;

            if (result.upsertedCount > 0) {
                insertedCount++;
            } else {
                updatedCount++;
            }
        } catch (error) {
            if (error.code === 11000) {
                // Concurrent upsert of the same URL - count as an update.
                updatedCount++;
            } else {
                failedCount++;
                console.error(
                    `Failed to save job "${job.extractedJobTitle || job.title}":`,
                    error.message
                );
            }
        }
    }

    console.log("MongoDB save results:");
    console.log(`Saved or updated: ${savedCount}`);
    console.log(`New: ${insertedCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (missing title/url): ${skippedCount}`);
    console.log(`Failed: ${failedCount}`);

    return { savedCount, insertedCount, updatedCount, skippedCount, failedCount };
};

export default saveJobsToDB;
