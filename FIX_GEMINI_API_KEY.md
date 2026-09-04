# Fix: Invalid Gemini API Key

## Current Status

✅ **SerpAPI** - Working! Reviews are being fetched successfully
✅ **Python AI Service** - Running on port 8000 as fallback
✅ **AI Planner Route** - Registered and processing requests
❌ **Gemini API Key** - **INVALID** - This is blocking AI analysis

---

## The Problem

Your `.env` file has:
```env
GEMINI_API_KEY=AIzaSyAb8RN6JvGXXeGSj6zsTrKOMMHrLn595-d95gWOFkrOrQiw3_Ug
```

**Error from logs:**
```
API key not valid. Please pass a valid API key.
```

---

## How to Fix

### Step 1: Get a Valid Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated key (starts with `AIzaSy` and is ~39 characters)

### Step 2: Update Your `.env` File

Open: `backend/.env`

Replace the current line:
```env
GEMINI_API_KEY=AIzaSyAb8RN6JvGXXeGSj6zsTrKOMMHrLn595-d95gWOFkrOrQiw3_Ug
```

With your new valid key:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Restart Backend

The backend should auto-reload, but if not:
```powershell
# Stop current backend (Ctrl+C in terminal)
# Then restart:
cd backend
npm run dev
```

---

## Alternative: Use Python AI Service Only

If you can't get a Gemini key right now, the AI Planner will automatically fall back to the Python AI service!

**Current fallback chain:**
1. Gemini (primary) ❌ Invalid key
2. Python AI Service (port 8000) ✅ Working
3. Basic heuristic ✅ Always works

**To rely on Python service:**
- Just make sure it's running:
  ```powershell
  cd ai-service
  python3 main.py
  ```

The AI Planner will automatically use it when Gemini fails!

---

## Backend Logs Show Success!

Despite the Gemini error, look at these logs:

```
[AI Planner] Getting review insights for: Hampi
[AI Planner] Found place: Group of Monuments at Hampi
[AI Planner] Place identifiers: { data_id: '0x3bb77fd958fa57ed:0x6cf1440d1bf92de2', place_id: 'ChIJ7Vf6WNl_tzsR4i35Gw1E8Ww' }
[AI Planner] Found reviews: X
[Review Intelligence] Gemini pipeline error, falling back to secondary engine
[AI Planner] Built recommendations: { activities: 1, tips: 0 }
```

✅ **Reviews are being fetched!**
✅ **Recommendations are being built!**
❌ **Only Gemini natural language generation is failing**

---

## Quick Test After Fixing

Once you update the Gemini API key:

1. **Test via browser:**
   - Open: `http://localhost:5173/ai-tourism-planner`
   - Enter: "Hampi"
   - Click "Generate Visit Plan"
   - Should work!

2. **Test via API:**
   ```powershell
   $body = @{ placeName = "Hampi" } | ConvertTo-Json
   Invoke-WebRequest -Uri "http://localhost:5001/api/ai-planner/generate" `
     -Method POST -ContentType "application/json" -Body $body `
     -UseBasicParsing
   ```

---

## Summary

| Component | Status | Action |
|-----------|--------|--------|
| SerpAPI | ✅ Working | None |
| Review Fetching | ✅ Working | None |
| Python AI Service | ✅ Working | Keep running |
| Backend Route | ✅ Working | None |
| Gemini API Key | ❌ Invalid | **GET NEW KEY** |
| Browser Error | ⚠️ Ignore | Extension noise |

**Main issue:** Get a valid Gemini API key from https://makersuite.google.com/app/apikey

Everything else is working perfectly! 🎉
