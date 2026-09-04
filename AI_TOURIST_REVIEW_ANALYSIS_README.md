# AI Tourist Review Analysis Feature

## Overview

The **AI Tourist Review Analysis** feature allows users to search for ANY tourist destination worldwide and receive real-time, data-driven insights based on actual tourist reviews fetched from Google Places API.

This feature is completely separate from the existing Review Intelligence system and provides:
- **Real-time search** for any tourist destination
- **Live review fetching** from Google Places API (New)
- **Multilingual sentiment analysis** (English, Hindi, Marathi, and more)
- **Aspect-based analysis** (cleanliness, parking, food, service, etc.)
- **AI-generated summaries** based ONLY on analyzed review data
- **No mock data** - all insights are derived from real reviews

---

## Architecture

### Backend Flow

1. **Search Place** → Google Places API Text Search
2. **Fetch Reviews** → Google Places API Place Details (with reviews)
3. **Analyze Each Review** → Gemini AI (existing pipeline)
4. **Aggregate Themes** → Extract positive/negative aspects
5. **Calculate Sentiment** → Overall sentiment breakdown
6. **Generate Summary** → AI summary based ONLY on analyzed data

### Technology Stack

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite
- **Review Source**: Google Places API (New)
- **AI Analysis**: Google Gemini AI (existing service)
- **Styling**: TailwindCSS (matching existing design system)

---

## Setup Instructions

### 1. Get Google Places API Key

You need a **Google Places API (New)** key to use this feature.

#### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API (New)**:
   - Navigate to **APIs & Services** → **Library**
   - Search for "Places API (New)"
   - Click **Enable**
4. Create API credentials:
   - Navigate to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **API Key**
   - Copy your API key
5. **Restrict your API key** (recommended):
   - Click on your API key
   - Under **API restrictions**, select "Restrict key"
   - Select **Places API (New)**
   - Save

#### Cost Considerations:

- **Text Search**: ~$32 per 1000 requests
- **Place Details (with reviews)**: ~$17 per 1000 requests
- Google provides **$200 free credit per month**

**Estimated cost per search**: ~$0.049 (~49 searches per $1)

### 2. Configure Backend Environment

Add the following to your backend `.env` file:

```bash
# Google Places API (New) for AI Tourist Review Analysis feature
# Get your API key from: https://console.cloud.google.com/apis/credentials
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

**Location**: `backend/.env`

### 3. Verify Existing Configuration

The feature uses your existing Gemini AI configuration for review analysis:

```bash
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT_MS=20000
```

**These should already be configured in your project.**

---

## API Endpoints

### POST `/api/tourist-review-analysis/analyze`

Analyzes tourist reviews for any destination.

#### Request Body:

```json
{
  "placeName": "Taj Mahal"
}
```

#### Response (Success):

```json
{
  "success": true,
  "place": {
    "name": "Taj Mahal",
    "address": "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India"
  },
  "provider": "Google Places API",
  "reviewsAnalyzed": 5,
  "overallSentiment": {
    "label": "Mostly Positive",
    "positiveCount": 3,
    "negativeCount": 1,
    "neutralCount": 1,
    "mixedCount": 0
  },
  "positiveAspects": [
    {
      "name": "Architecture",
      "mentions": 3
    },
    {
      "name": "Heritage",
      "mentions": 2
    }
  ],
  "negativeAspects": [
    {
      "name": "Crowding",
      "mentions": 2
    },
    {
      "name": "Parking",
      "mentions": 1
    }
  ],
  "summary": "Tourists generally appreciate the Taj Mahal for its stunning architecture and historical significance. The main recurring concerns involve crowding during peak hours and parking difficulties.",
  "analyzedAt": "2026-09-04T10:30:00.000Z"
}
```

#### Response (No Reviews Available):

```json
{
  "success": true,
  "place": {
    "name": "Hidden Temple",
    "address": "Remote Location, India"
  },
  "provider": "Google Places API",
  "reviewsAnalyzed": 0,
  "message": "We found the destination, but review data is currently unavailable from the connected source."
}
```

#### Error Responses:

**400 Bad Request** - Invalid place name
```json
{
  "success": false,
  "message": "Please provide a valid place name."
}
```

**404 Not Found** - Place not found
```json
{
  "success": false,
  "message": "Unable to find a destination matching your search. Please try a different name."
}
```

**503 Service Unavailable** - API key not configured
```json
{
  "success": false,
  "message": "Review analysis is currently unavailable. Please contact the administrator."
}
```

---

## Frontend Usage

### Route

`/tourist-review-analysis`

### Navigation

The feature is accessible from the main navigation bar under **"AI Analysis"**.

### User Flow

1. User enters a tourist destination name (e.g., "Hampi", "Ajanta Caves")
2. System shows progressive loading states:
   - Finding destination...
   - Fetching available reviews...
   - Analyzing tourist feedback...
   - Generating insights...
3. Results display:
   - Place name and address
   - Overall sentiment
   - What tourists like (with mention counts)
   - Common concerns (with mention counts)
   - AI-generated summary (grounded in data)
   - Provider attribution

---

## Key Features

### ✅ Real Review Data
- Fetches actual tourist reviews from Google Places API
- NO mock data or hardcoded reviews
- NO fake sentiment analysis

### ✅ Multilingual Support
- Analyzes reviews in multiple languages (English, Hindi, Marathi, etc.)
- Language detection and confidence scoring
- Transliteration support

### ✅ Aspect-Based Analysis
- Extracts tourism-specific aspects:
  - Heritage, Attractions, Transport, Parking
  - Cleanliness, Crowding, Pricing, Accommodation
  - Food, Service, Accessibility, Safety
- Only shows aspects detected in actual reviews

### ✅ Grounded AI Summaries
- AI summary generated ONLY from analyzed review data
- No hallucination or external knowledge injection
- Transparent about data limitations

### ✅ Error Handling
- Graceful handling of API failures
- Clear user-facing error messages
- No silent fallback to fake data

### ✅ Design Integration
- Matches existing TourIntel AI design system
- Minimalistic, premium, dark theme
- Black dominant with warm gold accents
- Elegant typography and spacing

---

## Security Considerations

### ✅ API Key Protection
- Google Places API key stored server-side only
- Never exposed in frontend code
- Environment variable configuration

### ✅ Input Validation
- User input sanitized and validated
- Minimum length requirements
- Type checking on all inputs

### ✅ Rate Limiting
- Consider implementing rate limiting (not included)
- Monitor API usage through Google Cloud Console

### ✅ Error Information
- Generic error messages to users
- Detailed errors logged server-side only

---

## Testing

### Test Cases

1. **Valid tourist destination**
   - Input: "Taj Mahal"
   - Expected: Full analysis with reviews

2. **Lesser-known destination**
   - Input: "Panhala Fort"
   - Expected: Analysis if reviews exist, or "no reviews" message

3. **Ambiguous name**
   - Input: "Gateway"
   - Expected: Best match returned (Gateway of India)

4. **Invalid input**
   - Input: "asdf"
   - Expected: Place not found error

5. **No reviews available**
   - Input: Very obscure place
   - Expected: "No review data available" message

6. **API key missing**
   - Config: GOOGLE_PLACES_API_KEY not set
   - Expected: Service unavailable error

### Manual Testing

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev

# Navigate to http://localhost:5173/tourist-review-analysis
# Test with various Indian tourist destinations
```

---

## Limitations

### Review Count
- Google Places API typically returns 5 reviews per place
- Analysis is based on available reviews only
- System is transparent about limited data

### Coverage
- Not all destinations have reviews
- System clearly communicates when data is unavailable
- No fake fallback data

### Cost
- Each search consumes API quota
- Monitor usage in Google Cloud Console
- Consider implementing caching for popular destinations

### Language Support
- Best results with English, Hindi, and Marathi reviews
- Other languages supported but may have lower accuracy

---

## Future Enhancements

### Potential Improvements

1. **Caching Layer**
   - Cache popular destination results
   - Reduce API costs
   - Faster response times

2. **More Review Sources**
   - TripAdvisor API integration
   - Booking.com reviews
   - Combined multi-source analysis

3. **Historical Tracking**
   - Store analysis results over time
   - Trend detection (improving/declining)
   - Seasonal pattern analysis

4. **User Contributions**
   - Allow users to submit their own reviews
   - Community-driven insights
   - Verified traveler badges

5. **Advanced Filtering**
   - Filter by review date (recent only)
   - Filter by rating threshold
   - Filter by language

---

## Troubleshooting

### Issue: "Service unavailable" error

**Cause**: GOOGLE_PLACES_API_KEY not configured

**Solution**: 
1. Check `backend/.env` file
2. Ensure `GOOGLE_PLACES_API_KEY=your_key` is set
3. Restart backend server

### Issue: "Place not found" for known destinations

**Cause**: Search query too vague or misspelled

**Solution**:
- Try more specific names: "Taj Mahal Agra"
- Check spelling
- Include state/city name

### Issue: Reviews analyzed is 0

**Cause**: Google Places API returned no reviews

**Solution**:
- This is expected for some destinations
- System shows appropriate message
- Try a more popular destination

### Issue: API quota exceeded

**Cause**: Too many requests to Google Places API

**Solution**:
1. Check Google Cloud Console quota usage
2. Consider implementing caching
3. Upgrade to higher tier if needed

---

## API Key Configuration Summary

### Required API Keys

| Variable | Purpose | Where to Get It | Required? |
|----------|---------|----------------|-----------|
| `GOOGLE_PLACES_API_KEY` | Fetch real tourist reviews | [Google Cloud Console](https://console.cloud.google.com/) | **YES** (New feature) |
| `GEMINI_API_KEY` | AI review analysis | [Google AI Studio](https://makersuite.google.com/) | **YES** (Already configured) |

### Configuration File

**File**: `backend/.env`

```bash
# Existing configuration (already set up)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# New configuration (add this)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

---

## Contact & Support

For issues or questions:
1. Check this README first
2. Verify API key configuration
3. Check server logs for detailed errors
4. Review Google Cloud Console for API usage/errors

---

## Compliance & Attribution

### Google Places API
- Reviews fetched from Google Places API
- Attribution displayed to users: "Data source: Google Places API"
- Compliant with Google Places API terms of service

### Data Handling
- Reviews are analyzed in real-time
- No permanent storage of third-party review content
- Aggregated insights only (no raw review text stored)

### Privacy
- No user data collected during search
- No tracking of search queries
- Server-side API key protection

---

## Summary

This feature provides real-time, data-driven tourist review analysis for any destination. It integrates seamlessly with the existing TourIntel AI platform while maintaining design consistency and user experience quality.

**No mock data. No fake reviews. Only real insights from real tourists.**
