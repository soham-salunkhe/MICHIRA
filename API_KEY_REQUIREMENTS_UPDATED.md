# API Key Requirements - AI Tourist Review Analysis

## ✅ FREE API Solution - No Credit Card Required!

You need to add **ONE FREE API key** to make the AI Tourist Review Analysis feature work.

---

## Required API Key

### SerpAPI Key (FREE TIER)

**Purpose:** Fetch real tourist reviews for any destination from Google Maps

**Where to get it:** [SerpAPI Sign Up](https://serpapi.com/users/sign_up)

**Cost:** **100% FREE** - 100 searches per month (no credit card required!)

**Required for:** ✅ **YES - New feature requires this**

---

## Step-by-Step Instructions

### 1. Create Free SerpAPI Account

Visit: **https://serpapi.com/users/sign_up**

### 2. Sign Up (No Credit Card Required!)

1. Enter your email address
2. Choose a password
3. Click **"Sign Up"**
4. Verify your email (check your inbox)

### 3. Get Your Free API Key

1. After signing up, you'll be redirected to your dashboard
2. Your API key will be displayed at the top
3. Click **"Copy"** to copy your API key
4. It looks like: `1234567890abcdef1234567890abcdef...`

**Free tier includes:**
- ✅ 100 searches per month
- ✅ No credit card required
- ✅ No expiration
- ✅ Access to Google Maps data

### 4. Add Key to Your Backend

1. Open this file: **`backend/.env`**
2. Find the line that says:

```bash
SERPAPI_KEY=
```

3. Add your API key after the equals sign:

```bash
SERPAPI_KEY=your_actual_api_key_here
```

**Example:**
```bash
SERPAPI_KEY=1234567890abcdef1234567890abcdef1234567890abcdef
```

### 5. Restart Your Backend

```bash
cd backend
npm run dev
```

---

## Quick Reference

**What you need:** 1 FREE API key from SerpAPI (no credit card)

**Where to get it:** https://serpapi.com/users/sign_up

**Where to add it:** `backend/.env`

**What to add:**
```bash
SERPAPI_KEY=your_key_here
```

**What to do after:** Restart backend, test at http://localhost:5173/tourist-review-analysis

---

## Cost: 100% FREE

- ✅ 100 searches per month
- ✅ No credit card required
- ✅ No expiration

**That's it!** Sign up, get key, add to `.env`, restart backend. Done! 🎉
