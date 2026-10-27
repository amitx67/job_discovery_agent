export function verifyJobResult(job) {
    const title = job.title || "";
    const content = job.extractedContent || "";
    const url = job.url || "";

    const text = `${title} ${content}`.toLowerCase();
    const normalizedUrl = url.toLowerCase();

    const jobKeywords =
        /\b(intern(ship)?|software engineer|developer|backend|frontend|full.?stack|graduate|entry.?level|junior|job opening|apply now)\b/i;

    const generalPageKeywords =
        /\b(job board|job listings|all openings|career opportunities|browse jobs)\b/i;

    const isJobSpecific = jobKeywords.test(title);

    const hasApplicationEvidence =
        /\b(apply now|apply for this job|submit application|job description|responsibilities|qualifications)\b/i
            .test(content);

    let sourceType = "other";

    if (
        normalizedUrl.includes("jobs.lever.co/") ||
        normalizedUrl.includes("boards.greenhouse.io/")
    ) {
        sourceType = "job_platform";
    } else if (
        normalizedUrl.includes("/careers/") ||
        normalizedUrl.includes("careers.") ||
        normalizedUrl.includes("/jobs/")
    ) {
        sourceType = "possible_company_careers_page";
    } else {
        sourceType = "third_party_or_unknown";
    }

    let verificationStatus = "needs_review";

    if (
        job.extractionStatus === "extracted" &&
        isJobSpecific &&
        hasApplicationEvidence &&
        !generalPageKeywords.test(title)
    ) {
        verificationStatus = "likely_job_listing";
    } else if (isJobSpecific) {
        verificationStatus = "possible_job_listing";
    } else {
        verificationStatus = "not_clearly_job_specific";
    }

    let jobType = "unknown";

    if (/\bintern(ship)?\b/i.test(title)) {
        jobType = "internship";
    } else if (
        /\b(full.?time|permanent|graduate|junior|entry.?level)\b/i.test(title)
    ) {
        jobType = "possible_full_time";
    }

    return {
        ...job,
        sourceType,
        verificationStatus,
        jobType,
        applicationEvidenceFound: hasApplicationEvidence,
        openStatus: "unknown"
    };
}
