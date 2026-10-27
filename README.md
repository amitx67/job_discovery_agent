
<div align="center">

# 🤖 AI Job Discovery Agent

**An AI-powered system for discovering, extracting, verifying, and organizing internship and full-time job opportunities worldwide.**

<p>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/Node.js-Runtime-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-Backend-black?logo=express" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/AI-Gemini-blue" alt="Gemini AI">
</p>

</div>

---

## 📌 About the Project

The **AI Job Discovery Agent** is a JavaScript-based project designed to automate the process of discovering and organizing job opportunities from publicly accessible sources.

The system searches for internships and full-time positions, extracts available webpage content, checks job-related evidence, removes duplicate URLs, and uses AI to organize job information into a structured format.

The project is being developed as a learning and portfolio project, with an emphasis on backend development, AI agents, data extraction, and automation.

> **Project status:** In development. Features are considered complete only after they have been tested successfully.

## 🎯 Objectives

- Discover internship and full-time job opportunities worldwide.
- Include remote opportunities where supported by the available evidence.
- Search official company career pages, permitted job boards, and public announcements.
- Extract useful information from search results and webpages.
- Remove duplicate job URLs.
- Verify job-related evidence using rule-based checks.
- Use Gemini to normalize and structure job information.
- Export collected information into CSV files.
- Build toward persistent storage, scheduled searches, and an API.

## ✨ Features

### 🔎 Job Search
- Search for technical internships and entry-level positions.
- Use Tavily to discover relevant webpages.
- Support multiple search queries in a single run.

### ♻️ Duplicate Detection
- Track URLs with JavaScript's `Set`.
- Avoid processing the same URL more than once during a search run.

### 📄 Content Extraction
- Extract webpage content using Tavily.
- Process URLs in batches.
- Track extraction outcomes, including unavailable content and failed extraction attempts.

### 🛡️ Rule-Based Verification
- Check job titles for relevant patterns.
- Look for application-related wording.
- Identify possible individual job listings and general career pages.
- Record evidence and verification status.
- Avoid treating an unverified result as a confirmed active vacancy.

### 🧠 AI-Powered Data Cleaning
- Use Gemini to structure extracted job information.
- Normalize job titles, company names, and locations when supported by evidence.
- Identify job types and remote-work status.
- Extract supported skills and summaries.
- Track confidence and missing fields.
- Preserve uncertainty instead of inventing information.

### 📊 CSV Export
- Export collected job information to a CSV file.
- Store the generated file in the `exports/` directory.
- Include structured fields for further analysis.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript (ES Modules) | Main programming language |
| Node.js | JavaScript runtime |
| Express.js | Planned backend API |
| Tavily | Web search and content extraction |
| LangChain | LLM integration |
| Google Gemini | AI-based data cleaning |
| MongoDB | Planned persistent storage |
| CSV Writer | CSV file generation |
| dotenv | Environment variable management |
| Nodemon | Development workflow |

## 📁 Project Structure

```text
git_agent/
├── src/
│   └── services/
│       ├── tavily.service.js
│       ├── export.service.js
│       ├── verification.service.js
│       └── llm-cleaner.service.js
├── exports/
│   └── jobs.csv
├── index.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

*Note: The structure may change as new modules are added.*

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd git_agent
```

Replace `<your-repository-url>` with your actual Git repository URL.

### 2. Install Dependencies

```bash
npm install
```

Ensure the required project dependencies are installed, including the packages used for Tavily, Gemini/LangChain, and CSV export.

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
TAVILY_API_KEY=your_tavily_api_key
GOOGLE_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=your_available_gemini_model
```

Replace the placeholder values with your own API credentials and a model name supported by your Google AI Studio API key.

**Security:** Never commit your `.env` file or publish API keys in your repository.

### 4. Run the Project

Use the development command configured in your `package.json`.

For example, if your script uses Nodemon:

```bash
npm run dev
```

Or run the entry point directly if your project is configured for it:

```bash
node index.js
```

## 🔄 Data Processing Pipeline

```text
Search Queries
      |
      v
Tavily Web Search
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
Gemini Data Cleaning
      |
      v
Structured Job Records
      |
      v
CSV Export
```

The Gemini cleaning stage is optional until its integration has been tested successfully. Failed or incomplete processing should be reported rather than treated as successful verification.

## 📋 Information Collected

Depending on the source and extraction results, a job record may include:

- Original job title
- Normalized job title
- Company name
- Job URL
- Application URL, when supported by evidence
- Location
- Job type
- Remote-work status
- Extracted webpage content
- Relevant skills
- Job summary
- Source type
- Extraction status
- Verification status
- Application-related evidence
- AI confidence
- Missing fields
- Evidence notes

Not every source provides all these fields. Unknown information should remain unknown rather than being guessed.

## 🔐 Responsible Data Collection

The project is intended to collect publicly available job information responsibly.

- Respect website terms of service and applicable access restrictions.
- Use permitted search and extraction methods.
- Do not bypass authentication, paywalls, CAPTCHAs, or access controls.
- Do not treat search snippets as proof that a vacancy is currently open.
- Verify important details against the original source before applying.
- Protect API keys and other credentials.
- Avoid collecting unnecessary personal information.

## 🚧 Current Limitations

- Some websites may not allow content extraction.
- Search results can include expired jobs, duplicate listings, or general career pages.
- Rule-based verification can produce false positives and false negatives.
- AI-generated structured fields require evidence-based validation.
- A successful extraction does not prove that a job is genuine or still accepting applications.
- Current vacancy status and application links may require additional verification.
- Persistent MongoDB storage, a scheduled queue, and a complete Express API are future milestones unless implemented and tested.

## 🗺️ Roadmap

- [x] Initialize the JavaScript project and Git repository.
- [x] Implement Tavily-based job search.
- [x] Add URL deduplication within a search run.
- [x] Extract webpage content.
- [x] Implement basic rule-based verification.
- [x] Create CSV export functionality.
- [ ] Test and stabilize Gemini structured-output integration.
- [ ] Improve job relevance scoring and duplicate detection.
- [ ] Add MongoDB persistence.
- [ ] Build an Express API for job search and retrieval.
- [ ] Implement a scheduled queue checker.
- [ ] Improve evidence-based verification and vacancy-status checks.
- [ ] Add CSV upload for company and hiring information.
- [ ] Add automated tests and error handling.
- [ ] Prepare safe deployment and documentation.

*Update the checklist as each feature is implemented and tested.*

## 🧪 Development Philosophy

This project is built incrementally to understand how a real-world backend and AI-assisted data pipeline work.

The focus is on:

- Writing modular JavaScript services.
- Understanding asynchronous operations and API integration.
- Handling errors and unavailable data safely.
- Keeping extracted data traceable to its original source.
- Separating search, extraction, verification, cleaning, and export.
- Building reliable functionality before adding unnecessary complexity.

## 🤝 Contributing

This is primarily a learning and portfolio project. Suggestions, bug reports, and improvements are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the changes.
5. Submit a pull request.

## 📜 License

A license has not yet been selected. Until one is added to the repository, do not assume that the project is available for unrestricted reuse or redistribution.

---

<div align="center">

**Built with JavaScript, AI, and a continuous learning mindset.**

</div>
