// URL helpers used for deduplication, database keys and source attribution.

// Query parameters that only track campaigns/sessions and never change the
// page a URL points at. Normalizing them away merges duplicate listings.
const TRACKING_PARAMS = new Set([
    "gclid", "fbclid", "dclid", "msclkid", "yclid", "igshid",
    "ref", "referrer", "source", "_ga", "_gl", "_hsenc", "_hsmi",
]);

const TRACKING_PARAM_PREFIXES = ["utm_", "mc_", "hsa_"];

export function normalizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") {
        return null;
    }

    let parsed;

    try {
        parsed = new URL(rawUrl.trim());
    } catch {
        return null;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
    }

    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();

    // Drop the default port for the scheme (http :80 / https :443).
    if (
        (parsed.protocol === "http:" && parsed.port === "80") ||
        (parsed.protocol === "https:" && parsed.port === "443")
    ) {
        parsed.port = "";
    }

    // Fragments never change the page the server returns.
    parsed.hash = "";

    const paramsToRemove = [...parsed.searchParams.keys()].filter((key) => {
        const lowerKey = key.toLowerCase();
        return (
            TRACKING_PARAMS.has(lowerKey) ||
            TRACKING_PARAM_PREFIXES.some((prefix) => lowerKey.startsWith(prefix))
        );
    });

    for (const key of paramsToRemove) {
        parsed.searchParams.delete(key);
    }

    // Collapse trailing slashes in the path ("jobs/defrag/" -> "jobs/defrag").
    if (parsed.pathname.length > 1) {
        parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    return parsed.toString();
}

// "https://www.Careers.Example.com/jobs" -> "example.com"
export function extractDomain(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") {
        return "Unknown";
    }

    try {
        const { hostname } = new URL(rawUrl.trim());
        return hostname.toLowerCase().replace(/^www\./, "") || "Unknown";
    } catch {
        return "Unknown";
    }
}
