# 🧭 YatraAI — AI-Powered Tourist Intelligence Platform
### Smart India Hackathon (SIH 2026) | Problem Statement: TUR09 (Lead) + TUR01, TUR02, TUR04, TUR05, TUR08

> **"Turn millions of tourist experiences into your perfect journey."**
> Discover what travelers love, what they complain about, what's becoming popular, and exactly when you should visit.

---

## 🌟 Executive Overview & Problem Statement Alignment

YatraAI is a full-stack, production-grade tourism intelligence platform that solves **TUR09 (AI-Based Tourist Review Intelligence System)** and seamlessly connects it to:
- **TUR09**: Multilingual Review NLP Pipeline (Language Detection, Sentiment Analysis, 12-Aspect ABSA, Semantic Problem Clustering, Emerging Hidden Gem Detection)
- **TUR04**: Supervised ML Crowd Forecasting & Density Prediction
- **TUR01**: Explainable AI Travel Planner with Data-Backed Reasoning
- **TUR02**: Multilingual Regional Tourism Assistant (English, हिन्दी, मराठी, தமிழ், తెలుగు)
- **TUR05**: Native Artisan & Community Experience Discovery
- **TUR08**: Sustainable Tourism Scoring & Low-Crowd Route Optimization

---

## 🏗️ Architecture & Technology Stack

```
                                    YATRAAI ARCHITECTURE
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
             REACT FRONTEND              EXPRESS API             FASTAPI AI ENGINE
           (Vite, TS, Tailwind)       (Node.js, TypeScript)     (Python, Scikit-learn)
             Port: 5173                Port: 5001                Port: 8000
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              │
                                    POSTGRESQL DATABASE
                                    (13 Tables, pg_trgm)
                                         Port: 5432
```

### 1. Frontend (React 19 + TypeScript + Vite + Tailwind CSS + Leaflet)
- **Destination Dashboard**: Composite Intelligence Score (82/100), Aspect Radar Charts, Sentiment Timeline, Ranked Problem Severity, Emerging Gems Leaderboard, Hourly Crowd Heatmaps, and Interactive Map Layers.
- **Live Review Hub**: Real-time multilingual review analyzer with instant language identification, sentiment polarity, and aspect extraction.
- **Explainable Travel Planner**: Tailored day-by-day itineraries with clear **"Why YatraAI recommended this"** justification bullets.
- **Multilingual Assistant**: Natural language chat interface with quick prompts in Indian languages.

### 2. Backend (Node.js + Express + TypeScript)
- RESTful endpoints for destinations, reviews, recurring problems, service quality, crowd models, itinerary generation, and tourism authority analytics.
- Integrated resilience layer with fallback heuristics and PostgreSQL pooling.

### 3. AI Service (Python + FastAPI + Scikit-Learn + NLTK + TextBlob + LangDetect)
- **Language Detector**: Script analysis + stopword classification for Indian languages.
- **Sentiment & Polarity Engine**: Lexicon-augmented sentiment classifier scoring from `-1.0` to `+1.0` with confidence levels.
- **Aspect-Based Sentiment (ABSA)**: 12 tourism categories (*cleanliness, parking, transport, food, pricing, staff, safety, accessibility, crowd, accommodation, infrastructure, attractions, environment*).
- **Emergence Scorer**: Growth velocity + sentiment ratio + review volume ranking.
- **Crowd Predictor**: Random Forest ML model forecasting hourly visitor levels and identifying optimal off-peak visiting windows.

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js `v18+`
- Python `3.10+`
- PostgreSQL `14+` running locally on port 5432

### Step 1: Database Setup & Seed
```bash
# Setup database and seed realistic data for Goa, Mumbai, Jaipur, Kerala, Delhi, Agra
bash database/setup.sh
```

### Step 2: One-Click Launch
```bash
# Launches AI Service (8000), Backend API (5001), and Frontend (5173)
./start.sh
```

### Direct URLs:
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **Goa Intelligence Dashboard**: [http://localhost:5173/destination/goa](http://localhost:5173/destination/goa)
- **Backend API**: [http://localhost:5001/api/destinations](http://localhost:5001/api/destinations)
- **AI Service Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎬 8-Step Hackathon Judge Demo Scenario

1. **Global Search**: Search **"Goa"** on the landing page and view indexed metrics.
2. **Review Intelligence Dashboard**: Open Goa to see **12,483 reviews analyzed**, **82% positive sentiment**, and ranked problem clusters (*Parking #1 with 342 complaints*).
3. **Emerging Hidden Gems**: View **Divar Island** with **+212% mention growth**, 93% positive sentiment, and zero commercialization.
4. **Crowd Intelligence (TUR04)**: Select **Baga Beach** to see peak weekend congestion (4:00 PM – 8:00 PM) and recommended off-peak visiting hours (**7:00 AM – 10:00 AM**).
5. **Personalized Travel Planner (TUR01)**: Input **3 Days, ₹15,000 Budget, Avoid Crowds, Beaches & Culture**.
6. **Explainable Itinerary**: Observe the generated plan with data-backed reasons explaining why each stop was scheduled.
7. **Regional Language AI Assistant (TUR02)**: Switch to **मराठी (Marathi)** and ask:
   > *"मला गोव्यात कमी गर्दीची ठिकाणे सांगा."*
   > *Response dynamically highlights Divar Island, Palolem Beach, and morning Baga Beach hours.*
8. **Tourism Authority Analytics**: Navigate to `/admin` to review the **"What Changed?"** anomaly alerts (*Parking complaints ↑23%, Food sentiment ↑14%*).

---

## 🛡️ Data Transparency & Integrity
- **Zero Fake Claims**: Every AI insight is backed by sample sizes, confidence metrics, and real review snippets.
- **Explainable by Design**: Recommendations always state *why* they were generated.
