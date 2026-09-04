# Quick Setup Guide - AI Tourist Review Analysis

## What You Need to Add

You only need to add **ONE new API key**: **Google Places API Key**

---

## Step 1: Get Google Places API Key

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Enable Places API (New)
1. Go to **APIs & Services** → **Library**
2. Search for **"Places API (New)"**
3. Click **Enable**

### 1.3 Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy your new API key

### 1.4 (Optional) Restrict Your Key
1. Click on your API key name
2. Under **API restrictions**, select **Restrict key**
3. Select only **Places API (New)**
4. Click **Save**

---

## Step 2: Add API Key to Backend

Open the file: `backend/.env`

Add this line at the bottom:

```bash
GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with the actual API key you copied.

**Example:**
```bash
GOOGLE_PLACES_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 3: Restart Your Backend Server

If your backend is running, restart it:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

---

## Step 4: Test the Feature

1. Start your frontend (if not already running):
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to: http://localhost:5173/tourist-review-analysis

3. Try searching for:
   - Taj Mahal
   - Hampi
   - Ajanta Caves
   - Gateway of India
   - Any tourist destination

---

## Verification Checklist

✅ Google Places API (New) is enabled in Google Cloud Console  
✅ API key is created  
✅ API key is added to `backend/.env`  
✅ Backend server is restarted  
✅ Frontend is running  
✅ Can access `/tourist-review-analysis` page  
✅ Search returns real results  

---

## If Something Goes Wrong

### Error: "Service unavailable"
- Check if `GOOGLE_PLACES_API_KEY` is set in `backend/.env`
- Restart the backend server
- Check server console for detailed errors

### Error: "Place not found"
- Try a more specific name (e.g., "Taj Mahal Agra")
- Check spelling
- Try a different destination

### No reviews returned
- This is normal for some destinations
- The system will show: "No review data available"
- Try a more popular tourist destination

---

## Cost Information

Google provides **$200 free credit per month**.

Approximate costs:
- **Each search**: ~$0.049 (about 49 searches per $1)
- With free credit: ~4,000 free searches per month

Monitor usage at: https://console.cloud.google.com/billing

---

## That's It!

The feature is fully integrated and ready to use. No other changes needed.

**Access the feature:**
- Direct URL: http://localhost:5173/tourist-review-analysis
- Or click **"AI Analysis"** in the navigation bar

---

## Summary

**What was added:**
1. New backend route: `/api/tourist-review-analysis/analyze`
2. New frontend page: `/tourist-review-analysis`
3. New navigation link: "AI Analysis"

**What you need to do:**
1. Get Google Places API key
2. Add it to `backend/.env`
3. Restart backend server

**That's it!** 🎉
