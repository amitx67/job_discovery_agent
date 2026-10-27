
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
    
{ id: "company", title: "Company" },
{ id: "extractedJobTitle", title: "Job Title" },
{ id: "location", title: "Location" },
{ id: "jobType", title: "Job Type" },
{ id: "applicationUrl", title: "Application URL" },
{ id: "verificationEvidence", title: "Verification Evidence" }

]

    });

    await csvWriter.writeRecords(jobs);

    console.log(`Jobs exported successfully to: ${filePath}`);
}
