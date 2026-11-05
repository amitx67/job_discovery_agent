import fs from "node:fs";
import path from "node:path";
import csv from "csv-parser";

// Reads data/companies.csv (header: company,careersUrl). Missing or
// malformed files resolve to an empty list so the pipeline can still run
// with generic queries instead of crashing.
export function readCompaniesFromCSV(filePath = path.resolve("data/companies.csv")) {
    return new Promise((resolve) => {
        if (!fs.existsSync(filePath)) {
            console.warn(
                `Companies file not found: ${filePath} - continuing without company queries.`
            );
            resolve([]);
            return;
        }

        const companies = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                const company = row.company?.trim();
                const careersUrl = row.careersUrl?.trim();

                if (!company) {
                    return;
                }

                let validCareersUrl = "";

                if (careersUrl) {
                    try {
                        const parsed = new URL(careersUrl);

                        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
                            validCareersUrl = parsed.toString();
                        }
                    } catch {
                        // Ignore malformed careers URLs; the company is still usable.
                    }
                }

                companies.push({ company, careersUrl: validCareersUrl });
            })
            .on("end", () => resolve(companies))
            .on("error", (error) => {
                console.error("Failed to read companies CSV:", error.message);
                resolve([]);
            });
    });
}
