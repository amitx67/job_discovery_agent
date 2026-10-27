
<div align="center">

# 🤖 AI Job Discovery Agent

### AI-Powered Internship & Full-Time Job Discovery

A JavaScript-based AI agent that searches for job opportunities, extracts webpage content, applies basic verification rules, cleans job data using Gemini, and exports results to CSV.

**Project Status:** 🚧 In Development

</div>

---

## 📌 About the Project

The **AI Job Discovery Agent** is a learning and portfolio project designed to automate parts of the job discovery process.

The project currently searches for software development opportunities using Tavily, extracts webpage content, applies rule-based verification, cleans job information with Gemini, and exports the processed results to a CSV file.

MongoDB Atlas integration is being developed to support persistent job storage.

## ✨ Features Implemented So Far

- 🔎 **Tavily Search** — Searches for software engineering internships, junior backend positions, remote opportunities, and listings from Lever and Greenhouse.
- 🔁 **Multiple Search Queries** — Runs five predefined search queries.
- ♻️ **URL Deduplication** — Uses JavaScript `Set` to prevent duplicate URLs within a search run.
- 📄 **Content Extraction** — Extracts webpage content from collected search results.
- ✅ **Basic Verification** — Applies rule-based checks to job data.
- 🧠 **Gemini Data Cleaning** — Uses Gemini to clean and normalize extracted job information.
- 📊 **CSV Export** — Exports cleaned job records to `exports/jobs.csv`.
- 🍃 **MongoDB Atlas Setup** — Configures database connectivity using Mongoose.
- 🗂️ **Job Schema** — Defines a Mongoose schema for job records.
- 💾 **Database Service** — Implements a service intended to save or update jobs using their URLs.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript (ES Modules) | Application logic |
| Node.js | Runtime environment |
| Tavily | Job search and webpage content extraction |
| Gemini | AI-based data cleaning |
| Mongoose | MongoDB object modeling |
| MongoDB Atlas | Cloud database |
| CSV | Exporting processed job data |

## 📂 Project Structure

```text
git_agent/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── job.model.js
│   └── services/
│       ├── tavily.service.js
│       ├── verification.service.js
│       ├── llm-cleaner.service.js
│       ├── export.service.js
│       └── database.service.js
├── exports/
│   └── jobs.csv
├── index.js
├── test-db.js
├── .env
├── .gitignore
└── package.json
```

## 🔄 Current Workflow

```text
Predefined Search Queries
          |
          v
     Tavily Search
          |
          v
    URL Deduplication
          |
          v
 Webpage Content Extraction
          |
          v
   Rule-Based Verification
          |
          v
      Gemini Cleaning
          |
          v
     Cleaned Job Data
          |
       +--+--+
       |     |
       v     v
    MongoDB  CSV Export
    Atlas    jobs.csv
 (Integration
  in progress)
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd git_agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
TAVILY_API_KEY=your_tavily_api_key
GOOGLE_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_atlas_connection_string
```

Use the exact environment variable names expected by your existing service files.

**Security:** Never commit your `.env` file or expose API keys, database credentials, or connection strings.

### 4. Run the Application

```bash
npm run dev
```

## 🍃 MongoDB Integration Status

The following components have been created:

- `src/config/db.js` — MongoDB connection configuration.
- `src/models/job.model.js` — Job document schema.
- `src/services/database.service.js` — Database save/update logic.
- `index.js` — Updated to connect to MongoDB and invoke the database service.

The standalone MongoDB connection test succeeded. However, the complete pipeline has not yet been verified with successful database persistence. A model-file path error was encountered during integration and is being resolved.

## ⚠️ Current Limitations

- Search queries are predefined.
- Current searches focus on software development roles.
- Verification uses basic rules rather than comprehensive job validation.
- AI-cleaned records may contain missing or incorrectly classified fields.
- MongoDB persistence still requires end-to-end testing.
- Automated scheduling, API endpoints, and CSV upload of company lists have not yet been implemented.

## 🗺️ Planned Improvements

- [ ] Complete and test MongoDB integration.
- [ ] Improve job data validation and normalization.
- [ ] Strengthen job verification using source evidence.
- [ ] Implement more reliable duplicate detection.
- [ ] Support user-provided company CSV files.
- [ ] Add scheduled job discovery.
- [ ] Build an Express API.
- [ ] Expand internship and full-time job coverage worldwide.
- [ ] Improve CSV exports and error handling.

## 🎯 Project Goal

Build a reliable AI-assisted job discovery system that can find relevant opportunities, organize job information, verify results using available evidence, and store the data for future searching and analysis.

---

<div align="center">

**Built with JavaScript, Tavily, Gemini, and MongoDB Atlas.**

</div>
