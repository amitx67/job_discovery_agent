import mongoose from "mongoose";
import Job from "../models/job.model.js";

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Exact-match (case-insensitive) filters use anchored regexes; partial
// filters use loose regexes. All user input is escaped before use.
function buildFilter(query) {
    const filter = {};
    const {
        company,
        jobType,
        location,
        remoteStatus,
        verificationStatus,
        sourceType,
        llmConfidence,
        source,
        q,
    } = query;

    if (company) {
        filter.company = { $regex: escapeRegExp(company), $options: "i" };
    }

    if (jobType) {
        filter.jobType = { $regex: `^${escapeRegExp(jobType)}$`, $options: "i" };
    }

    if (location) {
        filter.location = { $regex: escapeRegExp(location), $options: "i" };
    }

    if (remoteStatus) {
        filter.remoteStatus = {
            $regex: `^${escapeRegExp(remoteStatus)}$`,
            $options: "i",
        };
    }

    if (verificationStatus) {
        filter.verificationStatus = {
            $regex: `^${escapeRegExp(verificationStatus)}$`,
            $options: "i",
        };
    }

    if (sourceType) {
        filter.sourceType = {
            $regex: `^${escapeRegExp(sourceType)}$`,
            $options: "i",
        };
    }

    if (llmConfidence) {
        filter.llmConfidence = {
            $regex: `^${escapeRegExp(llmConfidence)}$`,
            $options: "i",
        };
    }

    if (source) {
        filter.source = { $regex: `^${escapeRegExp(source)}$`, $options: "i" };
    }

    // Free-text search across title, company and description/summary.
    if (q) {
        const pattern = { $regex: escapeRegExp(q), $options: "i" };
        filter.$or = [
            { title: pattern },
            { company: pattern },
            { description: pattern },
        ];
    }

    return filter;
}

export const getAllJobs = async (req, res) => {
    try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
        );

        const filter = buildFilter(req.query);

        const [total, jobs] = await Promise.all([
            Job.countDocuments(filter),
            Job.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
        ]);

        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
            page,
            totalPages: Math.ceil(total / limit) || 1,
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

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job id",
            });
        }

        const job = await Job.findById(id).lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({ success: true, job });
    } catch (error) {
        console.error("Failed to fetch job:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch job",
        });
    }
};

// Aggregate counts that make the stored data quality visible at a glance.
export const getJobStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [
            total,
            byJobType,
            byRemoteStatus,
            byVerificationStatus,
            topCompanies,
            withApplicationUrl,
            foundLast7Days,
        ] = await Promise.all([
            Job.countDocuments({}),
            Job.aggregate([
                { $group: { _id: "$jobType", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Job.aggregate([
                { $group: { _id: "$remoteStatus", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Job.aggregate([
                { $group: { _id: "$verificationStatus", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Job.aggregate([
                { $match: { company: { $nin: [null, "", "Unknown"] } } },
                { $group: { _id: "$company", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
            Job.countDocuments({
                applicationUrl: { $nin: [null, ""] },
            }),
            Job.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        ]);

        res.status(200).json({
            success: true,
            total,
            withApplicationUrl,
            foundLast7Days,
            byJobType,
            byRemoteStatus,
            byVerificationStatus,
            topCompanies,
        });
    } catch (error) {
        console.error("Failed to compute job stats:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to compute job stats",
        });
    }
};
