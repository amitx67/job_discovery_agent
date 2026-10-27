
import { createObjectCsvWriter } from "csv-writer";
import fs from "node:fs";
import path from "node:path";

export async function exportJobsToCSV(jobs) {
    if (!jobs.length) {
        console.log("No jobs available to export.");
        return;
    }

    const exportDirectory = path.resolve("exports");

    fs.mkdirSync(exportDirectory, { recursive: true });

    const filePath = path.join(exportDirectory, "jobs.csv");

    const csvWriter = createObjectCsvWriter({
        path: filePath,
        
header: [
    { id: "title", title: "Job Title" },
    { id: "url", title: "Source URL" },
    { id: "content", title: "Search Snippet" },
    { id: "extractedContent", title: "Extracted Content" },
    { id: "score", title: "Relevance Score" },
    { id: "sourceType", title: "Source Type" },
    { id: "verificationStatus", title: "Verification Status" },
    { id: "jobType", title: "Possible Job Type" },
    { id: "applicationEvidenceFound", title: "Application Evidence Found" },
    { id: "openStatus", title: "Open Status" },
    { id: "extractionStatus", title: "Extraction Status" }
]

    });

    await csvWriter.writeRecords(jobs);

    console.log(`Jobs exported successfully to: ${filePath}`);
}
