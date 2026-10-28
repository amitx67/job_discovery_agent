import Job from "../models/job.model.js";

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Failed to fetch jobs:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
        });
    }
};
