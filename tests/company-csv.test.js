import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readCompaniesFromCSV } from "../src/services/company-csv.service.js";

function tempCsvFile(content) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "companies-"));
    const filePath = path.join(dir, "companies.csv");
    fs.writeFileSync(filePath, content, "utf8");
    return filePath;
}

test("readCompaniesFromCSV parses valid rows and keeps the careers URL", async () => {
    const filePath = tempCsvFile(
        "company,careersUrl\nGoogle,https://careers.google.com/\nAcme,not-a-url\n,Broken\n"
    );

    const companies = await readCompaniesFromCSV(filePath);

    assert.deepEqual(companies, [
        { company: "Google", careersUrl: "https://careers.google.com/" },
        { company: "Acme", careersUrl: "" },
    ]);
});

test("readCompaniesFromCSV resolves to an empty list for a missing file", async () => {
    const companies = await readCompaniesFromCSV(
        path.join(os.tmpdir(), "does-not-exist-companies.csv")
    );

    assert.deepEqual(companies, []);
});
