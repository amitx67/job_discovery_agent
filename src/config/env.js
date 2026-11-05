import "dotenv/config";

function optional(name, fallback) {
    const value = process.env[name];
    return value === undefined || value === "" ? fallback : value;
}

function toInt(name, fallback) {
    const parsed = Number.parseInt(optional(name, fallback), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(name, fallback) {
    const raw = optional(name, fallback);
    if (typeof raw === "boolean") return raw;
    return ["true", "1", "yes", "on"].includes(String(raw).toLowerCase());
}

export function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `${name} is missing from the environment. ` +
            `Add it to your .env file or export it before running the app.`
        );
    }
    return value;
}

export const config = {
    port: toInt("PORT", 8000),

    mongodbUri: optional("MONGODB_URI", ""),

    tavilyApiKey: optional("TAVILY_API_KEY", ""),
    googleApiKey: optional("GOOGLE_API_KEY", ""),
    geminiModel: optional("GEMINI_MODEL", "gemini-3.5-flash-lite"),

    // Scheduler (runs inside the API server when enabled)
    enableScheduler: toBool("ENABLE_SCHEDULER", false),
    schedulerCron: optional("SCHEDULER_CRON", "0 */6 * * *"),

    // Discovery pipeline tunables
    searchMaxResults: toInt("SEARCH_MAX_RESULTS", 5),
    maxQueries: toInt("MAX_QUERIES", 40),
    skipKnownJobs: toBool("SKIP_KNOWN_JOBS", true),
    extractBatchSize: toInt("EXTRACT_BATCH_SIZE", 20),
    llmBatchSize: toInt("LLM_BATCH_SIZE", 5),
    llmMaxPageContent: toInt("LLM_MAX_PAGE_CONTENT", 7000),

    // DNS servers used by the MongoDB connection (some hosting
    // environments cannot resolve Atlas SRV records with default DNS)
    dnsServers: optional("DNS_SERVERS", "8.8.8.8,1.1.1.1")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean),
};
