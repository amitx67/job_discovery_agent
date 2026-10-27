
import Job from "../models/job.model.js";

const saveJobsToDB = async (jobs) => {
    try {
        let savedCount = 0;
        let duplicateCount = 0;
        let failedCount = 0;

        for (const job of jobs) {
            try {
                if (!job.title || !job.url) {
                    failedCount++;
                    continue;
                }

                await Job.updateOne(
                    { url: job.url },
                    {
                        $set: {
                            title: job.title,
                            company: job.company || "Unknown",
                            location: job.location || "Unknown",
                            jobType: job.jobType || "Unknown",
                            url: job.url,
                            description: job.description || "",
                            source: job.source || "Unknown",
                            verificationStatus:
                                job.verificationStatus || "unverified",
                        },
                    },
                    { upsert: true }
                );

                savedCount++;
            } catch (error) {
                if (error.code === 11000) {
                    duplicateCount++;
                } else {
                    failedCount++;
                    console.error(
                        `Failed to save job "${job.title}":`,
                        error.message
                    );
                }
            }
        }

        console.log("MongoDB save results:");
        console.log(`Saved or updated: ${savedCount}`);
        console.log(`Duplicates: ${duplicateCount}`);
        console.log(`Failed or skipped: ${failedCount}`);

        return { savedCount, duplicateCount, failedCount };
    } catch (error) {
        console.error("Database service failed:", error.message);
        throw error;
    }
};

export default saveJobsToDB;
