
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
- 🔗 **URL Deduplication:** Remove repeated URLs from search results before processing.
- 📄 **Content Extraction:** Extract webpage content for further processing.
- 🛡️ **Rule-Based Verification:** Classify results according to job-related evidence.
- 🧠 **AI-Powered Data Cleaning:** Use Gemini through LangChain to normalize job information.
- 🗄️ **MongoDB Atlas Integration:** Store and update job records using Mongoose.
- 📊 **CSV Export:** Export processed job records to `exports/jobs.csv`.
- 🚀 **REST API:** Retrieve stored job records through Express.js.
- ❤️ **Health Check:** Check whether the API is running.

### Planned

- ⏱️ Scheduled job discovery.
- 🏢 Import company lists and hiring details from CSV.
- 🔄 Improved duplicate detection beyond URL matching.
- 🎯 Better filtering for relevant internships and full-time jobs.
- ✅ Stronger verification of individual job listings.
- 📈 Improved data quality and error handling.
- 🧪 Automated tests and production-level reliability improvements.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript (ES Modules) | Application logic |
| Node.js | JavaScript runtime |
| Express.js | REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| Tavily | Web search and webpage content extraction |
| Gemini | AI-powered job data cleaning |
| LangChain | Integration with AI models |
| CSV | Exporting processed job records |
| Nodemon (optional) | Development workflow |

## 📁 Project Structure

```text
git_agent/
│
├── index.js
├── server.js
├── test-db.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── README.md
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── job.controller.js
│   │
│   ├── models/
│   │   └── job.model.js
│   │
│   ├── routes/
│   │   └── job.routes.js
│   │
│   └── services/
│       ├── tavily.service.js
│       ├── export.service.js
│       ├── verification.service.js
│       ├── llm-cleaner.service.js
│       └── database.service.js
│
└── exports/
    └── jobs.csv
```

*The structure above reflects the current project organization. Generated files and local configuration may differ between environments.*

## ⚙️ How It Works

The current discovery pipeline follows these steps:

```text
Start Job Discovery
        |
        v
Run Tavily Search Queries
        |
        v
Collect Search Results
        |
        v
Deduplicate URLs
        |
        v
Extract Webpage Content
        |
        v
Verify Job-Related Evidence
        |
        v
Clean and Normalize with Gemini
        |
        v
Save or Update Jobs in MongoDB
        |
        v
Export Jobs to CSV
        |
        v
Finish
```

The Express API runs separately from the discovery pipeline and reads the stored job records from MongoDB.

## 🚀 Getting Started

### Prerequisites

Install or configure the following before running the project:

- [Node.js](https://nodejs.org/)
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

If Express is not already installed:

```bash
npm install express
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

Add the environment variables expected by your current code:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
TAVILY_API_KEY=your_tavily_api_key
GOOGLE_API_KEY=your_google_api_key
```

Use the exact environment variable names referenced in your service files. If your Gemini integration uses a different key name, update the example accordingly.

**Security note:** Never commit `.env` or expose API keys, database credentials, or connection strings containing passwords.

### 4. Run the Job Discovery Pipeline

```bash
npm run dev
```

This runs `index.js` and starts the current discovery workflow.

Depending on your implementation, the workflow searches for jobs, processes the results, saves them to MongoDB, and exports the CSV file.

### 5. Run the Express API

Open another terminal in the project directory:

```bash
npm run dev:api
```

The API should connect to MongoDB and start on the configured port.

Default local address:

```text
http://localhost:8000
```

## 🌐 API Endpoints

### Health Check

**Endpoint**

```http
GET /api/health
```

**Full URL**

```text
http://localhost:8000/api/health
```

Checks whether the API server is running.

**Example response**

```json
{
  "success": true,
  "message": "AI Job Discovery API is running"
}
```

### Get All Jobs

**Endpoint**

```http
GET /api/jobs
```

**Full URL**

```text
http://localhost:8000/api/jobs
```

Returns stored job records from MongoDB, sorted by creation date.

**Example response**

```json
{
  "success": true,
  "count": 25,
  "jobs": [
    {
      "_id": "example-mongodb-id",
      "company": "Example Company",
      "title": "Software Engineering Intern",
      "url": "https://example.com/careers/job",
      "jobType": "internship",
      "location": "Remote",
      "description": "",
      "source": "Unknown",
      "verificationStatus": "possible_job_listing"
    }
  ]
}
```

*The response above is illustrative. Actual fields and values depend on the records stored in the database.*

## 🗄️ Database

The application uses MongoDB Atlas for cloud storage and Mongoose for database operations.

Job records can include fields such as:

- `company`
- `title`
- `url`
- `jobType`
- `location`
- `description`
- `source`
- `verificationStatus`
- `createdAt`
- `updatedAt`

The exact fields depend on the current schema.

The database service uses the job URL to identify records for updating or inserting. This helps avoid creating a new database record for the same URL during repeated processing, provided the URL is normalized consistently.

## 📤 CSV Export

The processed records are exported to:

```text
exports/jobs.csv
```

CSV export makes the results easy to inspect using spreadsheet applications such as Microsoft Excel or Google Sheets.

The CSV contains the fields selected by the export service. Its exact columns depend on the current implementation.

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

## 🔐 Environment and Security

- Keep `.env` out of version control.
- Never publish database passwords or API keys.
- Restrict MongoDB Atlas network access to trusted IP addresses.
- Do not treat AI-generated job information as verified without supporting evidence.
- Follow the terms of service and access restrictions of search providers and job websites.
- Use permitted sources and respect applicable rate limits.

## 🧪 Development Notes

This project is being developed incrementally to understand how a real-world AI-enabled backend works.

The current priority is completing a working MVP. Production-level improvements will follow after the core workflow and API have been tested.

Useful commands:

```bash
# Run the discovery pipeline
npm run dev

# Run the Express API
npm run dev:api

# Test the database connection, if configured
node test-db.js
```

The last command is optional and assumes `test-db.js` remains available and configured for standalone database testing.

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
- [ ] Add scheduled job discovery.
- [ ] Import companies and hiring details from CSV.
- [ ] Improve listing verification and data quality.
- [ ] Add stronger filtering and deduplication.
- [ ] Add automated tests and improve error handling.
- [ ] Complete MVP documentation and testing.
- [ ] Improve reliability, scalability, and security for production.

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
