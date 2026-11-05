import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { config } from "./src/config/env.js";
import connectToDB from "./src/config/db.js";
import jobRouter from "./src/routes/job.routes.js";
import { createRateLimiter } from "./src/middleware/rate-limiter.js";
import { startScheduler } from "./src/services/scheduler.service.js";

const app = express();

app.use(express.json());
app.use("/api", createRateLimiter({ windowMs: 60_000, max: 120 }));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Job Discovery API is running",
    });
});

app.use("/api/jobs", jobRouter);

// 404 handler for unknown routes (Express 5 requires "/*splat" for
// wildcard paths, so a catch-all middleware is simpler and safer).
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Central error handler (Express 5 forwards rejected promises here).
app.use((error, req, res, next) => {
    console.error("Unhandled API error:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    res.status(error.status || 500).json({
        success: false,
        message: "Internal server error",
    });
});

async function startServer() {
    try {
        await connectToDB();

        const server = app.listen(config.port, () => {
            console.log(`API server running at http://localhost:${config.port}`);

            if (config.enableScheduler) {
                startScheduler();
            } else {
                console.log(
                    "Scheduler disabled (set ENABLE_SCHEDULER=true to run " +
                    "periodic job discovery inside this server)."
                );
            }
        });

        // Graceful shutdown: stop accepting connections, close the
        // scheduler interval, then close MongoDB.
        async function shutdown(signal) {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                await mongoose.disconnect().catch(() => {});
                process.exit(0);
            });

            // Force-exit if connections do not drain in time.
            setTimeout(() => process.exit(1), 10_000).unref();
        }

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.error("Failed to start API server:", error.message);
        await mongoose.disconnect().catch(() => {});
        process.exitCode = 1;
    }
}

startServer();
