# AI Tourism Planner - Deployment Checklist

## ✅ What's Already Working

### 1. Review Fetching ✅
- ✓ SerpAPI integration configured
- ✓ Fetching reviews from Google Maps
- ✓ Proper data_id handling with fallback to place_id
- ✓ Up to 10 reviews fetched per destination

### 2. Python AI Service ✅
- ✓ Running on port 8000
- ✓ Health check passing
- ✓ Sentiment analysis ready (TextBlob)
- ✓ Language detection (8+ languages)
- ✓ Aspect extraction configured
- ✓ Problem detection working

### 3. Backend Integration ✅
- ✓ AI Planner route registered at `/api/ai-planner/generate`
- ✓ Fallback chain implemented: Gemini → Python AI → Heuristic
- ✓ Enhanced logging for debugging
- ✓ Sentiment aggregation working
- ✓ Structured recommendations builder active

### 4. Frontend ✅
- ✓ AITourismPlannerPage created
- ✓ Route `/ai-tourism-planner` configured
- ✓ All "Plan with AI" buttons redirect correctly
- ✓ UI form with preferences (duration, interests, travel style)

---

## ❌ What Needs Fixing

### 1. Gemini API Key ❌ **CRITICAL**

**Current Status:** Invalid API key blocking natural language generation

**Error:**
```
API key not valid. Please pass a valid API key.
```

**Solution:**
1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Update `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. Backend will auto-reload

**Impact Without Fix:**
- Reviews ARE analyzed ✓
- Sentiment IS extracted ✓
- Recommendations ARE built ✓
- BUT natural language plan generation fails ❌

---

## 🔧 Quick Start Guide

### Step 1: Fix Gemini API Key
```bash
# Edit backend/.env
# Replace GEMINI_API_KEY with valid key from
# https://makersuite.google.com/app/apikey
```

### Step 2: Start Python AI Service
```powershell
cd ai-service
python3 main.py
```

**Verify it's running:**
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -UseBasicParsing
```

Should return:
```json
{
  "status": "healthy",
  "service": "yatraai-ai-engine",
  "supported_languages": ["en","hi","mr","ta","te","gu","kn","bn"],
  "modules": ["language_detection","sentiment_analysis","aspect_extraction",...]
}
```

### Step 3: Start Backend
```powershell
cd backend
npm run dev
```

Should see:
```
🚀 YatraAI Backend Server running on http://localhost:5001
```

### Step 4: Start Frontend
```powershell
cd frontend
npm run dev
```

Should see:
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Step 5: Test AI Planner
1. Open: `http://localhost:5173/ai-tourism-planner`
2. Enter destination: "Hampi" or "Gateway of India Mumbai"
3. Select preferences
4. Click "Generate Visit Plan"
5. See sentiment-driven recommendations!

---

## 📊 System Architecture

```
User Input
    ↓
Frontend (React) → POST /api/ai-planner/generate
    ↓
Backend (Express/TypeScript)
    ↓
┌───────────────────┐
│ 1. SerpAPI        │ → Fetch place & reviews
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 2. AI Service     │ → Analyze each review
│                   │
│  Try Gemini       │ (if valid API key)
│    ↓ (fails)      │
│  Python Service   │ ✓ SENTIMENT ANALYSIS
│    ↓ (offline)    │
│  Basic Heuristic  │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 3. Aggregate      │ → Count sentiments
│    Insights       │   Extract themes
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 4. Build          │ → Activities from +themes
│    Recommendations│   Tips from -themes
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 5. Generate       │ → Natural language plan
│    Natural Plan   │   (Gemini or fallback)
└────────┬──────────┘
         ↓
Response to User with sentiment-driven plan
```

---

## 🐛 Debugging

### Check Backend Logs

Look for these patterns:

**✅ Success:**
```
[AI Planner] Found place: Group of Monuments at Hampi
[AI Planner] Found reviews: 10
[AI Planner] Starting analysis of 10 reviews...
[Review Intelligence] ✅ Python AI service analysis successful
[Review Intelligence] 📊 Detected language: en Sentiment: positive
[AI Planner] Analysis result: Sentiment=positive, Valid=true, Aspects=3
[AI Planner] Successfully analyzed 10 valid tourist reviews
[AI Planner] Sentiment breakdown: {positive: 7, negative: 2, ...}
[AI Planner] Top positive themes: Architecture (8), Views (6)
[AI Planner] Built recommendations: { activities: 4, tips: 2 }
```

**⚠️ Warnings (OK if Python service works):**
```
[Review Intelligence] ⚠️ Gemini unavailable, switching to Python AI service
[Review Intelligence] 🐍 Calling Python AI service at http://127.0.0.1:8000
```

**❌ Errors (needs fixing):**
```
[Review Intelligence] ❌ Python AI service offline
[AI Planner] Error fetching reviews
API key not valid
```

### Test Individual Components

**1. SerpAPI:**
```powershell
# Should see place data
Invoke-WebRequest -Uri "https://serpapi.com/search?engine=google_maps&q=Hampi&api_key=YOUR_KEY" -UseBasicParsing
```

**2. Python AI Service:**
```powershell
$body = @{
  text = "Amazing historical place with beautiful architecture"
  rating = 5
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/analyze-review" `
  -Method POST -ContentType "application/json" -Body $body `
  -UseBasicParsing
```

**3. AI Planner API:**
```powershell
$body = @{ placeName = "Hampi" } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5001/api/ai-planner/generate" `
  -Method POST -ContentType "application/json" -Body $body `
  -UseBasicParsing
```

---

## 📝 Environment Variables Reference

### backend/.env
```env
# Required
PORT=5001
SERPAPI_KEY=your_serpapi_key_here

# Gemini (optional - Python service is fallback)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT_MS=20000

# Python AI service
AI_SERVICE_URL=http://127.0.0.1:8000

# Database (not required for AI Planner)
DB_USER=kanra
DB_HOST=localhost
DB_NAME=yatraai
DB_PASSWORD=
DB_PORT=5432
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5001
```

---

## 🎯 Success Criteria

When everything is working, you should see:

### In Browser:
1. Navigate to `/ai-tourism-planner`
2. Enter "Hampi"
3. Get response with:
   - ✓ Place name and address
   - ✓ "X reviews analyzed" (not 0)
   - ✓ Overall sentiment ("Mostly Positive")
   - ✓ Positive themes (Architecture, Views, etc.)
   - ✓ Negative themes (Parking, Crowds, etc.)
   - ✓ Visit plan in natural language
   - ✓ Best experiences list
   - ✓ Plan smarter tips list
   - ✓ Structured activities with evidence
   - ✓ Practical tips with evidence

### In Backend Logs:
```
[AI Planner] Generating plan for: Hampi
[AI Planner] Found place: Group of Monuments at Hampi
[AI Planner] Found reviews: 10
[AI Planner] Successfully analyzed 10 valid tourist reviews
[AI Planner] Sentiment breakdown: {positive: 7, negative: 2, neutral: 1, mixed: 0}
[AI Planner] Top positive themes: Architecture (8), Views (6), Historical (5)
[AI Planner] Top negative themes: Parking (4), Crowds (3)
[AI Planner] Built recommendations: { activities: 4, tips: 2 }
[AI Planner] Generated natural plan
```

---

## 🚀 Production Readiness

Before deploying to production:

- [ ] Get valid Gemini API key
- [ ] Test with 10+ different destinations
- [ ] Verify Python AI service stays running
- [ ] Add error handling for edge cases
- [ ] Set up monitoring for API failures
- [ ] Configure rate limiting for SerpAPI (100/month free tier)
- [ ] Add caching for frequently requested destinations
- [ ] Test with non-English reviews
- [ ] Verify mobile responsiveness
- [ ] Add loading states and error messages in UI

---

## 📚 Documentation Files

- `AI_PLANNER_ARCHITECTURE.md` - Complete system architecture
- `AI_SERVICE_STATUS.md` - Python AI service setup guide
- `FIX_GEMINI_API_KEY.md` - How to get valid Gemini key
- `BROWSER_ERROR_FIX.md` - Why to ignore browser extension errors
- `AI_TOURISM_PLANNER_README.md` - Original implementation notes
- `DEPLOYMENT_CHECKLIST.md` - This file

---

## Summary

✅ **Sentiment Analysis Flow is Complete!**

Reviews → Python AI Service (or Gemini) → Sentiment Extraction → 
Theme Aggregation → Structured Recommendations → Natural Language Plan

**Only missing:** Valid Gemini API key for natural language generation
(Python service handles all sentiment analysis perfectly!)

Get your key from: https://makersuite.google.com/app/apikey 🔑
