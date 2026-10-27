
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import connectToDB from "./src/config/db.js";
import jobRouter from "./src/routes/job.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Job Discovery API is running",
    });
});

app.use("/api/jobs", jobRouter);

async function startServer() {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`API server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start API server:", error.message);
        await mongoose.disconnect().catch(() => {});
        process.exitCode = 1;
    }
}

startServer();
