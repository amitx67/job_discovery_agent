// Minimal in-memory fixed-window rate limiter (no external dependency).
// Good enough for a learning project running a single API instance.
export function createRateLimiter({ windowMs = 60_000, max = 120 } = {}) {
    const hits = new Map(); // ip -> { count, resetAt }

    function sweep(now) {
        if (hits.size < 5_000) {
            return;
        }

        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) {
                hits.delete(key);
            }
        }
    }

    return function rateLimiter(req, res, next) {
        const now = Date.now();
        const key = req.ip || "unknown";

        sweep(now);

        const entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count += 1;

        if (entry.count > max) {
            res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
            });
        }

        next();
    };
}
