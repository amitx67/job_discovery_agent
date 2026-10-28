import cron from "node-cron";
import { spawn } from "node:child_process";

let isRunning = false;

const runJobDiscovery = () => {
    if (isRunning) {
        console.log("Previous job discovery is still running. Skipping this run.");
        return;
    }

    isRunning = true;

    const process = spawn("node", ["index.js"], {
        stdio: "inherit",
    });

    process.on("error", (error) => {
        console.error("Failed to start job discovery:", error.message);
        isRunning = false;
    });

    process.on("close", (code) => {
        console.log(`Job discovery finished with exit code: ${code}`);
        isRunning = false;
    });
};

export const startScheduler = () => {
    cron.schedule("0 */6 * * *", () => {
        console.log("Scheduled job discovery triggered.");
        runJobDiscovery();
    });

    console.log("Job discovery scheduler started. Runs every 6 hours..");
};
