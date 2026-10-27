import "dotenv/config";
import { searchJobs } from "./src/services/tavily.service.js";
import { exportJobsToCSV } from "./src/services/export.service.js";

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
        await exportJobsToCSV(allJobs);


        
    } catch (error) {
    console.error("Job search failed:", error.message);
}
    
}

main();