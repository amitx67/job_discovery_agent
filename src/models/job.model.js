import mongoose from "mongoose";

const JOB_TYPES = ["internship", "full_time", "part_time", "contract", "unknown"];
const REMOTE_STATUSES = ["remote", "hybrid", "onsite", "unknown"];
const LLM_CONFIDENCE = ["low", "medium", "high"];

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
            enum: JOB_TYPES,
            default: "unknown",
            lowercase: true,
            trim: true,
        },
        remoteStatus: {
            type: String,
            enum: REMOTE_STATUSES,
            default: "unknown",
            lowercase: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        applicationUrl: {
            type: String,
            default: null,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        summary: {
            type: String,
            default: "",
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        source: {
            type: String,
            default: "Unknown",
        },
        sourceType: {
            type: String,
            default: "third_party_or_unknown",
        },
        verificationStatus: {
            type: String,
            default: "unverified",
        },
        verificationEvidence: {
            type: String,
            default: "",
        },
        extractionStatus: {
            type: String,
            default: "unknown",
        },
        llmCleaningStatus: {
            type: String,
            default: "not_processed",
        },
        llmConfidence: {
            type: String,
            enum: LLM_CONFIDENCE,
            default: "low",
            lowercase: true,
        },
        llmEvidenceNotes: {
            type: String,
            default: "",
        },
        missingFields: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes matching the filters used by the API.
jobSchema.index({ company: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ remoteStatus: 1 });
jobSchema.index({ verificationStatus: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
