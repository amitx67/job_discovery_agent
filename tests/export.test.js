import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { exportJobsToCSV } from "../src/services/export.service.js";

function tempCsvPath() {
    return path.join(
        fs.mkdtempSync(path.join(os.tmpdir(), "jobs-export-")),
        "jobs.csv"
    );
}

test("exportJobsToCSV writes identity columns plus LLM columns", async () => {
    const filePath = tempCsvPath();

    await exportJobsToCSV(
        [
            {
                url: "https://example.com/jobs/1",
                title: "Search result title",
                extractedJobTitle: "Backend Developer Intern",
                company: "Acme",
                location: "Berlin",
                jobType: "internship",
                remoteStatus: "hybrid",
                source: "example.com",
                sourceType: "company_careers_page",
                verificationStatus: "possible_individual_listing",
                extractionStatus: "extracted",
                summary: "Build APIs with Node.js",
                requiredSkills: ["Node.js", "Express"],
                llmConfidence: "high",
                missingFields: ["location"],
                llmEvidenceNotes: "All fields supported by the page.",
                llmCleaningStatus: "cleaned",
            },
        ],
        filePath
    );

    const csvText = fs.readFileSync(filePath, "utf8");
    const lines = csvText.trim().split("\n");

    assert.equal(lines.length, 2);
    assert.ok(lines[0].includes('"URL"') || lines[0].includes("URL"));
    assert.ok(lines[0].includes("Job Title"));
    assert.ok(lines[0].includes("Company"));
    assert.ok(lines[0].includes("Required Skills"));
    assert.ok(csvText.includes("Backend Developer Intern"));
    assert.ok(csvText.includes("Node.js; Express"));
    assert.ok(csvText.includes("location"));
});

test("exportJobsToCSV returns null and writes nothing for an empty list", async () => {
    const filePath = tempCsvPath();
    const result = await exportJobsToCSV([], filePath);

    assert.equal(result, null);
    assert.equal(fs.existsSync(filePath), false);
});
