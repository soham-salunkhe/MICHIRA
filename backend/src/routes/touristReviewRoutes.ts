import { Router } from 'express';
import axios from 'axios';
import { analyzeReviewWithGemini } from '../services/geminiReviewService.js';

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
        sort_by: 'newestFirst', // Get recent reviews
      };
      
      // Set the appropriate ID parameter
      params[name] = value;
      
      const response = await axios.get(SERPAPI_BASE_URL, {
        params,
        timeout: 20000,
      });

      console.log(`[SerpAPI Reviews] Response status with ${name}:`, response.status);

      const reviews = response.data?.reviews;
      
      if (reviews && Array.isArray(reviews) && reviews.length > 0) {
        console.log(`[SerpAPI Reviews] Success! Found ${reviews.length} reviews using ${name}`);
        return reviews;
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
    const analysis = await analyzeReviewWithGemini(reviewText, rating);

    if (!analysis.is_valid_tourist_review) {
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
      sentiment: analysis.overall_sentiment,
      sentimentScore: analysis.sentiment_score,
      rating,
      publishedDate,
      positiveAspects,
      negativeAspects,
      problems: analysis.problems.map((p) => ({
        problem: p.problem,
        aspect: p.aspect,
        severity: p.severity,
      })),
    };
  } catch (error) {
    console.error('[Review Analysis Error]', error);
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || analyzedReviews.length === 0) {
    return 'Insufficient review data to generate insights.';
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: { temperature: 0.3, maxOutputTokens: 200 },
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

Generate a concise 2-3 sentence summary that ONLY reflects the data above. Do not add external facts about ${placeName}.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('[AI Summary Generation Error]', error);
    return 'Unable to generate AI summary at this time.';
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

    // Step 3: Analyze each review
    const analyzedReviews: AnalyzedReview[] = [];

    for (const review of reviews) {
      const reviewText = review.snippet;

      if (!reviewText || reviewText.trim().length < 10) {
        continue; // Skip reviews with insufficient text
      }

      const analyzed = await analyzeReview(
        reviewText,
        review.rating || 0,
        'en', // SerpAPI doesn't provide language code directly
        review.date || null
      );

      if (analyzed) {
        analyzedReviews.push(analyzed);
      }
    }

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
