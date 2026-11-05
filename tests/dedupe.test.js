import { test } from "node:test";
import assert from "node:assert/strict";
import { dedupeJobs } from "../src/utils/dedupe.js";

test("dedupeJobs merges URLs that differ only by scheme, slash or tracking params", () => {
    const jobs = [
        { title: "A", url: "https://example.com/jobs/123", score: 0.7 },
        { title: "B", url: "http://example.com/jobs/123/", score: 0.9 },
        { title: "C", url: "https://example.com/jobs/123?utm_source=x", score: 0.5 },
    ];

    const result = dedupeJobs(jobs);

    assert.equal(result.length, 1);
    assert.equal(result[0].title, "B");
});

test("dedupeJobs keeps distinct URLs", () => {
    const jobs = [
        { title: "A", url: "https://example.com/jobs/1", score: 0.5 },
        { title: "B", url: "https://example.com/jobs/2", score: 0.6 },
    ];

    assert.equal(dedupeJobs(jobs).length, 2);
});

test("dedupeJobs skips results without a usable URL", () => {
    const jobs = [
        { title: "A", url: "", score: 0.5 },
        { title: "B", url: "https://example.com/jobs/1", score: 0.5 },
    ];

    const result = dedupeJobs(jobs);

    assert.equal(result.length, 1);
    assert.equal(result[0].title, "B");
});

test("dedupeJobs preserves input order of first appearances", () => {
    const jobs = [
        { title: "First", url: "https://a.com/1", score: 0.9 },
        { title: "Second", url: "https://b.com/2", score: 0.8 },
        { title: "First dup", url: "https://a.com/1?utm_campaign=z", score: 0.95 },
    ];

    const result = dedupeJobs(jobs);

    assert.deepEqual(
        result.map((job) => job.title),
        ["First dup", "Second"]
    );
});
