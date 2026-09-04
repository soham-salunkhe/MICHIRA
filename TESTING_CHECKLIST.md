# Testing Checklist - AI Tourist Review Analysis

## Pre-Testing Setup

- [ ] Google Places API (New) is enabled in Google Cloud Console
- [ ] `GOOGLE_PLACES_API_KEY` is added to `backend/.env`
- [ ] `GEMINI_API_KEY` is already configured in `backend/.env`
- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend is running (`npm run dev` in frontend folder)

---

## Test Cases

### Test 1: Navigation & UI

**Steps:**
1. Navigate to http://localhost:5173
2. Check that navbar has "AI Analysis" link
3. Click "AI Analysis" in navbar
4. Should navigate to `/tourist-review-analysis`

**Expected Result:**
- ✅ "AI Analysis" link visible in navbar
- ✅ Page loads with search interface
- ✅ Header: "Real-Time Tourist Insights"
- ✅ Search input placeholder shows examples
- ✅ Design matches existing TourIntel AI style (dark, minimalistic, gold accents)

---

### Test 2: Valid Popular Destination

**Steps:**
1. Go to `/tourist-review-analysis`
2. Enter: **"Taj Mahal"**
3. Click "Analyze" button

**Expected Result:**
- ✅ Loading states appear in sequence:
  - Finding destination...
  - Fetching available reviews...
  - Analyzing tourist feedback...
  - Generating insights...
- ✅ Results display:
  - Place name: "Taj Mahal"
  - Address includes Agra location
  - Overall sentiment label (e.g., "Mostly Positive")
  - Review count (typically 5 reviews)
  - "What Tourists Like" section with aspects
  - "Common Concerns" section (if any negative aspects found)
  - AI summary paragraph
  - Provider attribution: "Google Places API"

---

### Test 3: Indian Heritage Site

**Steps:**
1. Search for: **"Hampi"**

**Expected Result:**
- ✅ Place found: "Hampi" (Karnataka)
- ✅ Reviews analyzed (count displayed)
- ✅ Positive aspects related to heritage/architecture
- ✅ AI summary mentions historical significance

---

### Test 4: Fort/Monument

**Steps:**
1. Search for: **"Ajanta Caves"**

**Expected Result:**
- ✅ Place found with correct location
- ✅ Analysis shows aspects like architecture, heritage
- ✅ Summary is grounded in actual review data

---

### Test 5: Beach Destination

**Steps:**
1. Search for: **"Goa Beach"**

**Expected Result:**
- ✅ Place found (specific beach or area)
- ✅ Aspects may include food, attractions, crowding
- ✅ Summary reflects beach tourism context

---

### Test 6: Lesser-Known Destination

**Steps:**
1. Search for: **"Panhala Fort"**

**Expected Result:**
- ✅ Either:
  - Reviews found and analyzed, OR
  - Message: "No review data available"
- ✅ No fake/mock data displayed
- ✅ Honest communication about data availability

---

### Test 7: Ambiguous Search

**Steps:**
1. Search for: **"Gateway"** (without "of India")

**Expected Result:**
- ✅ System returns best match (likely Gateway of India)
- ✅ Full analysis provided

---

### Test 8: Invalid Input - Too Short

**Steps:**
1. Enter: **"T"**
2. Click Analyze

**Expected Result:**
- ✅ Error message: "Please enter a place name"
- ✅ No API call made

---

### Test 9: Invalid Input - Nonsense

**Steps:**
1. Search for: **"asdfghjkl"**

**Expected Result:**
- ✅ Error message: "Unable to find a destination matching your search"
- ✅ Suggestion to try different name

---

### Test 10: Place Without Reviews

**Steps:**
1. Search for a very obscure location (try: **"Remote Village Temple"**)

**Expected Result:**
- ✅ If place found: Message stating "no review data available"
- ✅ If place not found: "Unable to find destination" error
- ✅ NO fake data generated

---

### Test 11: API Key Missing (Error Handling)

**Steps:**
1. Temporarily remove `GOOGLE_PLACES_API_KEY` from `.env`
2. Restart backend
3. Try any search

**Expected Result:**
- ✅ Error message: "Review analysis is currently unavailable"
- ✅ No server crash
- ✅ User-friendly error (not technical details)

**After Test:** Re-add the API key and restart backend

---

### Test 12: Multiple Searches in Sequence

**Steps:**
1. Search for "Taj Mahal" → Wait for results
2. Search for "Hampi" → Wait for results
3. Search for "Ellora Caves" → Wait for results

**Expected Result:**
- ✅ Each search works independently
- ✅ Previous results replaced by new results
- ✅ No memory leaks or UI issues

---

### Test 13: Loading State Interruption

**Steps:**
1. Start a search (e.g., "Taj Mahal")
2. While loading, start a new search (e.g., "Hampi")

**Expected Result:**
- ✅ First request cancelled or ignored
- ✅ Second request completes successfully
- ✅ No conflicting results displayed

---

### Test 14: Multilingual Review Detection

**Steps:**
1. Search for a popular Indian destination
2. Check the analysis results

**Expected Result:**
- ✅ System detects and analyzes reviews in multiple languages
- ✅ Language information not prominently displayed (internal handling)
- ✅ Insights work regardless of review language

---

### Test 15: Aspect Extraction Accuracy

**Steps:**
1. Search for "Taj Mahal"
2. Review the "What Tourists Like" section

**Expected Result:**
- ✅ Aspects make sense for tourism (architecture, heritage, beauty)
- ✅ NO generic/unrelated aspects
- ✅ Each aspect has mention count
- ✅ Mention counts seem reasonable (not fabricated)

---

### Test 16: Negative Aspects Handling

**Steps:**
1. Search for a busy destination (e.g., "Gateway of India")
2. Check "Common Concerns" section

**Expected Result:**
- ✅ If negative aspects found: Display with mention counts
- ✅ If NO negative aspects: Message stating "No strong recurring concerns detected"
- ✅ NO invented concerns

---

### Test 17: AI Summary Verification

**Steps:**
1. Complete any search with results
2. Read the AI summary carefully

**Expected Result:**
- ✅ Summary mentions the destination by name
- ✅ Summary references actual aspects found in analysis
- ✅ Summary states review count basis
- ✅ NO external facts not present in review data
- ✅ Summary tone is professional and grounded

---

### Test 18: Provider Attribution

**Steps:**
1. Complete any successful search
2. Scroll to bottom of results

**Expected Result:**
- ✅ Attribution text visible: "Data source: Google Places API"
- ✅ Also mentions: "Analysis powered by MICHIRA AI"

---

### Test 19: Responsive Design (Mobile)

**Steps:**
1. Open page in mobile view (browser dev tools)
2. Test search functionality

**Expected Result:**
- ✅ Input field and button sized appropriately
- ✅ Results readable on small screens
- ✅ No horizontal scrolling
- ✅ Navbar still functional

---

### Test 20: Browser Console Check

**Steps:**
1. Open browser console (F12)
2. Perform a few searches
3. Check for errors

**Expected Result:**
- ✅ No JavaScript errors
- ✅ No failed network requests (except expected API errors)
- ✅ Clean console output

---

## Performance Tests

### Test 21: Response Time

**Steps:**
1. Search for "Taj Mahal"
2. Time from click to results

**Expected Result:**
- ✅ Results within 10-15 seconds
- ✅ Loading indicators show progress
- ✅ No timeout errors

---

### Test 22: Concurrent Users (Optional)

**Steps:**
1. Open page in 2-3 browser tabs
2. Search different destinations simultaneously

**Expected Result:**
- ✅ All requests complete successfully
- ✅ No interference between requests
- ✅ Backend handles concurrent requests

---

## Integration Tests

### Test 23: Existing Features Unaffected

**Steps:**
1. Navigate to other pages: Explore, Planner, Insights, Experiences
2. Test existing functionality

**Expected Result:**
- ✅ All existing pages work normally
- ✅ No broken routes
- ✅ No styling conflicts
- ✅ Navbar remains functional

---

### Test 24: Design Consistency

**Steps:**
1. Navigate between "AI Analysis" and "Insights" pages
2. Compare design elements

**Expected Result:**
- ✅ Same color scheme (dark background, gold accents)
- ✅ Same typography (Cormorant Garamond headings, Inter body)
- ✅ Same spacing and layout principles
- ✅ Consistent component styling

---

## Security Tests

### Test 25: API Key Not Exposed

**Steps:**
1. Open browser Network tab (F12 → Network)
2. Perform a search
3. Check all requests

**Expected Result:**
- ✅ `GOOGLE_PLACES_API_KEY` NOT visible in any request
- ✅ API calls go to backend (`/api/tourist-review-analysis`)
- ✅ Backend handles external API calls

---

### Test 26: Input Sanitization

**Steps:**
1. Try searches with special characters:
   - `<script>alert('test')</script>`
   - `'; DROP TABLE users; --`
   - `../../etc/passwd`

**Expected Result:**
- ✅ No code execution
- ✅ No SQL injection
- ✅ No path traversal
- ✅ Graceful error handling

---

## Final Verification

- [ ] All 26 tests passed
- [ ] No console errors
- [ ] No broken functionality
- [ ] Design matches existing site
- [ ] Real review data only (no mocks)
- [ ] API key secure
- [ ] Documentation complete

---

## Post-Testing Notes

**Found Issues:**
(List any issues discovered during testing)

**Action Items:**
(List any fixes or improvements needed)

**Test Date:** _________________

**Tested By:** _________________

**Status:** ✅ PASS / ❌ FAIL

---

## Quick Bug Report Template

If you find an issue:

```
**Test #:** [Number]
**Issue:** [Brief description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Console Errors:** [Any errors from browser console]
**Screenshots:** [If applicable]
```

---

## Success Criteria

The feature is ready for production when:

✅ All core functionality tests pass (Tests 1-10)  
✅ Error handling tests pass (Tests 8-11)  
✅ No console errors  
✅ Design matches existing site  
✅ API key properly secured  
✅ Documentation complete  

**Optional (nice to have):**
- Performance under 15 seconds
- Mobile responsive
- All 26 tests passed
