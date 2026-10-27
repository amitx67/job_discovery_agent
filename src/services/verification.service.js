
export function verifyJobResult(job) {
    const title = job.title || "";
    const content = job.extractedContent || "";
    const url = job.url || "";

    const text = `${title}\n${content}`;
    const lowerText = text.toLowerCase();
    const normalizedUrl = url.toLowerCase();

    // Identify whether the result looks like a specific vacancy.
    const jobTitlePattern =
        /\b(software engineer|software developer|backend engineer|backend developer|frontend engineer|frontend developer|full.?stack developer|data analyst|data engineer|machine learning engineer|web developer|devops engineer|qa engineer|product intern|engineering intern|developer intern|software intern|graduate engineer|junior developer)\b/i;

    const internshipPattern = /\b(intern|internship|internships)\b/i;

    const fullTimePattern =
        /\b(full.?time|permanent|junior|entry.?level|graduate role)\b/i;

    const generalPagePattern =
        /\b(job board|job listings|all openings|career opportunities|browse jobs|internship list|internship directory|search open positions)\b/i;

    const applicationPattern =
        /\b(apply now|apply for this job|submit application|job description|responsibilities|qualifications|minimum qualifications|requirements)\b/i;

    const hasJobTitle = jobTitlePattern.test(title);
    const hasApplicationEvidence = applicationPattern.test(content);
    const looksLikeGeneralPage = generalPagePattern.test(title);

    // Determine the source category.
    let sourceType = "third_party_or_unknown";

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
    }

    // Extract a possible company name from common title formats.
    let company = "Unknown";

    const companyTitleMatch = title.match(
        /^(.+?)\s+-\s+(.+?(?:intern|internship|engineer|developer|analyst).*)$/i
    );

    if (companyTitleMatch) {
        company = companyTitleMatch[1].trim();
    } else {
        const companyAtMatch = title.match(
            /^(.+?)\s+at\s+(.+)$/i
        );

        if (companyAtMatch) {
            company = companyAtMatch[2].trim();
        }
    }

    // Extract a possible location from the page text.
    let location = "Not specified";

    const locationMatch = text.match(
        /(?:location|based in|office location)\s*[:\-]\s*([^\n\r|]{2,80})/i
    );

    if (locationMatch) {
        location = locationMatch[1].trim();
    } else if (/\bremote\b/i.test(title)) {
        location = "Remote (eligibility unverified)";
    }

    // Determine the likely job type.
    let jobType = "unknown";

    if (internshipPattern.test(title)) {
        jobType = "internship";
    } else if (fullTimePattern.test(title)) {
        jobType = "possible_full_time";
    }

    // Build a more cautious verification status.
    let verificationStatus = "needs_review";

    if (looksLikeGeneralPage) {
        verificationStatus = "general_jobs_page";
    } else if (
        hasJobTitle &&
        hasApplicationEvidence &&
        job.extractionStatus === "extracted"
    ) {
        verificationStatus = "possible_individual_listing";
    } else if (hasJobTitle || internshipPattern.test(title)) {
        verificationStatus = "possible_job_listing";
    } else {
        verificationStatus = "not_clearly_job_specific";
    }

    // Keep the original URL until a separate application link is verified.
    const applicationUrl = url;

    return {
        ...job,
        company,
        extractedJobTitle: title,
        location,
        jobType,
        sourceType,
        applicationUrl,
        applicationEvidenceFound: hasApplicationEvidence,
        verificationStatus,
        openStatus: "unknown",
        verificationEvidence: [
            job.extractionStatus === "extracted"
                ? "Page content extracted"
                : "Page content unavailable",
            hasJobTitle
                ? "Title matches a known technical job-title pattern"
                : "No recognised technical job title in page title",
            hasApplicationEvidence
                ? "Application-related wording found in page content"
                : "No application-related wording detected"
        ].join("; ")
    };
}
