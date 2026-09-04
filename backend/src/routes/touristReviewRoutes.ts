import { Router } from 'express';
import axios from 'axios';
import { analyzeReviewWithAI } from '../services/aiService.js';

export const touristReviewRouter = Router();

// SerpAPI - Free tier: 100 searches per month
// Sign up at: https://serpapi.com/users/sign_up
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

interface SerpAPIReview {
  user?: {
    name?: string;
    thumbnail?: string;
  };
  rating?: number;
  date?: string;
  snippet?: string;
  likes?: number;
  images?: string[];
}

interface SerpAPIPlace {
  place_id?: string;
  title?: string;
  address?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  data_id?: string;
  data_cid?: string;
}

interface AnalyzedReview {
  reviewText: string;
  language: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentScore: number;
  rating: number;
  publishedDate: string | null;
  positiveAspects: string[];
  negativeAspects: string[];
  problems: Array<{ problem: string; aspect: string; severity: string }>;
}

interface AspectTheme {
  name: string;
  mentions: number;
}

interface SentimentBreakdown {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

// Search for place using SerpAPI Google Maps Search
async function searchPlace(placeName: string): Promise<SerpAPIPlace | null> {
  if (!SERPAPI_KEY) {
    throw new Error('SERPAPI_KEY is not configured');
  }

  try {
    console.log('[SerpAPI Search] Searching for:', placeName);
    
    const response = await axios.get(SERPAPI_BASE_URL, {
      params: {
        engine: 'google_maps',
        q: `${placeName} tourist attraction India`,
        type: 'search',
        api_key: SERPAPI_KEY,
      },
      timeout: 15000,
    });

    console.log('[SerpAPI Search] Response status:', response.status);
    console.log('[SerpAPI Search] Response data keys:', Object.keys(response.data || {}));

    const localResults = response.data?.local_results;
    if (!localResults || localResults.length === 0) {
      console.log('[SerpAPI Search] No local_results found');
      return null;
    }

    const place = localResults[0];
    console.log('[SerpAPI Search] Found place:', {
      title: place.title,
      data_id: place.data_id,
      place_id: place.place_id,
      data_cid: place.data_cid,
      hasDataId: !!place.data_id,
      hasPlaceId: !!place.place_id,
      hasCid: !!place.data_cid,
    });

    // Return the first result
    return place;
  } catch (error: any) {
    console.error('[SerpAPI Search Error]', error.response?.data || error.message);
    throw new Error('Unable to search for the destination. Please try again.');
  }
}

// Fetch reviews for a specific place using SerpAPI Google Maps Reviews
async function fetchPlaceReviews(placeId: string, dataId?: string, dataCid?: string): Promise<SerpAPIReview[]> {
  if (!SERPAPI_KEY) {
    throw new Error('SERPAPI_KEY is not configured');
  }

  // Try different ID parameters in order of preference
  const idsToTry = [
    { name: 'data_id', value: dataId },
    { name: 'data_cid', value: dataCid },
    { name: 'place_id', value: placeId },
  ].filter(id => id.value); // Only keep IDs that have values

  if (idsToTry.length === 0) {
    console.log('[SerpAPI Reviews] No valid IDs provided');
    return [];
  }

  // Try each ID type until one works
  for (const { name, value } of idsToTry) {
    try {
      console.log(`[SerpAPI Reviews] Attempting with ${name}:`, value);
      
      const params: any = {
        engine: 'google_maps_reviews',
        api_key: SERPAPI_KEY,
        hl: 'en',
        sort_by: 'most_relevant', // Changed from 'newestFirst' to get reviews with better content
      };
      
      // Set the appropriate ID parameter
      params[name] = value;
      
      // First page - get initial 8 reviews
      const response = await axios.get(SERPAPI_BASE_URL, {
        params,
        timeout: 20000,
      });

      console.log(`[SerpAPI Reviews] Response status with ${name}:`, response.status);

      let allReviews = response.data?.reviews || [];
      const nextPageToken = response.data?.serpapi_pagination?.next_page_token;
      
      // If we have a next page token and need more reviews with text, fetch page 2
      if (nextPageToken && allReviews.length > 0) {
        const reviewsWithText = allReviews.filter(r => r.snippet && r.snippet.trim().length >= 5);
        
        console.log(`[SerpAPI Reviews] Page 1: Found ${allReviews.length} reviews, ${reviewsWithText.length} with text`);
        
        // If less than 5 reviews have text, fetch page 2
        if (reviewsWithText.length < 5) {
          try {
            console.log(`[SerpAPI Reviews] Fetching page 2 to get more text-based reviews...`);
            const page2Params = {
              ...params,
              next_page_token: nextPageToken,
            };
            const page2Response = await axios.get(SERPAPI_BASE_URL, {
              params: page2Params,
              timeout: 20000,
            });
            const page2Reviews = page2Response.data?.reviews || [];
            console.log(`[SerpAPI Reviews] Page 2: Found ${page2Reviews.length} additional reviews`);
            allReviews = [...allReviews, ...page2Reviews];
          } catch (page2Error) {
            console.log(`[SerpAPI Reviews] Could not fetch page 2:`, page2Error);
            // Continue with page 1 reviews only
          }
        }
      }
      
      if (allReviews.length > 0) {
        // Filter reviews that have actual text (snippet exists and has meaningful content)
        const reviewsWithText = allReviews.filter(r => r.snippet && r.snippet.trim().length >= 5);
        
        console.log(`[SerpAPI Reviews] Total: ${allReviews.length} reviews, ${reviewsWithText.length} have text content`);
        
        // Return up to 10 reviews with text, or all reviews if filtering leaves us with too few
        if (reviewsWithText.length >= 3) {
          const selectedReviews = reviewsWithText.slice(0, 10);
          console.log(`[SerpAPI Reviews] Success! Returning ${selectedReviews.length} reviews with text using ${name}`);
          return selectedReviews;
        } else {
          // Not enough reviews with text, return all and let downstream handle it
          console.log(`[SerpAPI Reviews] Warning: Only ${reviewsWithText.length} reviews have text, returning all ${allReviews.length} reviews`);
          return allReviews;
        }
      } else {
        console.log(`[SerpAPI Reviews] No reviews returned with ${name}, trying next...`);
      }
    } catch (error: any) {
      console.error(`[SerpAPI Reviews] Error with ${name}:`, error.response?.data?.error || error.message);
      // Continue to next ID type
    }
  }

  // If all attempts failed, return empty array
  console.log('[SerpAPI Reviews] All ID attempts failed, returning empty array');
  return [];
}

// Analyze a single review using the existing Gemini AI pipeline
async function analyzeReview(
  reviewText: string,
  rating: number,
  language: string,
  publishedDate: string | null
): Promise<AnalyzedReview | null> {
  try {
    // Use the optimized AI service with fast fallbacks
    const analysis = await analyzeReviewWithAI(reviewText, rating);

    if (!analysis || !analysis.is_valid_tourist_review) {
      console.log('[Review Analysis] Skipped invalid review:', reviewText.substring(0, 50));
      return null; // Skip invalid reviews
    }

    const positiveAspects = analysis.aspects
      .filter((a) => a.sentiment === 'positive')
      .map((a) => a.aspect);

    const negativeAspects = analysis.aspects
      .filter((a) => a.sentiment === 'negative')
      .map((a) => a.aspect);

    return {
      reviewText,
      language: analysis.language_code,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentiment_score,
      rating,
      publishedDate,
      positiveAspects,
      negativeAspects,
      problems: analysis.detected_problems.map((p) => ({
        problem: p.problem_name,
        aspect: p.category,
        severity: p.severity,
      })),
    };
  } catch (error) {
    console.error('[Review Analysis Error] Failed to analyze review:', reviewText.substring(0, 50), error);
    return null;
  }
}

// Aggregate positive and negative themes from analyzed reviews
function aggregateThemes(analyzedReviews: AnalyzedReview[]): {
  positiveThemes: AspectTheme[];
  negativeThemes: AspectTheme[];
} {
  const positiveMap = new Map<string, number>();
  const negativeMap = new Map<string, number>();

  for (const review of analyzedReviews) {
    for (const aspect of review.positiveAspects) {
      positiveMap.set(aspect, (positiveMap.get(aspect) || 0) + 1);
    }
    for (const aspect of review.negativeAspects) {
      negativeMap.set(aspect, (negativeMap.get(aspect) || 0) + 1);
    }
  }

  const positiveThemes = Array.from(positiveMap.entries())
    .map(([name, mentions]) => ({ name, mentions }))
    .sort((a, b) => b.mentions - a.mentions);

  const negativeThemes = Array.from(negativeMap.entries())
    .map(([name, mentions]) => ({ name, mentions }))
    .sort((a, b) => b.mentions - a.mentions);

  return { positiveThemes, negativeThemes };
}

// Calculate sentiment breakdown
function calculateSentiment(analyzedReviews: AnalyzedReview[]): SentimentBreakdown & {
  overallLabel: string;
} {
  const breakdown: SentimentBreakdown = {
    positive: 0,
    negative: 0,
    neutral: 0,
    mixed: 0,
  };

  for (const review of analyzedReviews) {
    breakdown[review.sentiment] += 1;
  }

  const total = analyzedReviews.length;
  const positivePct = total > 0 ? (breakdown.positive / total) * 100 : 0;
  const negativePct = total > 0 ? (breakdown.negative / total) * 100 : 0;

  let overallLabel = 'Neutral';
  if (positivePct >= 60) {
    overallLabel = 'Mostly Positive';
  } else if (positivePct >= 40) {
    overallLabel = 'Mixed';
  } else if (negativePct >= 40) {
    overallLabel = 'Mostly Negative';
  }

  return { ...breakdown, overallLabel };
}

// Generate AI summary based ONLY on analyzed data
async function generateSummary(
  placeName: string,
  analyzedReviews: AnalyzedReview[],
  positiveThemes: AspectTheme[],
  negativeThemes: AspectTheme[],
  sentimentBreakdown: SentimentBreakdown & { overallLabel: string }
): Promise<string> {
  // If no valid Gemini key or insufficient reviews, return template-based summary
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidGeminiKey = apiKey && apiKey.startsWith('AIzaSy') && apiKey.length > 30;
  
  if (!hasValidGeminiKey || analyzedReviews.length === 0) {
    console.log('[AI Summary] No valid Gemini key or no reviews, using template');
    
    if (analyzedReviews.length === 0) {
      return 'Insufficient review data to generate insights.';
    }
    
    // Template-based summary
    const posCount = sentimentBreakdown.positive;
    const negCount = sentimentBreakdown.negative;
    const topPositive = positiveThemes[0]?.name || 'the experience';
    const topNegative = negativeThemes[0]?.name || 'minor concerns';
    
    return `Based on ${analyzedReviews.length} tourist reviews, ${placeName} receives ${sentimentBreakdown.overallLabel.toLowerCase()} feedback. Visitors particularly appreciate ${topPositive}, though some mention ${topNegative}. Overall, ${posCount} out of ${analyzedReviews.length} reviews express positive sentiment.`;
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
    });

    const prompt = `You are generating a tourism summary based ONLY on the analyzed review data provided below. Do NOT use external knowledge about ${placeName}. Do NOT invent statistics or themes that are not present in the data.

Place: ${placeName}
Reviews Analyzed: ${analyzedReviews.length}
Overall Sentiment: ${sentimentBreakdown.overallLabel}
Sentiment Breakdown: ${sentimentBreakdown.positive} positive, ${sentimentBreakdown.negative} negative, ${sentimentBreakdown.neutral} neutral, ${sentimentBreakdown.mixed} mixed

Top Positive Aspects (from actual reviews):
${positiveThemes.slice(0, 3).map((t) => `- ${t.name} (mentioned ${t.mentions} times)`).join('\n')}

Top Concerns (from actual reviews):
${negativeThemes.slice(0, 3).map((t) => `- ${t.name} (mentioned ${t.mentions} times)`).join('\n')}

Generate a complete 2-3 sentence summary that ONLY reflects the data above. Do not add external facts about ${placeName}. Make sure to finish all sentences properly.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    
    console.log('[AI Summary] Generated summary length:', summary.length);
    
    return summary;
  } catch (error) {
    console.error('[AI Summary Generation Error]', error);
    
    // Fallback to template-based summary
    const topPositive = positiveThemes[0]?.name || 'the experience';
    const topNegative = negativeThemes[0]?.name || 'minor concerns';
    
    return `Based on ${analyzedReviews.length} tourist reviews, ${placeName} receives ${sentimentBreakdown.overallLabel.toLowerCase()} feedback. Visitors particularly appreciate ${topPositive}, though some mention ${topNegative}.`;
  }
}

// POST /api/tourist-review-analysis/analyze
touristReviewRouter.post('/analyze', async (req, res) => {
  try {
    const { placeName } = req.body;

    if (!placeName || typeof placeName !== 'string' || placeName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid place name.',
      });
    }

    // Step 1: Search for the place
    const place = await searchPlace(placeName.trim());

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Unable to find a destination matching your search. Please try a different name.',
      });
    }

    // Step 2: Fetch reviews for the place
    const placeId = place.place_id;
    const dataId = place.data_id;
    const dataCid = place.data_cid;
    
    console.log('[Tourist Review Analysis] Place IDs:', {
      place_id: placeId,
      data_id: dataId,
      data_cid: dataCid,
      title: place.title,
    });
    
    if (!dataId && !placeId && !dataCid) {
      console.log('[Tourist Review Analysis] No IDs found for place:', place.title);
      return res.status(200).json({
        success: true,
        place: {
          name: place.title || 'Unknown Place',
          address: place.address || 'Address not available',
        },
        provider: 'SerpAPI (Google Maps)',
        reviewsAnalyzed: 0,
        message: 'We found the destination, but review data is currently unavailable from the connected source.',
      });
    }

    // Try to fetch reviews using available IDs
    const reviews = await fetchPlaceReviews(placeId || '', dataId, dataCid);

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        place: {
          name: place.title || 'Unknown Place',
          address: place.address || 'Address not available',
        },
        provider: 'SerpAPI (Google Maps)',
        reviewsAnalyzed: 0,
        message: 'We found the destination, but review data is currently unavailable from the connected source.',
      });
    }

    // Step 3: Analyze reviews in parallel for faster processing
    const analyzedReviews: AnalyzedReview[] = [];

    console.log(`[Tourist Review Analysis] Starting parallel analysis of ${reviews.length} reviews...`);
    const startTime = Date.now();

    // Process reviews in parallel using Promise.all
    const analysisPromises = reviews.map(async (review, index) => {
      const reviewText = review.snippet;

      // Log what we received
      console.log(`[Tourist Review Analysis] Review ${index + 1} raw data:`, {
        hasSnippet: !!reviewText,
        snippetLength: reviewText?.length || 0,
        snippet: reviewText?.substring(0, 100),
        rating: review.rating,
        date: review.date
      });

      if (!reviewText || reviewText.trim().length < 5) {
        console.log(`[Tourist Review Analysis] Skipped review ${index + 1}: insufficient text (min 5 chars required)`);
        return null; // Skip reviews with insufficient text
      }

      try {
        console.log(`[Tourist Review Analysis] Analyzing review ${index + 1}/${reviews.length}: "${reviewText.substring(0, 60)}..."`);
        const analyzed = await analyzeReview(
          reviewText,
          review.rating || 0,
          'en', // SerpAPI doesn't provide language code directly
          review.date || null
        );
        if (analyzed) {
          console.log(`[Tourist Review Analysis] ✓ Review ${index + 1} analyzed successfully - Sentiment: ${analyzed.sentiment}`);
        } else {
          console.log(`[Tourist Review Analysis] ✗ Review ${index + 1} returned null (invalid or failed)`);
        }
        return analyzed;
      } catch (err) {
        console.error(`[Tourist Review Analysis] ✗ Error analyzing review ${index + 1}:`, err);
        return null;
      }
    });

    // Wait for all reviews to be analyzed
    const results = await Promise.all(analysisPromises);
    
    // Filter out null results
    analyzedReviews.push(...results.filter((r): r is AnalyzedReview => r !== null));

    const analysisTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Tourist Review Analysis] ✅ Analyzed ${analyzedReviews.length} reviews in ${analysisTime}s`);

    if (analyzedReviews.length === 0) {
      return res.status(200).json({
        success: true,
        place: {
          name: place.title || 'Unknown Place',
          address: place.address || 'Address not available',
        },
        provider: 'SerpAPI (Google Maps)',
        reviewsAnalyzed: 0,
        message: 'Reviews were found but could not be analyzed successfully.',
      });
    }

    // Step 4: Aggregate themes
    const { positiveThemes, negativeThemes } = aggregateThemes(analyzedReviews);

    // Step 5: Calculate sentiment
    const sentimentBreakdown = calculateSentiment(analyzedReviews);

    // Step 6: Generate AI summary based ONLY on analyzed data
    const summary = await generateSummary(
      place.title || 'Unknown Place',
      analyzedReviews,
      positiveThemes,
      negativeThemes,
      sentimentBreakdown
    );

    // Step 7: Return structured response
    res.status(200).json({
      success: true,
      place: {
        name: place.title || 'Unknown Place',
        address: place.address || 'Address not available',
      },
      provider: 'SerpAPI (Google Maps)',
      reviewsAnalyzed: analyzedReviews.length,
      overallSentiment: {
        label: sentimentBreakdown.overallLabel,
        positiveCount: sentimentBreakdown.positive,
        negativeCount: sentimentBreakdown.negative,
        neutralCount: sentimentBreakdown.neutral,
        mixedCount: sentimentBreakdown.mixed,
      },
      positiveAspects: positiveThemes.slice(0, 5).map((theme) => ({
        name: theme.name.charAt(0).toUpperCase() + theme.name.slice(1),
        mentions: theme.mentions,
      })),
      negativeAspects: negativeThemes.slice(0, 5).map((theme) => ({
        name: theme.name.charAt(0).toUpperCase() + theme.name.slice(1),
        mentions: theme.mentions,
      })),
      summary,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Tourist Review Analysis Error]', error);

    if (error.message === 'SERPAPI_KEY is not configured') {
      return res.status(503).json({
        success: false,
        message: 'Review analysis is currently unavailable. Please contact the administrator.',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Unable to analyze reviews at this time. Please try again.',
    });
  }
});

export default touristReviewRouter;
