import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyJobResult } from "../src/services/verification.service.js";

test("a specific internship listing with application evidence is verified", () => {
    const job = verifyJobResult({
        title: "Software Engineer Intern",
        url: "https://example.com/careers/software-engineer-intern",
        extractedContent:
            "Responsibilities include building features. Apply now on our careers page.",
        extractionStatus: "extracted",
    });

    assert.equal(job.jobType, "internship");
    assert.equal(job.verificationStatus, "possible_individual_listing");
    assert.equal(job.applicationEvidenceFound, true);
    assert.equal(job.source, "example.com");
});

test("a general jobs board page is classified as general_jobs_page", () => {
    const job = verifyJobResult({
        title: "Browse Jobs - The Internship Directory",
        url: "https://boards.example.com/all",
        extractedContent: "lots of listings",
        extractionStatus: "extracted",
    });

    assert.equal(job.verificationStatus, "general_jobs_page");
});

test("lever and greenhouse URLs are classified as job_platform", () => {
    const job = verifyJobResult({
        title: "Backend Engineer",
        url: "https://jobs.lever.co/acme/1234",
        extractedContent: "",
        extractionStatus: "content_unavailable",
    });

    assert.equal(job.sourceType, "job_platform");
});

test("a company domain from the CSV list is classified as company_careers_page", () => {
    const job = verifyJobResult(
        {
            title: "Backend Developer Intern",
            url: "https://careers.google.com/jobs/results/123",
            extractedContent: "",
            extractionStatus: "extracted",
        },
        ["careers.google.com"]
    );

    assert.equal(job.sourceType, "company_careers_page");
    assert.equal(job.source, "careers.google.com");
});

test("company name is extracted from 'X - role' and 'role at X' titles", () => {
    const dash = verifyJobResult({
        title: "Acme Corp - Backend Developer Intern",
        url: "https://example.com/1",
    });

    const at = verifyJobResult({
        title: "Backend Developer Intern at Globex",
        url: "https://example.com/2",
    });

    assert.equal(dash.company, "Acme Corp");
    assert.equal(at.company, "Globex");
});

test("location is picked up from page text and remote titles", () => {
    const fromText = verifyJobResult({
        title: "Backend Developer",
        url: "https://example.com/1",
        extractedContent: "Location: Berlin, Germany",
    });

    const fromTitle = verifyJobResult({
        title: "Remote Software Engineer Intern",
        url: "https://example.com/2",
    });

    assert.equal(fromText.location, "Berlin, Germany");
    assert.equal(fromTitle.location, "Remote (eligibility unverified)");
});

test("full-time keywords map to the full_time job type", () => {
    const job = verifyJobResult({
        title: "Junior Backend Developer (Entry Level)",
        url: "https://example.com/1",
    });

    assert.equal(job.jobType, "full_time");
});
