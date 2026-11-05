import { tavily } from "@tavily/core";
import { config, requireEnv } from "../config/env.js";

const tvly = tavily({ apiKey: requireEnv("TAVILY_API_KEY") });

export async function searchJobs(query, maxResults = config.searchMaxResults) {
    if (!query || typeof query !== "string") {
        throw new Error("valid query is required");
    }

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await tvly.search(query, {
                searchDepth: "basic",
                maxResults,
                topic: "general",
            });

            return response.results.map((result) => ({
                title: result.title,
                url: result.url,
                content: result.content,
                score: result.score,
            }));
        } catch (error) {
            console.error(
                `Tavily search attempt ${attempt}/${maxAttempts} failed:`,
                error.message
            );

            if (attempt === maxAttempts) {
                throw error;
            }

            await new Promise((resolve) =>
                setTimeout(resolve, attempt * 2000)
            );
        }
    }
}

export async function extractJobContent(jobs, batchSize = config.extractBatchSize) {
    const extractedJobs = [];

    for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        const urls = batch.map((job) => job.url);

        try {
            const response = await tvly.extract(urls);

            const extractedByUrl = new Map(
                response.results.map((result) => [
                    result.url,
                    result.rawContent
                ])
            );

            for (const job of batch) {
                const content = extractedByUrl.get(job.url);

                extractedJobs.push({
                    ...job,
                    extractedContent: content || "",
                    extractionStatus: content
                        ? "extracted"
                        : "content_unavailable"
                });
            }
        } catch (error) {
            console.error("Content extraction failed:", error.message);

            for (const job of batch) {
                extractedJobs.push({
                    ...job,
                    extractedContent: "",
                    extractionStatus: "extraction_failed"
                });
            }
        }
    }

    return extractedJobs;
}
