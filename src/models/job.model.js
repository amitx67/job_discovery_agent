import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            default: "Unknown",
            trim: true,
        },
        location: {
            type: String,
            default: "Unknown",
            trim: true,
        },
        jobType: {
            type: String,
            default: "Unknown",
            trim: true,
        },
        remoteStatus: {
            type: String,
            enum: ["remote", "hybrid", "onsite", "unknown"],
            default: "unknown",
            trim: true,
        },
        url: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        source: {
            type: String,
            default: "Unknown",
        },
        verificationStatus: {
            type: String,
            default: "unverified",
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
