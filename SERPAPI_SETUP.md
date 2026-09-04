# SerpAPI Setup Guide - FREE API for Tourist Reviews

## 🎉 Good News: 100% Free, No Credit Card!

---

## What You Need to Do

**1. Sign up for free SerpAPI account (2 minutes)**

Visit: https://serpapi.com/users/sign_up

- Enter your email
- Choose a password
- Verify your email
- **No credit card required!**

**2. Copy your API key**

After signing up, your API key will be shown on the dashboard.

**3. Add it to your backend**

Open: `backend/.env`

Add this line:

```bash
SERPAPI_KEY=paste_your_key_here
```

**4. Restart backend**

```bash
cd backend
npm run dev
```

**5. Test it!**

Go to: http://localhost:5173/tourist-review-analysis

Search for: **"Taj Mahal"**

---

## That's It!

**Free tier includes:**
- ✅ 100 searches per month
- ✅ No credit card needed
- ✅ Real Google Maps reviews
- ✅ Perfect for testing

---

## Troubleshooting

**Error: "Service unavailable"**
- Make sure `SERPAPI_KEY` is in `backend/.env`
- Restart the backend server

**Error: "Place not found"**
- API is working! Try "Taj Mahal Agra"

**Need help?**
- Check SerpAPI dashboard: https://serpapi.com/dashboard
- View documentation: https://serpapi.com/google-maps-reviews-api

---

## Summary

**Sign up:** https://serpapi.com/users/sign_up (FREE)  
**Add key to:** `backend/.env`  
**Restart:** backend server  
**Test:** Search "Taj Mahal"  

✅ **Done!**
