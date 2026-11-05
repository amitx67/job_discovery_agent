import { createObjectCsvWriter } from "csv-writer";
import fs from "node:fs";
import path from "node:path";

const CSV_HEADER = [
    { id: "url", title: "URL" },
    { id: "title", title: "Job Title" },
    { id: "company", title: "Company" },
    { id: "location", title: "Location" },
    { id: "jobType", title: "Job Type" },
    { id: "remoteStatus", title: "Remote Status" },
    { id: "applicationUrl", title: "Application URL" },
    { id: "source", title: "Source" },
    { id: "sourceType", title: "Source Type" },
    { id: "verificationStatus", title: "Verification Status" },
    { id: "extractionStatus", title: "Extraction Status" },
    { id: "summary", title: "Job Summary" },
    { id: "requiredSkills", title: "Required Skills" },
    { id: "llmConfidence", title: "LLM Confidence" },
    { id: "missingFields", title: "Missing Fields" },
    { id: "llmEvidenceNotes", title: "LLM Evidence Notes" },
    { id: "llmCleaningStatus", title: "LLM Cleaning Status" },
];

// csv-writer joins arrays with commas, which corrupts the column layout,
// so list-valued fields are joined into a single string first.
function toCsvRow(job) {
    return {
        ...job,
        url: job.url || "",
        title: job.extractedJobTitle || job.title || "",
        company: job.company || "",
        location: job.location || "",
        jobType: job.jobType || "",
        remoteStatus: job.remoteStatus || "",
        applicationUrl: job.applicationUrl || "",
        source: job.source || "",
        sourceType: job.sourceType || "",
        verificationStatus: job.verificationStatus || "",
        extractionStatus: job.extractionStatus || "",
        summary: job.summary || job.description || "",
        requiredSkills: Array.isArray(job.requiredSkills)
            ? job.requiredSkills.join("; ")
            : job.requiredSkills || "",
        llmConfidence: job.llmConfidence || "",
        missingFields: Array.isArray(job.missingFields)
            ? job.missingFields.join(", ")
            : job.missingFields || "",
        llmEvidenceNotes: job.llmEvidenceNotes || "",
        llmCleaningStatus: job.llmCleaningStatus || "",
    };
}

export async function exportJobsToCSV(jobs, outputPath) {
    if (!jobs.length) {
        console.log("No jobs available to export.");
        return null;
    }

    const filePath =
        outputPath || path.join(path.resolve("exports"), "jobs.csv");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: CSV_HEADER,
    });

    await csvWriter.writeRecords(jobs.map(toCsvRow));

    console.log(`Jobs exported successfully to: ${filePath}`);
    return filePath;
}
