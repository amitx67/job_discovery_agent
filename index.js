import "dotenv/config";
import { searchJobs } from "./src/services/tavily.service.js";
import { exportJobsToCSV } from "./src/services/export.service.js";
import { extractJobContent } from "./src/services/tavily.service.js";
import { verifyJobResult } from "./src/services/verification.service.js";

async function main() {

    try {

        const queries = [
            '"software engineering intern" careers 2026',
            '"junior backend developer" entry level jobs',
            'remote software developer internships worldwide',
            'site:jobs.lever.co software engineer intern',
            'site:boards.greenhouse.io backend developer intern'
        ];

        const seenUrls = new Set();
        const allJobs = [];

        for (const query of queries) {
            console.log(`\nSearching: ${query}`);

            const results = await searchJobs(query, 5);

            for (const result of results) {
                if (seenUrls.has(result.url)) {
                    continue;
                }

                seenUrls.add(result.url);
                allJobs.push(result);

                console.log({
                    title: result.title,
                    url: result.url,
                    score: result.score
                });
            }
        }

        
console.log(`\nTotal unique search results: ${allJobs.length}`);

console.log("\nExtracting webpage content...");

const extractedJobs = await extractJobContent(allJobs);

console.log("\nVerifying job evidence...");

const verifiedJobs = extractedJobs.map((job) =>
    verifyJobResult(job)
);

for (const job of verifiedJobs) {
    console.log({
        title: job.title,
        verificationStatus: job.verificationStatus,
        extractionStatus: job.extractionStatus,
        openStatus: job.openStatus
    });
}

await exportJobsToCSV(verifiedJobs);



        
    } catch (error) {
    console.error("Job search failed:", error.message);
}
    
}

main();