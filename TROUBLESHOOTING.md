# Troubleshooting Guide - AI Tourist Review Analysis

## Error: "Unable to fetch reviews for this destination"

This error happens when the backend can't fetch reviews from SerpAPI. Here's how to diagnose and fix it:

---

## Step 1: Check Your API Key

### Verify API key is set:

Open: `backend/.env`

Make sure this line exists and has your actual key:

```bash
SERPAPI_KEY=your_actual_key_here
```

**Common mistakes:**
- ❌ Key is empty: `SERPAPI_KEY=`
- ❌ Spaces around equals: `SERPAPI_KEY = your_key`
- ❌ Key has quotes: `SERPAPI_KEY="your_key"` (remove quotes)
- ✅ Correct: `SERPAPI_KEY=1234567890abcdef...`

### Restart backend after changing .env:

```bash
cd backend
npm run dev
```

---

## Step 2: Check Server Logs

When you run a search, check your backend terminal for detailed logs.

You should see:

```
[SerpAPI Search] Searching for: Taj Mahal
[SerpAPI Search] Response status: 200
[SerpAPI Search] Found place: { title: 'Taj Mahal', data_id: '0x39...' }
[SerpAPI Reviews] Fetching reviews for data_id: 0x39...
[SerpAPI Reviews] Found 5 reviews
```

### If you see:

**"SERPAPI_KEY is not configured"**
- Your API key is not in `.env` or is empty
- Add the key and restart backend

**"No local_results found"**
- SerpAPI couldn't find the destination
- Try a more specific search term
- Check if your search is too generic

**"No data_id found"**
- The place doesn't have a data_id (rare)
- Try a different destination
- This is expected for some obscure places

**HTTP 401 or 403**
- Your API key is invalid
- Check if you copied the correct key from SerpAPI dashboard
- Verify at: https://serpapi.com/dashboard

**HTTP 429 - Rate limit exceeded**
- You've used all 100 free searches this month
- Upgrade plan OR wait until next month
- Check usage: https://serpapi.com/dashboard

---

## Step 3: Test SerpAPI Directly

### Test your API key with curl:

```bash
curl "https://serpapi.com/search?engine=google_maps&q=Taj+Mahal+India&type=search&api_key=YOUR_KEY"
```

Replace `YOUR_KEY` with your actual API key.

**Expected result:**
- JSON response with `local_results` array
- Each result has `title`, `address`, `data_id`

**If this fails:**
- Your API key is incorrect
- SerpAPI service is down (rare)
- Network/firewall issue

---

## Step 4: Common Issues

### Issue: "Place not found"

**Cause:** Search term doesn't match any destination

**Solutions:**
- Be more specific: "Taj Mahal Agra" instead of "Taj Mahal"
- Include location: "Gateway of India Mumbai"
- Check spelling
- Try English names only

### Issue: "No reviews available"

**Cause:** Place was found but has no reviews on Google Maps

**This is normal for:**
- Very new places
- Obscure locations
- Places without Google Maps presence

**Not an error** - system handles this gracefully

### Issue: Service responds slowly

**Cause:** SerpAPI is processing the request

**Normal behavior:**
- Search: 2-5 seconds
- Reviews: 3-8 seconds
- Total: 5-15 seconds

**If it takes longer:**
- Check your internet connection
- SerpAPI might be experiencing high load
- Try again in a few minutes

---

## Step 5: Check Network/Firewall

### Test if you can reach SerpAPI:

```bash
curl https://serpapi.com
```

**If this fails:**
- Your firewall is blocking SerpAPI
- You're behind a corporate proxy
- Network connectivity issue

**Solution:**
- Whitelist `serpapi.com` in firewall
- Configure proxy settings if needed
- Try from a different network

---

## Step 6: Verify Backend is Running

Make sure your backend is actually running:

```bash
cd backend
npm run dev
```

You should see:

```
🚀 YatraAI Backend Server running on http://localhost:5001
```

### Test backend health:

Visit: http://localhost:5001/api/health

You should see JSON response with `status: "healthy"`

---

## Step 7: Check Frontend is Calling Correct Endpoint

Open browser console (F12) → Network tab

When you search, you should see:

```
POST http://localhost:5001/api/tourist-review-analysis/analyze
```

**If you see 404:**
- Backend route not registered
- Check `backend/src/index.ts` has the route

**If you see CORS error:**
- Backend CORS is blocking frontend
- Check CORS settings in `backend/src/index.ts`

---

## Detailed Debugging

### Enable verbose logging:

The updated code already has detailed logging. Check your backend terminal for:

1. `[SerpAPI Search]` logs - Place search
2. `[SerpAPI Reviews]` logs - Review fetching
3. `[Tourist Review Analysis]` logs - Main flow

### Example successful flow:

```
[SerpAPI Search] Searching for: Taj Mahal
[SerpAPI Search] Response status: 200
[SerpAPI Search] Response data keys: [ 'search_metadata', 'search_parameters', 'local_results' ]
[SerpAPI Search] Found place: {
  title: 'Taj Mahal',
  data_id: '0x39...',
  place_id: 'ChIJ...',
  hasDataId: true
}
[Tourist Review Analysis] Place data_id: 0x39...
[SerpAPI Reviews] Fetching reviews for data_id: 0x39...
[SerpAPI Reviews] Response status: 200
[SerpAPI Reviews] Response data keys: [ 'reviews', 'search_metadata' ]
[SerpAPI Reviews] Found 5 reviews
```

### Example error flow:

```
[SerpAPI Search] Searching for: asdfghjkl
[SerpAPI Search] Response status: 200
[SerpAPI Search] No local_results found
```

---

## Quick Fixes Checklist

- [ ] SERPAPI_KEY is in `backend/.env`
- [ ] API key has no quotes, spaces, or extra characters
- [ ] Backend server restarted after adding key
- [ ] Backend is running on port 5001
- [ ] Can access http://localhost:5001/api/health
- [ ] SerpAPI key is valid (check dashboard)
- [ ] Haven't exceeded 100 searches/month
- [ ] Network can reach serpapi.com
- [ ] Browser console shows no CORS errors

---

## Still Not Working?

### 1. Verify API Key Works

Go to: https://serpapi.com/dashboard

- Check "Searches this month"
- Try the playground with your key
- Verify key status (active/expired)

### 2. Check Backend Logs

The detailed logs will show exactly where it's failing.

### 3. Try a Different Destination

Some searches might fail due to:
- No Google Maps data for that place
- Spelling issues
- Too generic search term

Try these known-working searches:
- "Taj Mahal"
- "Gateway of India Mumbai"
- "Red Fort Delhi"

### 4. Test with Minimal Example

Create a test file: `test-serpapi.js`

```javascript
const axios = require('axios');

const SERPAPI_KEY = 'your_key_here';

async function test() {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_maps',
        q: 'Taj Mahal India',
        type: 'search',
        api_key: SERPAPI_KEY,
      },
    });
    console.log('SUCCESS:', response.data.local_results?.[0]?.title);
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message);
  }
}

test();
```

Run: `node test-serpapi.js`

---

## Need More Help?

**SerpAPI Support:**
- Dashboard: https://serpapi.com/dashboard
- Documentation: https://serpapi.com/google-maps-reviews-api
- Support: support@serpapi.com

**Check Server Logs:**
- All errors are logged with details
- Look for `[SerpAPI Search Error]` or `[SerpAPI Reviews Error]`
- Error messages include response data

---

## Summary

Most issues are caused by:
1. Missing or incorrect API key
2. Forgot to restart backend after adding key
3. Exceeded free tier limit (100/month)
4. Network/firewall blocking SerpAPI

**Quick fix:** Double-check your API key in `backend/.env` and restart the backend!
