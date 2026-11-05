import { normalizeUrl } from "./url.js";

// Remove repeated job results even when their URLs differ only by scheme,
// trailing slash, default port or tracking parameters. When the same page
// appears twice, the result with the higher search score is kept.
export function dedupeJobs(jobs) {
    const bestByKey = new Map();
    const ordered = [];

    for (const job of jobs) {
        const normalized = normalizeUrl(job?.url) ?? job?.url?.trim().toLowerCase();

        if (!normalized) {
            continue;
        }

        // The dedup key ignores the scheme: http/https variants of the same
        // page are treated as one listing.
        const key = normalized.replace(/^https?:/, "");

        const existing = bestByKey.get(key);

        if (!existing) {
            bestByKey.set(key, job);
            ordered.push(job);
            continue;
        }

        const newScore = job.score ?? -1;
        const existingScore = existing.score ?? -1;

        if (newScore > existingScore) {
            const index = ordered.indexOf(existing);
            ordered[index] = job;
            bestByKey.set(key, job);
        }
    }

    return ordered;
}
