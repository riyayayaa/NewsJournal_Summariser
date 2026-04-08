# News Journal Summariser

An AI-powered full-stack web application for saving, summarizing, classifying, and chatting with personal news journal entries.

## Features

- **URL Content Extraction** — paste any news article URL and JSoup automatically scrapes and extracts the clean article text and title
- **Manual Entry** — write and save notes directly without a URL
- **AI Summarization** — generate concise 3-5 sentence summaries using Groq API (LLaMA 3)
- **Topic Classification** — automatically classify entries into Politics, Technology, Sports, Business, Health, Science, Entertainment, World, or Other
- **Sentiment Analysis** — detect Positive, Negative, or Neutral sentiment, displayed as color-coded badges
- **RAG Chat** — ask natural language questions about your saved journal entries, answered by AI using your own content as context
- **Live News Feed** — browse top headlines from NewsAPI.org across 7 categories or search any topic, with one-click save to journal
- **Dark / Light Mode** — toggle between themes, persisted across sessions
- **Persistent Storage** — entries saved to a local H2 file database, survive application restarts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.0.5, Java 25 |
| ORM | Spring Data JPA, Hibernate |
| Database | H2 (file-based) |
| Web Scraping | JSoup 1.17.2 |
| AI | Groq API — llama3-8b-8192 |
| News | NewsAPI.org |
| Frontend | React 18, Vite 5 |
| Routing | React Router 6 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Build | Gradle |

## Project Structure

```
newss/
├── src/main/java/com/newsummarize/newss/
│   ├── controller/
│   │   ├── JournalController.java    # REST API for journal CRUD
│   │   ├── ChatController.java       # RAG chat endpoint
│   │   └── NewsController.java       # Live news feed endpoint
│   ├── service/
│   │   ├── JournalService.java       # Business logic + RAG context builder
│   │   ├── OllamaService.java        # Groq API integration
│   │   ├── ScraperService.java       # JSoup URL content extraction
│   │   └── NewsApiService.java       # NewsAPI.org integration
│   ├── model/
│   │   └── JournalEntry.java         # JPA entity
│   └── repository/
│       └── JournalEntryRepository.java
├── src/main/resources/
│   └── application.properties
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Journal.jsx           # Main journal page
    │   │   └── News.jsx              # News feed page
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ChatPopup.jsx         # Floating chat bubble
    │   ├── App.jsx
    │   └── index.css
    └── vite.config.js
```


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries` | Get all journal entries |
| POST | `/api/entries/url` | Create entry from URL |
| POST | `/api/entries/text` | Create entry from text |
| POST | `/api/entries/{id}/summarize` | AI summarize entry |
| POST | `/api/entries/{id}/classify` | AI classify + sentiment |
| PUT | `/api/entries/{id}` | Update entry |
| DELETE | `/api/entries/{id}` | Delete entry |
| POST | `/api/chat/ask` | RAG chat question |
| GET | `/api/news` | Get headlines by category |
| GET | `/api/news?q=keyword` | Search news |

## Notes

- The H2 database file is stored at `data/newsdb.mv.db` in the project root and is excluded from version control
- Never commit your real API keys — keep them in `application.properties` locally or use environment variables
- NewsAPI free tier supports 100 requests/day; Groq free tier supports 14,400 requests/day
