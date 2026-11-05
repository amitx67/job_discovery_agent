import { extractDomain } from "./url.js";

export const DEFAULT_JOB_TYPES = [
    "software engineering intern",
    "junior backend developer",
];

export const DEFAULT_BASE_QUERIES = [
    '"software engineering intern" careers 2026',
    '"junior backend developer" entry level jobs',
    "remote software developer internships worldwide",
    "site:jobs.lever.co software engineer intern",
    "site:boards.greenhouse.io backend developer intern",
];

// Builds the full query list for a discovery run:
//   1. generic base queries,
//   2. one query per (company, job type) pair,
//   3. one site-restricted query per (company careers domain, job type).
// The list is capped so a large companies.csv cannot explode API usage.
export function buildDiscoveryQueries({
    companies = [],
    jobTypes = DEFAULT_JOB_TYPES,
    baseQueries = DEFAULT_BASE_QUERIES,
    maxQueries = 40,
} = {}) {
    const queries = [...baseQueries];

    for (const { company, careersUrl } of companies) {
        const careersDomain = careersDomainFromUrl(careersUrl);

        for (const jobType of jobTypes) {
            queries.push(`"${company}" "${jobType}" jobs`);

            if (careersDomain) {
                queries.push(`site:${careersDomain} ${jobType}`);
            }
        }
    }

    const uniqueQueries = [...new Set(queries)];

    if (uniqueQueries.length > maxQueries) {
        console.warn(
            `Query list truncated from ${uniqueQueries.length} to ${maxQueries} ` +
            `(MAX_QUERIES). Reduce companies.csv or raise the limit.`
        );
    }

    return uniqueQueries.slice(0, maxQueries);
}

// "https://careers.google.com/" -> "careers.google.com"
export function careersDomainFromUrl(careersUrl) {
    if (!careersUrl) {
        return "";
    }

    const domain = extractDomain(careersUrl);
    return domain === "Unknown" ? "" : domain;
}
