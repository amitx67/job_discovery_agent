import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeUrl, extractDomain } from "../src/utils/url.js";

test("normalizeUrl lowercases host and drops default ports", () => {
    assert.equal(
        normalizeUrl("HTTPS://WWW.Example.COM:443/jobs"),
        "https://www.example.com/jobs"
    );
    assert.equal(
        normalizeUrl("http://example.com:80/jobs"),
        "http://example.com/jobs"
    );
});

test("normalizeUrl removes tracking parameters", () => {
    assert.equal(
        normalizeUrl("https://example.com/jobs?utm_source=x&id=3"),
        "https://example.com/jobs?id=3"
    );
    assert.equal(
        normalizeUrl("https://example.com/?gclid=abc&ref=home&real=1"),
        "https://example.com/?real=1"
    );
});

test("normalizeUrl removes hash and trailing slash", () => {
    assert.equal(
        normalizeUrl("https://example.com/jobs/defrag/#apply"),
        "https://example.com/jobs/defrag"
    );
});

test("normalizeUrl keeps meaningful query parameters", () => {
    assert.equal(
        normalizeUrl("https://jobs.example.com/listing?page=2"),
        "https://jobs.example.com/listing?page=2"
    );
});

test("normalizeUrl returns null for invalid or non-http URLs", () => {
    assert.equal(normalizeUrl("not a url"), null);
    assert.equal(normalizeUrl("ftp://example.com/file"), null);
    assert.equal(normalizeUrl(undefined), null);
    assert.equal(normalizeUrl(""), null);
});

test("extractDomain strips www and is case-insensitive", () => {
    assert.equal(extractDomain("https://WWW.Example.com/jobs"), "example.com");
    assert.equal(extractDomain("https://careers.google.com/"), "careers.google.com");
});

test("extractDomain falls back to Unknown", () => {
    assert.equal(extractDomain("garbage"), "Unknown");
    assert.equal(extractDomain(null), "Unknown");
});
