# AI Tourism Planner - Architecture & Flow

## Complete Data Flow with Sentiment Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REQUEST                                  │
│  "Plan a trip to Hampi" + preferences (duration, interests)     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: FETCH PLACE & REVIEWS (SerpAPI)                        │
│  ✓ Search Google Maps for destination                           │
│  ✓ Get place details (name, address, rating)                    │
│  ✓ Fetch real tourist reviews (up to 10)                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: SENTIMENT ANALYSIS (Python AI Service)                 │
│                                                                  │
│  FOR EACH REVIEW:                                               │
│    ┌──────────────────────────────────────────┐                │
│    │ 1. Try Gemini AI (Primary)              │                │
│    │    - Advanced NLP analysis               │                │
│    │    - Multi-language support              │                │
│    │    - Aspect extraction                   │                │
│    │    - Problem detection                   │                │
│    └──────────────┬───────────────────────────┘                │
│                   │ (if fails)                                  │
│                   ▼                                             │
│    ┌──────────────────────────────────────────┐                │
│    │ 2. Python AI Service (Fallback)         │                │
│    │    🐍 Port 8000                          │                │
│    │    - Language detection (8+ languages)   │                │
│    │    - Sentiment analysis (TextBlob)       │                │
│    │    - Aspect extraction                   │                │
│    │    - Problem clustering                  │                │
│    └──────────────┬───────────────────────────┘                │
│                   │ (if offline)                                │
│                   ▼                                             │
│    ┌──────────────────────────────────────────┐                │
│    │ 3. Basic Heuristic (Safe Fallback)      │                │
│    │    - Rating-based sentiment              │                │
│    │    - Basic validation                    │                │
│    └──────────────────────────────────────────┘                │
│                                                                  │
│  OUTPUT PER REVIEW:                                             │
│    • Sentiment: positive/negative/neutral/mixed                 │
│    • Sentiment Score: -1.0 to +1.0                              │
│    • Language: en/hi/mr/ta/te/gu/kn/bn                         │
│    • Positive Aspects: [architecture, views, food, ...]         │
│    • Negative Aspects: [parking, crowds, cleanliness, ...]      │
│    • Detected Problems: [{category, severity, evidence}, ...]   │
│    • Themes: [heritage, nature, spiritual, ...]                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: AGGREGATE SENTIMENT INSIGHTS                           │
│                                                                  │
│  • Count sentiment distribution:                                │
│    - X positive reviews                                         │
│    - Y negative reviews                                         │
│    - Z neutral/mixed reviews                                    │
│                                                                  │
│  • Extract top positive themes:                                 │
│    - Architecture (mentioned 8 times)                           │
│    - Scenic views (mentioned 6 times)                           │
│    - Historical significance (mentioned 5 times)                │
│                                                                  │
│  • Extract top concerns/problems:                               │
│    - Parking issues (mentioned 4 times)                         │
│    - Crowding (mentioned 3 times)                               │
│    - Limited facilities (mentioned 2 times)                     │
│                                                                  │
│  OUTPUT:                                                         │
│    • Overall Sentiment: "Mostly Positive" / "Mixed"            │
│    • Reviews Analyzed: 10                                       │
│    • Sentiment Breakdown: {positive: 7, negative: 2, ...}      │
│    • Top 5 Positive Themes with mention counts                  │
│    • Top 5 Negative Themes with mention counts                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: BUILD STRUCTURED RECOMMENDATIONS                       │
│                                                                  │
│  BASED ON POSITIVE THEMES → ACTIVITIES:                         │
│    ✓ "Architecture" → "Explore historical architecture"         │
│    ✓ "Scenic views" → "Visit scenic viewpoints"                │
│    ✓ "Food" → "Try local food options"                         │
│                                                                  │
│  BASED ON NEGATIVE THEMES → PRACTICAL TIPS:                     │
│    ⚠ "Parking" → "Plan parking in advance"                     │
│    ⚠ "Crowds" → "Visit during off-peak hours"                  │
│    ⚠ "Cleanliness" → "Be prepared for facilities"              │
│                                                                  │
│  OUTPUT:                                                         │
│    • Activities[] - Ranked by priority (high/medium/low)        │
│    • Tips[] - Categorized (timing/facilities/access)            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: GENERATE NATURAL LANGUAGE PLAN (Gemini/Fallback)      │
│                                                                  │
│  INPUT TO AI:                                                    │
│    • Place name & description                                   │
│    • Review insights (sentiments, themes)                       │
│    • Structured recommendations                                 │
│    • User preferences (duration, interests, travel style)       │
│                                                                  │
│  AI GENERATES:                                                   │
│    • Visit Plan: 2-3 sentence summary of what to do             │
│    • Best Experiences: 3-5 top things based on positive themes  │
│    • Plan Smarter: 3-5 practical tips based on concerns         │
│    • Summary: One sentence overview                             │
│                                                                  │
│  ⚙️ Uses same fallback chain:                                   │
│     Gemini → Python AI Service → Basic template                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  FINAL RESPONSE TO USER                                         │
│                                                                  │
│  {                                                              │
│    success: true,                                               │
│    place: { name, address },                                    │
│    reviewData: {                                                │
│      reviewsAnalyzed: 10,                                       │
│      overallSentiment: "Mostly Positive",                       │
│      positiveThemes: [...],                                     │
│      negativeThemes: [...],                                     │
│      sentimentBreakdown: {positive: 7, negative: 2, ...}        │
│    },                                                           │
│    plan: {                                                      │
│      visitPlan: "Natural language description...",              │
│      bestExperiences: ["Experience 1", "Experience 2", ...],    │
│      planSmarter: ["Tip 1", "Tip 2", ...],                     │
│      summary: "One sentence overview",                          │
│      activities: [{title, description, evidence, priority}, ...]│
│      tips: [{title, description, evidence, category}, ...]      │
│    },                                                           │
│    userPreferences: { duration, interests, travelStyle }        │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### ✅ Real Review Analysis
- Fetches actual tourist reviews from Google Maps via SerpAPI
- NO mock data or hallucinations
- Evidence-based recommendations only

### ✅ Multi-Level AI Processing
1. **Primary:** Gemini AI for advanced analysis
2. **Fallback:** Python AI Service (port 8000) for multilingual NLP
3. **Safe:** Basic heuristic always works

### ✅ Comprehensive Sentiment Analysis
- **Language Detection:** Supports 8+ Indian languages (en, hi, mr, ta, te, gu, kn, bn)
- **Sentiment Classification:** Positive, negative, neutral, mixed
- **Aspect Extraction:** Identifies specific features (architecture, food, parking, etc.)
- **Problem Detection:** Flags issues with severity levels
- **Theme Identification:** Discovers patterns across reviews

### ✅ Evidence-Based Planning
- Every recommendation linked to actual review mentions
- Activities prioritized by review frequency
- Tips grounded in real visitor concerns
- Natural language plan generated from structured data

---

## Python AI Service Capabilities

**Endpoint:** `http://127.0.0.1:8000`

### Available Analysis:
- `/analyze-review` - Single review analysis
- `/batch-analyze` - Multiple reviews at once
- `/detect-language` - Language identification
- `/crowd-predict` - ML-based crowd forecasting
- `/calculate-emergence` - Emerging attraction scoring

### NLP Pipeline:
1. **Text Cleaning** - Normalize and clean input
2. **Language Detection** - Identify review language
3. **Sentiment Analysis** - TextBlob + custom models
4. **Aspect Extraction** - Find specific features mentioned
5. **Problem Clustering** - Group similar issues
6. **Theme Discovery** - Extract common patterns

---

## Configuration

### Required Environment Variables

**Backend `.env`:**
```env
# SerpAPI for review fetching
SERPAPI_KEY=your_serpapi_key_here

# Gemini for AI analysis (optional, Python service is fallback)
GEMINI_API_KEY=AIzaSy...your_key_here
GEMINI_MODEL=gemini-1.5-flash

# Python AI service URL
AI_SERVICE_URL=http://127.0.0.1:8000
```

---

## Logging & Debugging

The system provides detailed logs at each step:

```
[AI Planner] Generating plan for: Hampi
[AI Planner] Getting review insights for: Hampi
[AI Planner] Found place: Group of Monuments at Hampi
[AI Planner] Place identifiers: { data_id: '...', place_id: '...' }
[AI Planner] Found reviews: 10
[AI Planner] Starting analysis of 10 reviews...
[AI Planner] Analyzing review: "The unique terrain..." (Rating: 5)
[Review Intelligence] ⚠️ Gemini unavailable, switching to Python AI service
[Review Intelligence] 🐍 Calling Python AI service at http://127.0.0.1:8000
[Review Intelligence] ✅ Python AI service analysis successful
[Review Intelligence] 📊 Detected language: en Sentiment: positive
[AI Planner] Analysis result: Sentiment=positive, Valid=true, Aspects=3
[AI Planner] Successfully analyzed 10 valid tourist reviews
[AI Planner] Aggregating sentiment analysis results...
[AI Planner] Sentiment breakdown: {positive: 7, negative: 2, neutral: 1, mixed: 0}
[AI Planner] Top positive themes: Architecture (8), Views (6), Historical (5)
[AI Planner] Top negative themes: Parking (4), Crowds (3)
[AI Planner] Built recommendations: { activities: 4, tips: 2 }
[AI Planner] Generated natural plan
```

---

## Testing

### 1. Check Python AI Service:
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -UseBasicParsing
```

### 2. Test AI Planner API:
```powershell
$body = @{ placeName = "Hampi" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5001/api/ai-planner/generate" `
  -Method POST -ContentType "application/json" -Body $body `
  -UseBasicParsing
```

### 3. Test via Frontend:
```
http://localhost:5173/ai-tourism-planner
```

---

## Summary

✅ **Reviews are fetched** from real Google Maps data via SerpAPI
✅ **Sentiment analysis** is performed by Python AI Service (or Gemini if available)
✅ **Insights are aggregated** to identify patterns and themes
✅ **Recommendations are generated** based on actual review evidence
✅ **Trip plan is created** using AI with fallback protection

**The entire system is sentiment-analysis-driven and evidence-based!** 🎉
