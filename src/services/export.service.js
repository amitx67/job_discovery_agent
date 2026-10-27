
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
            { id: "url", title: "Job URL" },
            { id: "content", title: "Description Snippet" },
            { id: "score", title: "Relevance Score" }
        ]
    });

    await csvWriter.writeRecords(jobs);

    console.log(`Jobs exported successfully to: ${filePath}`);
}
