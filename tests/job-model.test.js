import { test } from "node:test";
import assert from "node:assert/strict";
import Job from "../src/models/job.model.js";

test("a minimal job document passes validation and applies defaults", () => {
    const job = new Job({
        title: "Backend Developer Intern",
        url: "https://example.com/jobs/1",
    });

    const error = job.validateSync();

    assert.equal(error, undefined);
    assert.equal(job.jobType, "unknown");
    assert.equal(job.remoteStatus, "unknown");
    assert.equal(job.llmConfidence, "low");
    assert.deepEqual(job.requiredSkills, []);
});

test("invalid enum values fail validation", () => {
    const job = new Job({
        title: "Backend Developer Intern",
        url: "https://example.com/jobs/1",
        jobType: "wizard",
        llmConfidence: "certain",
    });

    const error = job.validateSync();

    assert.ok(error.errors.jobType);
    assert.ok(error.errors.llmConfidence);
});

test("title and url are required", () => {
    const job = new Job({});

    const error = job.validateSync();

    assert.ok(error.errors.title);
    assert.ok(error.errors.url);
});
