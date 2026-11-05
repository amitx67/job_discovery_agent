import { test } from "node:test";
import assert from "node:assert/strict";
import {
    buildDiscoveryQueries,
    careersDomainFromUrl,
    DEFAULT_BASE_QUERIES,
} from "../src/utils/query-builder.js";

test("buildDiscoveryQueries includes the generic base queries", () => {
    const queries = buildDiscoveryQueries({ companies: [] });

    for (const baseQuery of DEFAULT_BASE_QUERIES) {
        assert.ok(queries.includes(baseQuery));
    }
});

test("buildDiscoveryQueries adds company and site-restricted queries", () => {
    const queries = buildDiscoveryQueries({
        companies: [
            { company: "Google", careersUrl: "https://careers.google.com/" },
        ],
        jobTypes: ["software engineering intern"],
    });

    assert.ok(queries.includes('"Google" "software engineering intern" jobs'));
    assert.ok(queries.includes("site:careers.google.com software engineering intern"));
});

test("buildDiscoveryQueries ignores empty or invalid careers URLs", () => {
    const queries = buildDiscoveryQueries({
        companies: [{ company: "Acme", careersUrl: "" }],
        jobTypes: ["intern"],
        baseQueries: ["generic software jobs"],
    });

    assert.ok(queries.includes('"Acme" "intern" jobs'));
    assert.ok(!queries.some((query) => query.startsWith("site:")));
});

test("buildDiscoveryQueries deduplicates and caps the list", () => {
    const queries = buildDiscoveryQueries({
        companies: [],
        baseQueries: ["same query", "same query"],
        maxQueries: 1,
    });

    assert.equal(queries.length, 1);
});

test("careersDomainFromUrl extracts a usable domain", () => {
    assert.equal(careersDomainFromUrl("https://www.atlassian.com/company/careers"), "atlassian.com");
    assert.equal(careersDomainFromUrl(""), "");
    assert.equal(careersDomainFromUrl("not-a-url"), "");
});
