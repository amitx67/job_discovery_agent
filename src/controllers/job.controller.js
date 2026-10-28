import Job from "../models/job.model.js";

export const getAllJobs = async (req, res) => {
    try {
        const { company, jobType, location, remoteStatus } = req.query;

        const filter = {};

        if (company) {
            filter.company = {
                $regex: company,
                $options: "i"
            };
        }

        if (jobType) {
            filter.jobType = {
                $regex: `^${jobType}$`,
                $options: "i"
            };
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        if (remoteStatus) {
            filter.remoteStatus = {
                $regex: `^${remoteStatus}$`,
                $options: "i"
            };
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error("Failed to fetch jobs:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};
