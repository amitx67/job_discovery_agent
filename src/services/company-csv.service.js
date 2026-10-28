import fs from "node:fs";
import path from "node:path";
import csv from "csv-parser";

export function readCompaniesFromCSV() {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve("data/companies.csv");
        const companies = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                const company = row.company?.trim();
                const careersUrl = row.careersUrl?.trim();

                if (company && careersUrl) {
                    companies.push({ company, careersUrl });
                }
            })
            .on("end", () => resolve(companies))
            .on("error", reject);
    });
}
