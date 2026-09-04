# API Key Requirements - AI Tourist Review Analysis

## What You Need to Add

You need to add **ONE API key** to make the AI Tourist Review Analysis feature work.

---

## Required API Key

### Google Places API Key

**Purpose:** Fetch real tourist reviews for any destination

**Where to get it:** [Google Cloud Console](https://console.cloud.google.com/)

**Cost:** $200 free credit per month (covers ~4,000 searches)

**Required for:** ✅ **YES - New feature requires this**

---

## Step-by-Step Instructions

### 1. Go to Google Cloud Console

Visit: **https://console.cloud.google.com/**

### 2. Create or Select a Project

- If you don't have a project: Click "Create Project"
- If you have a project: Select it from the dropdown

### 3. Enable Places API (New)

1. Click **☰ (hamburger menu)** → **APIs & Services** → **Library**
2. In the search box, type: **"Places API (New)"**
3. Click on **"Places API (New)"** (make sure it says "NEW")
4. Click the **"Enable"** button

### 4. Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. A popup will show your new API key
4. **Copy this key** (you'll need it in the next step)

### 5. (Recommended) Restrict Your API Key

1. In the popup, click **"RESTRICT KEY"** (or click on the key name later)
2. Under **API restrictions**:
   - Select **"Restrict key"**
   - Check **"Places API (New)"**
3. Click **"Save"**

This prevents unauthorized use of your key.

### 6. Add Key to Your Backend

1. Open this file: **`backend/.env`**
2. Add this line at the end:

```bash
GOOGLE_PLACES_API_KEY=YOUR_ACTUAL_KEY_HERE
```

**Replace `YOUR_ACTUAL_KEY_HERE` with the key you copied in step 4.**

**Example:**
```bash
GOOGLE_PLACES_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 7. Restart Your Backend

```bash
# Stop current backend (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

---

## Verification

### Check if it's working:

1. Go to: http://localhost:5173/tourist-review-analysis
2. Search for: **"Taj Mahal"**
3. You should see:
   - Loading states
   - Results with real reviews
   - "Based on X analyzed reviews"

### If you see an error:

**"Service unavailable"**
- Check if `GOOGLE_PLACES_API_KEY` is in `backend/.env`
- Check if you restarted the backend
- Check browser console (F12) for errors

**"Place not found"**
- This means the API key is working!
- Try a more specific name like "Taj Mahal Agra"

---

## Already Configured (No Action Needed)

These API keys are **already set up** in your project:

### ✅ Gemini API Key
- **Purpose:** AI review analysis
- **Status:** Already configured
- **Variable:** `GEMINI_API_KEY` in `backend/.env`
- **No action needed**

---

## Summary: What to Add

| API Key | Purpose | Where | Status |
|---------|---------|-------|--------|
| **Google Places API Key** | Fetch real reviews | `backend/.env` | ⚠️ **YOU NEED TO ADD THIS** |
| Gemini API Key | AI analysis | `backend/.env` | ✅ Already configured |
| Apify API Token | Existing feature | `backend/.env` | ✅ Already configured |

---

## Cost Breakdown

### Google Places API:

**Free Tier:**
- $200 credit per month
- Approximately 4,000 searches per month free

**After Free Tier:**
- Text Search: $0.032 per request
- Place Details: $0.017 per request
- **Total per search: ~$0.049**

**Example:**
- 100 searches = ~$4.90
- 1,000 searches = ~$49
- First 4,000 searches = FREE (with $200 credit)

### How to Monitor:

Go to: **https://console.cloud.google.com/billing**

Set up billing alerts to avoid surprises.

---

## Configuration File

**File:** `backend/.env`

**Add this line:**

```bash
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

**Full example of relevant section:**

```bash
# Existing configuration (already set)
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT_MS=20000

# NEW - Add this line
GOOGLE_PLACES_API_KEY=your_google_places_key
```

---

## Security Note

⚠️ **IMPORTANT:**

- **NEVER** commit your `.env` file to Git
- **NEVER** share your API key publicly
- **NEVER** put the API key in frontend code
- **ALWAYS** keep it in `backend/.env` (server-side only)

The `.env` file should already be in `.gitignore`. ✅

---

## Quick Reference

**What you need:**
- 1 API key from Google Cloud Console

**Where to add it:**
- `backend/.env` file

**What to add:**
```bash
GOOGLE_PLACES_API_KEY=your_key_here
```

**What to do after:**
- Restart backend server
- Test at: http://localhost:5173/tourist-review-analysis

---

## Help & Support

### Issue: Can't create API key

**Solution:** Make sure you have billing enabled in Google Cloud Console (even if you're using free tier)

### Issue: Key doesn't work

**Solution:**
1. Check if you enabled "Places API (New)" (not old Places API)
2. Check if key is copied correctly (no spaces)
3. Check if backend restarted after adding key

### Issue: Getting billing errors

**Solution:**
1. Enable billing in Google Cloud Console
2. Add a payment method (even for free tier)
3. Free $200 credit will be applied automatically

---

## That's It!

Just add the Google Places API key to `backend/.env` and you're done! 🎉

**Time needed:** 5-10 minutes
**Cost:** Free for first 4,000 searches/month

**Ready to test?** See `QUICK_SETUP_GUIDE.md` for testing instructions.
