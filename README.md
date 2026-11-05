
<div align="center">

# 🤖 AI Job Discovery Agent

### AI-Powered Internship & Full-Time Job Discovery

An AI-powered job discovery system built with JavaScript, Express.js, MongoDB, Tavily, and Gemini. It searches for internship and full-time opportunities, extracts webpage content, verifies job-related evidence, cleans and normalizes results with an LLM, stores records in MongoDB Atlas, and exports them to CSV.

**Built as a learning project to explore AI agents, backend development, web search, data processing, and database integration.**

</div>

---

## 📌 About the Project

Finding relevant internships and entry-level jobs across different websites can be time-consuming. This project aims to automate the initial discovery and organization of job opportunities.

The application searches the web using predefined queries, removes duplicate URLs, extracts webpage content, applies rule-based verification, uses Gemini to normalize job information, saves records in MongoDB Atlas, and generates a CSV file.

This is an evolving project. The current version focuses on building a working end-to-end pipeline before adding production-level improvements.

## ✨ Features

### Implemented

- 🔎 **Web Search:** Discover job-related pages using Tavily.
- 🌍 **Worldwide Discovery:** Search queries include remote and international opportunities.
- 💼 **Multiple Job Types:** Search for internships, full-time roles, and entry-level positions.
- 🏢 **Company Queries from CSV:** `data/companies.csv` drives company-specific searches, including `site:` queries restricted to each company's careers domain.
- 🔗 **URL Normalization & Deduplication:** Tracking parameters, trailing slashes and scheme differences are normalized away before deduplication, across all queries.
- ⏭️ **Known-Job Skipping:** URLs already stored in MongoDB are skipped before extraction and LLM cleaning, saving API usage.
- 📄 **Content Extraction:** Extract webpage content for further processing.
- 🛡️ **Rule-Based Verification:** Classify results according to job-related evidence.
- 🧠 **AI-Powered Data Cleaning:** Use Gemini through LangChain to normalize job information.
- 🗄️ **MongoDB Atlas Integration:** Store and update job records using Mongoose — including LLM-cleaned fields (summary, skills, confidence, evidence).
- 📊 **CSV Export:** Export processed job records to `exports/jobs.csv` with full identity and AI fields.
- 🚀 **REST API:** Retrieve stored job records with pagination, filtering and aggregate statistics through Express.js.
- ⏱️ **Scheduled Discovery:** Optional in-process cron scheduler (enabled via `ENABLE_SCHEDULER=true`).
- 🧪 **Automated Tests:** Unit tests for URL normalization, deduplication, query building, verification, CSV export, company import and the Mongoose schema.
- ❤️ **Health Check:** Check whether the API is running.
- 🛑 **Graceful Shutdown:** SIGTERM/SIGINT close the server and MongoDB connection cleanly.
- 🚦 **Rate Limiting:** Simple in-memory rate limiter protects the API.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript (ES Modules) | Application logic |
| Node.js (>= 20) | JavaScript runtime |
| Express.js | REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| Tavily | Web search and webpage content extraction |
| Gemini | AI-powered job data cleaning |
| LangChain | Integration with AI models |
| node-cron | Scheduled job discovery |
| node:test | Automated tests (no extra dependency) |
| CSV | Exporting processed job records |

## 📁 Project Structure

```text
git_agent/
│
├── index.js                    # CLI entry point for a one-off discovery run
├── server.js                   # Express API (and optional scheduler host)
├── test-db.js                  # Standalone database connection test
├── package.json
├── .env                        # Local secrets (never commit)
├── .env.example                # Template for required/optional variables
├── README.md
│
├── data/
│   └── companies.csv           # Optional company list (company,careersUrl)
│
├── exports/
│   └── jobs.csv                # Generated CSV export
│
├── tests/                      # Automated tests (node --test)
│   ├── url.test.js
│   ├── dedupe.test.js
│   ├── query-builder.test.js
│   ├── verification.test.js
│   ├── export.test.js
│   ├── company-csv.test.js
│   └── job-model.test.js
│
└── src/
    ├── pipeline.js             # Reusable discovery pipeline (CLI + scheduler)
    ├── config/
    │   ├── env.js              # Central env config with defaults
    │   └── db.js               # MongoDB connection
    ├── controllers/
    │   └── job.controller.js   # List (paginated), stats, get-by-id
    ├── middleware/
    │   └── rate-limiter.js     # In-memory fixed-window rate limiter
    ├── models/
    │   └── job.model.js        # Mongoose schema + indexes
    ├── routes/
    │   └── job.routes.js
    ├── services/
    │   ├── tavily.service.js
    │   ├── export.service.js
    │   ├── verification.service.js
    │   ├── llm-cleaner.service.js
    │   ├── database.service.js
    │   ├── company-csv.service.js
    │   └── scheduler.service.js
    └── utils/
        ├── url.js              # URL normalization + domain extraction
        ├── dedupe.js           # Normalized-URL deduplication
        └── query-builder.js    # Query list construction
```

## ⚙️ How It Works

The current discovery pipeline follows these steps:

```text
Start Job Discovery
        |
        v
Load Companies from CSV (optional)
        |
        v
Build Queries (generic + company + site: queries)
        |
        v
Run Tavily Search Queries (a failing query is skipped, not fatal)
        |
        v
Normalize URLs and Deduplicate Across Queries
        |
        v
Skip URLs Already Stored in MongoDB (SKIP_KNOWN_JOBS)
        |
        v
Extract Webpage Content
        |
        v
Verify Job-Related Evidence (rules + known careers domains)
        |
        v
Clean and Normalize with Gemini
        |
        v
Save or Update Jobs in MongoDB (all cleaned fields persisted)
        |
        v
Export Jobs to CSV
        |
        v
Finish (run summary printed)
```

The Express API runs separately from the discovery pipeline and reads the stored job records from MongoDB. When `ENABLE_SCHEDULER=true`, the API server also runs the same pipeline on a cron schedule.

## 🚀 Getting Started

### Prerequisites

Install or configure the following before running the project:

- [Node.js](https://nodejs.org/) >= 20
- npm
- A MongoDB Atlas account and database
- A Tavily API key
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd git_agent
```

Replace `<your-repository-url>` with your actual repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the template and fill in your real values:

```bash
cp .env.example .env
```

Required variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
TAVILY_API_KEY=your_tavily_api_key
GOOGLE_API_KEY=your_google_api_key
```

Optional variables (defaults shown in `.env.example`) control the scheduler (`ENABLE_SCHEDULER`, `SCHEDULER_CRON`) and pipeline tuning (`SEARCH_MAX_RESULTS`, `MAX_QUERIES`, `SKIP_KNOWN_JOBS`, `EXTRACT_BATCH_SIZE`, `LLM_BATCH_SIZE`, `LLM_MAX_PAGE_CONTENT`, `DNS_SERVERS`).

**Security note:** Never commit `.env` or expose API keys, database credentials, or connection strings containing passwords.

### 4. Run the Job Discovery Pipeline

```bash
npm run dev
```

This runs `index.js`, which executes one discovery run end to end and prints a JSON run summary at the end.

### 5. Run the Express API

Open another terminal in the project directory:

```bash
npm run dev:api
```

The API connects to MongoDB and starts on the configured port.

Default local address:

```text
http://localhost:8000
```

### 6. Enable Scheduled Discovery (optional)

Set in `.env`:

```env
ENABLE_SCHEDULER=true
SCHEDULER_CRON=0 */6 * * *
```

Then start the API with `npm run dev:api`. The pipeline now runs in-process every 6 hours (or on your custom cron expression). Overlapping runs are prevented automatically.

## 🌐 API Endpoints

### Health Check

```http
GET /api/health
```

**Example response**

```json
{
  "success": true,
  "message": "AI Job Discovery API is running"
}
```

### Get All Jobs (with pagination and filters)

```http
GET /api/jobs
```

**Query parameters**

| Parameter | Example | Description |
|---|---|---|
| `page` | `2` | Page number (default 1) |
| `limit` | `50` | Results per page, max 100 (default 20) |
| `q` | `intern` | Free-text search over title, company and description |
| `company` | `google` | Partial match, case-insensitive |
| `jobType` | `internship` | Exact match: `internship`, `full_time`, `part_time`, `contract`, `unknown` |
| `location` | `berlin` | Partial match |
| `remoteStatus` | `remote` | Exact match: `remote`, `hybrid`, `onsite`, `unknown` |
| `verificationStatus` | `possible_individual_listing` | Exact match |
| `sourceType` | `company_careers_page` | Exact match |
| `llmConfidence` | `high` | Exact match: `low`, `medium`, `high` |
| `source` | `example.com` | Exact match on the source domain |

**Example request**

```text
http://localhost:8000/api/jobs?jobType=internship&remoteStatus=remote&page=1&limit=10
```

**Example response**

```json
{
  "success": true,
  "count": 10,
  "total": 57,
  "page": 1,
  "totalPages": 6,
  "jobs": [
    {
      "_id": "example-mongodb-id",
      "title": "Software Engineering Intern",
      "company": "Example Company",
      "location": "Remote",
      "jobType": "internship",
      "remoteStatus": "remote",
      "url": "https://example.com/careers/job",
      "applicationUrl": null,
      "summary": "Work on the platform team for 12 weeks.",
      "requiredSkills": ["Python", "Django"],
      "source": "example.com",
      "sourceType": "company_careers_page",
      "verificationStatus": "possible_individual_listing",
      "llmConfidence": "high",
      "llmCleaningStatus": "cleaned"
    }
  ]
}
```

### Job Statistics

```http
GET /api/jobs/stats
```

Returns aggregate counts: total jobs, jobs found in the last 7 days, breakdowns by `jobType`, `remoteStatus` and `verificationStatus`, the top 10 companies, and how many records include an application URL.

**Example response**

```json
{
  "success": true,
  "total": 57,
  "withApplicationUrl": 12,
  "foundLast7Days": 20,
  "byJobType": [{ "_id": "internship", "count": 31 }],
  "byRemoteStatus": [{ "_id": "remote", "count": 18 }],
  "byVerificationStatus": [{ "_id": "possible_job_listing", "count": 25 }],
  "topCompanies": [{ "_id": "JPMorgan Chase", "count": 4 }]
}
```

### Get a Single Job

```http
GET /api/jobs/:id
```

Returns one job by MongoDB id, or `404` when it does not exist (`400` for malformed ids).

### Rate Limiting

`/api` routes are limited to 120 requests per minute per IP. Exceeding the limit returns `429` with a `Retry-After` header.

## 🗄️ Database

The application uses MongoDB Atlas for cloud storage and Mongoose for database operations.

Job records include:

- Identity: `title`, `company`, `location`, `url` (unique, normalized), `applicationUrl`, `source` (domain), `sourceType`
- Classification: `jobType`, `remoteStatus`, `verificationStatus`, `verificationEvidence`, `extractionStatus`
- AI-cleaned data: `summary`, `description`, `requiredSkills`, `llmConfidence`, `llmCleaningStatus`, `llmEvidenceNotes`, `missingFields`
- Timestamps: `createdAt`, `updatedAt`

The database service upserts on the **normalized** URL, so the same listing found through different query variants or with tracking parameters updates one record instead of creating duplicates. Indexes on `company`, `jobType`, `remoteStatus`, `verificationStatus` and `createdAt` keep the API filters fast.

## 📤 CSV Export

The processed records are exported to:

```text
exports/jobs.csv
```

The export now includes all identity fields (URL, title, company, location, job type), verification fields and the AI-cleaned fields (summary, skills, confidence, evidence notes). List values such as `requiredSkills` are joined with `"; "` so the CSV stays valid.

## 🛡️ Verification and Data Quality

The project uses rule-based checks and AI-powered normalization to improve the usefulness of search results.

However, a page that mentions a job is not necessarily a confirmed, active vacancy. Results can include:

- General company career pages.
- Job-board category pages.
- Individual job listings.
- Listings with incomplete information.
- Incorrect or uncertain job classifications.

The current verification statuses are preliminary classifications, not guarantees that a job is open or legitimate. AI-generated fields may also be incomplete or incorrect.

Improving evidence-based verification and data quality is part of the planned development work.

## 🧪 Running the Tests

The test suite uses Node's built-in test runner — no extra dependency:

```bash
npm test
```

Covered areas: URL normalization, deduplication, query building, rule-based verification, CSV export format, company CSV import and Mongoose schema validation. The tests do not call Tavily or Gemini and do not need a database connection.

## 🔐 Environment and Security

- Keep `.env` out of version control (already covered by `.gitignore`).
- Never publish database passwords or API keys.
- Restrict MongoDB Atlas network access to trusted IP addresses.
- Do not treat AI-generated job information as verified without supporting evidence.
- Follow the terms of service and access restrictions of search providers and job websites.
- Use permitted sources and respect applicable rate limits.

## 🗺️ Roadmap

- [x] Build the initial Tavily search pipeline.
- [x] Deduplicate search-result URLs.
- [x] Extract webpage content.
- [x] Implement preliminary rule-based verification.
- [x] Integrate Gemini for data cleaning.
- [x] Save job records to MongoDB Atlas.
- [x] Export processed jobs to CSV.
- [x] Create an Express API.
- [x] Add a health-check endpoint.
- [x] Add an endpoint to retrieve stored jobs.
- [x] Add scheduled job discovery (in-process, `ENABLE_SCHEDULER`).
- [x] Import companies and hiring details from CSV (used for queries + verification).
- [x] Improve deduplication with URL normalization and known-job skipping.
- [x] Add automated tests for pipeline logic and services.
- [x] Persist AI-cleaned fields and expose pagination + stats via the API.
- [ ] Improve listing verification and data quality further.
- [ ] Improve reliability, scalability, and security for production (e.g. Redis-backed rate limiting, structured logging, CI).

## 🎯 Project Goal

The long-term goal is to develop an AI-assisted job discovery system that can search permitted sources, organize relevant internship and full-time opportunities, maintain a searchable database, and provide convenient exports and API access.

The project is also a practical way to learn backend engineering, AI integrations, database design, web search, and automation by building a working application.

## 👨‍💻 Author

**Your Name**

Add your GitHub profile or portfolio link here.

---

<div align="center">

**Built for learning, experimentation, and continuous improvement.**

</div>
