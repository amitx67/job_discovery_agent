import "dotenv/config";
import { runDiscoveryPipeline } from "./src/pipeline.js";

// CLI entry point for a one-off discovery run.
// The API server runs the same pipeline through the scheduler
// (see server.js and src/services/scheduler.service.js).
async function main() {
    try {
        const summary = await runDiscoveryPipeline({ disconnectDb: true });

        console.log("\nJob discovery pipeline completed successfully.");
        console.log(JSON.stringify(summary, null, 2));
    } catch (error) {
        console.error("Job discovery failed:", error.message);
        process.exitCode = 1;
    }
}

main();
