import cron from "node-cron";
import { config } from "../config/env.js";
import { runDiscoveryPipeline } from "../pipeline.js";

let isRunning = false;

// Runs the pipeline in-process (the API server keeps its MongoDB
// connection, so no child process and no reconnection is needed).
export async function runScheduledDiscovery() {
    if (isRunning) {
        console.log("Previous job discovery is still running. Skipping this run.");
        return { status: "skipped" };
    }

    isRunning = true;

    try {
        const summary = await runDiscoveryPipeline({ disconnectDb: false });
        console.log("Scheduled job discovery finished:", summary.status);
        return summary;
    } catch (error) {
        console.error("Scheduled job discovery failed:", error.message);
        return { status: "failed", error: error.message };
    } finally {
        isRunning = false;
    }
}

export function startScheduler() {
    if (!cron.validate(config.schedulerCron)) {
        throw new Error(
            `Invalid SCHEDULER_CRON expression: "${config.schedulerCron}"`
        );
    }

    cron.schedule(config.schedulerCron, () => {
        console.log("Scheduled job discovery triggered.");
        runScheduledDiscovery();
    });

    console.log(
        `Job discovery scheduler started (cron: ${config.schedulerCron}). ` +
        `Set ENABLE_SCHEDULER=false to disable.`
    );
}
