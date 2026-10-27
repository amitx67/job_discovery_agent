
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
    

{ id: "remoteStatus", title: "Remote Status" },
{ id: "summary", title: "Job Summary" },
{ id: "requiredSkills", title: "Required Skills" },
{ id: "llmConfidence", title: "LLM Confidence" },
{ id: "missingFields", title: "Missing Fields" },
{ id: "llmEvidenceNotes", title: "LLM Evidence Notes" },
{ id: "llmCleaningStatus", title: "LLM Cleaning Status" }


]

    });

    await csvWriter.writeRecords(jobs);

    console.log(`Jobs exported successfully to: ${filePath}`);
}
