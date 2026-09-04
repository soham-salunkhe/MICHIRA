import { Router } from 'express';
import axios from 'axios';
import { analyzeReviewWithAI } from '../services/aiService.js';

export const aiPlannerRouter = Router();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE_URL = 'https://serpapi.com/search';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ReviewInsights {
  reviewsAnalyzed: number;
  overallSentiment: string;
  positiveThemes: Array<{ name: string; mentions: number }>;
  negativeThemes: Array<{ name: string; mentions: number }>;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
}

interface PlannerRequest {
  placeName: string;
  duration?: '1-2_hours' | 'half_day' | 'full_day' | 'multiple_days';
  interests?: string[];
  travelStyle?: 'solo' | 'couple' | 'family' | 'friends';
  language?: string;
}

interface Activity {
  title: string;
  description: string;
  evidence: string;
  priority: 'high' | 'medium' | 'low';
}

interface PracticalTip {
  title: string;
  description: string;
  evidence: string;
  category: 'timing' | 'facilities' | 'access' | 'preparation';
}

// Search and get review insights
async function getReviewInsights(placeName: string): Promise<{ place: any; insights: ReviewInsights | null }> {
  console.log('[AI Planner] Getting review insights for:', placeName);
  
  // Search for place
  const searchResponse = await axios.get(SERPAPI_BASE_URL, {
    params: {
      engine: 'google_maps',
      q: `${placeName} tourist attraction India`,
      type: 'search',
      api_key: SERPAPI_KEY,
    },
    timeout: 15000,
  });

  const localResults = searchResponse.data?.local_results;
  if (!localResults || localResults.length === 0) {
    throw new Error('Place not found');
  }

  const place = localResults[0];
  console.log('[AI Planner] Found place:', place.title);
  console.log('[AI Planner] Place identifiers:', {
    data_id: place.data_id,
    place_id: place.place_id,
  });

  // Try to fetch reviews using the data_id (required by SerpAPI)
  let reviews: any[] = [];
  
  if (place.data_id) {
    try {
      const reviewsResponse = await axios.get(SERPAPI_BASE_URL, {
        params: {
          engine: 'google_maps_reviews',
          data_id: place.data_id,
          api_key: SERPAPI_KEY,
          hl: 'en',
        },
        timeout: 20000,
      });
      
      reviews = reviewsResponse.data?.reviews || [];
      console.log('[AI Planner] Found reviews:', reviews.length);
    } catch (reviewErr: any) {
      console.error('[AI Planner] Error fetching reviews:', reviewErr.message);
      
      // If data_id fails, try with place_id as backup
      if (place.place_id) {
        try {
          const backupResponse = await axios.get(SERPAPI_BASE_URL, {
            params: {
              engine: 'google_maps_reviews',
              place_id: place.place_id,
              api_key: SERPAPI_KEY,
              hl: 'en',
            },
            timeout: 20000,
          });
          reviews = backupResponse.data?.reviews || [];
          console.log('[AI Planner] Found reviews via place_id:', reviews.length);
        } catch (backupErr) {
          console.error('[AI Planner] Backup review fetch also failed');
        }
      }
    }
  }

  if (reviews.length === 0) {
    return { place, insights: null };
  }

  // Analyze reviews using the existing AI service infrastructure
  const analyzedReviews = [];
  console.log(`[AI Planner] Starting analysis of ${reviews.length} reviews (processing up to 10)...`);
  
  for (const review of reviews.slice(0, 10)) { // Analyze up to 10 reviews
    const reviewText = review.snippet;
    if (!reviewText || reviewText.length < 10) continue;

    try {
      console.log(`[AI Planner] Analyzing review: "${reviewText.substring(0, 50)}..." (Rating: ${review.rating || 'N/A'})`);
      const analysis = await analyzeReviewWithAI(reviewText, review.rating || 0);
      
      console.log(`[AI Planner] Analysis result: Sentiment=${analysis.sentiment}, Valid=${analysis.is_valid_tourist_review}, Aspects=${analysis.aspects.length}`);
      
      if (analysis.is_valid_tourist_review) {
        analyzedReviews.push({
          sentiment: analysis.sentiment,
          positiveAspects: analysis.aspects.filter(a => a.sentiment === 'positive').map(a => a.aspect),
          negativeAspects: analysis.aspects.filter(a => a.sentiment === 'negative').map(a => a.aspect),
          problems: analysis.detected_problems,
          themes: analysis.themes || [],
          positivePoints: analysis.positive_points || [],
        });
      }
    } catch (err: any) {
      console.error('[AI Planner] Review analysis error:', err.message);
    }
  }
  
  console.log(`[AI Planner] Successfully analyzed ${analyzedReviews.length} valid tourist reviews`);

  if (analyzedReviews.length === 0) {
    return { place, insights: null };
  }

  // Aggregate insights with detailed logging
  const positiveMap = new Map<string, number>();
  const negativeMap = new Map<string, number>();
  const allThemes = new Set<string>();
  let positiveCount = 0, negativeCount = 0, neutralCount = 0, mixedCount = 0;

  console.log('[AI Planner] Aggregating sentiment analysis results...');
  
  for (const review of analyzedReviews) {
    // Count sentiments
    if (review.sentiment === 'positive') positiveCount++;
    else if (review.sentiment === 'negative') negativeCount++;
    else if (review.sentiment === 'mixed') mixedCount++;
    else neutralCount++;

    // Aggregate positive aspects
    for (const aspect of review.positiveAspects) {
      positiveMap.set(aspect, (positiveMap.get(aspect) || 0) + 1);
    }
    
    // Aggregate negative aspects
    for (const aspect of review.negativeAspects) {
      negativeMap.set(aspect, (negativeMap.get(aspect) || 0) + 1);
    }
    
    // Collect all themes
    if (review.themes) {
      for (const theme of review.themes) {
        allThemes.add(theme);
      }
    }
  }

  console.log('[AI Planner] Sentiment breakdown:', {
    positive: positiveCount,
    negative: negativeCount,
    neutral: neutralCount,
    mixed: mixedCount
  });

  const positiveThemes = Array.from(positiveMap.entries())
    .map(([name, mentions]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), mentions }))
    .sort((a, b) => b.mentions - a.mentions);

  const negativeThemes = Array.from(negativeMap.entries())
    .map(([name, mentions]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), mentions }))
    .sort((a, b) => b.mentions - a.mentions);

  console.log('[AI Planner] Top positive themes:', positiveThemes.slice(0, 3).map(t => `${t.name} (${t.mentions})`).join(', '));
  console.log('[AI Planner] Top negative themes:', negativeThemes.slice(0, 3).map(t => `${t.name} (${t.mentions})`).join(', '));

  const insights: ReviewInsights = {
    reviewsAnalyzed: analyzedReviews.length,
    overallSentiment: positiveCount > analyzedReviews.length / 2 ? 'Mostly Positive' : 'Mixed',
    positiveThemes: positiveThemes.slice(0, 5),
    negativeThemes: negativeThemes.slice(0, 5),
    sentimentBreakdown: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
      mixed: mixedCount,
    },
  };

  return { place, insights };
}

// Generate structured recommendations before AI
function buildStructuredRecommendations(
  insights: ReviewInsights,
  request: PlannerRequest
): { activities: Activity[]; tips: PracticalTip[] } {
  const activities: Activity[] = [];
  const tips: PracticalTip[] = [];

  // Build activities from positive themes
  for (const theme of insights.positiveThemes) {
    if (theme.name.toLowerCase().includes('architecture') || theme.name.toLowerCase().includes('heritage')) {
      activities.push({
        title: 'Explore the historical architecture',
        description: 'The architectural features are frequently appreciated by visitors',
        evidence: `Mentioned positively in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        priority: theme.mentions >= 3 ? 'high' : 'medium',
      });
    } else if (theme.name.toLowerCase().includes('view') || theme.name.toLowerCase().includes('scenic')) {
      activities.push({
        title: 'Visit the scenic viewpoints',
        description: 'Scenic views are one of the most appreciated aspects',
        evidence: `Mentioned positively in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        priority: theme.mentions >= 3 ? 'high' : 'medium',
      });
    } else if (theme.name.toLowerCase().includes('food')) {
      activities.push({
        title: 'Try local food options',
        description: 'Food experiences are positively mentioned by visitors',
        evidence: `Mentioned positively in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        priority: 'medium',
      });
    } else if (theme.name.toLowerCase().includes('attractions')) {
      activities.push({
        title: 'Explore the main attractions',
        description: 'Various attractions at this destination receive positive feedback',
        evidence: `Mentioned positively in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        priority: 'high',
      });
    }
  }

  // Build tips from negative themes
  for (const theme of insights.negativeThemes) {
    if (theme.name.toLowerCase().includes('parking')) {
      tips.push({
        title: 'Plan parking in advance',
        description: 'Parking is a recurring concern in recent visitor feedback',
        evidence: `Mentioned in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        category: 'access',
      });
    } else if (theme.name.toLowerCase().includes('crowd')) {
      tips.push({
        title: 'Consider visiting during off-peak hours',
        description: 'Several reviews mention higher crowd levels during busy periods',
        evidence: `Mentioned in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        category: 'timing',
      });
    } else if (theme.name.toLowerCase().includes('cleanliness')) {
      tips.push({
        title: 'Be prepared for facilities',
        description: 'Some visitors mention cleanliness concerns',
        evidence: `Mentioned in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        category: 'facilities',
      });
    } else if (theme.name.toLowerCase().includes('accessibility')) {
      tips.push({
        title: 'Check accessibility requirements',
        description: 'Access considerations are mentioned by some visitors',
        evidence: `Mentioned in ${theme.mentions} analyzed review${theme.mentions > 1 ? 's' : ''}`,
        category: 'access',
      });
    }
  }

  // Filter and prioritize based on user preferences
  if (request.interests) {
    for (const interest of request.interests) {
      if (interest === 'photography' && insights.positiveThemes.some(t => t.name.toLowerCase().includes('scenic'))) {
        activities.push({
          title: 'Photography at scenic spots',
          description: 'Combined with scenic viewpoints, photography is well-suited here',
          evidence: 'Based on positive scenic mentions and your photography interest',
          priority: 'high',
        });
      }
    }
  }

  return {
    activities: activities.slice(0, request.duration === '1-2_hours' ? 2 : request.duration === 'half_day' ? 4 : 6),
    tips: tips.slice(0, 5),
  };
}

// Generate natural language plan using Gemini or fallback to template
async function generateNaturalPlan(
  placeName: string,
  insights: ReviewInsights,
  recommendations: { activities: Activity[]; tips: PracticalTip[] },
  request: PlannerRequest
): Promise<{ visitPlan: string; bestExperiences: string[]; planSmarter: string[]; summary: string }> {
  
  // Check if Gemini is available
  const hasValidGeminiKey = GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIzaSy') && GEMINI_API_KEY.length > 30;
  
  if (hasValidGeminiKey) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
      });

      const prompt = `You are creating a practical visit plan for ${placeName} based ONLY on real tourist review analysis.

CRITICAL: Use ONLY the provided data below. Do NOT invent attractions, timings, prices, or facts not present in this data.

Review Analysis:
- ${insights.reviewsAnalyzed} reviews analyzed
- Overall sentiment: ${insights.overallSentiment}
- Positive themes: ${insights.positiveThemes.map(t => `${t.name} (${t.mentions} mentions)`).join(', ')}
- Concerns: ${insights.negativeThemes.map(t => `${t.name} (${t.mentions} mentions)`).join(', ')}

Structured Recommendations (YOU MUST USE THESE):
Activities: ${JSON.stringify(recommendations.activities, null, 2)}
Practical Tips: ${JSON.stringify(recommendations.tips, null, 2)}

User Preferences:
${request.duration ? `- Duration: ${request.duration.replace('_', ' ')}` : ''}
${request.interests ? `- Interests: ${request.interests.join(', ')}` : ''}
${request.travelStyle ? `- Travel style: ${request.travelStyle}` : ''}

Create a response in this EXACT JSON structure:
{
  "visitPlan": "A 2-3 sentence summary of what to do, mentioning the most important activities from the structured recommendations",
  "bestExperiences": ["Experience 1 based on positive themes", "Experience 2", "Experience 3"],
  "planSmarter": ["Practical tip 1 based on concerns", "Practical tip 2", "Practical tip 3"],
  "summary": "One sentence explaining what visitors generally enjoy and what to be aware of"
}

Rules:
1. visitPlan must reference actual activities from the structured recommendations
2. bestExperiences must come from positive themes with evidence
3. planSmarter must come from negative themes/concerns with evidence
4. Do NOT invent opening hours, ticket prices, specific restaurants, or detailed logistics
5. Use phrases like "visitors mention", "reviews suggest", "tourist feedback indicates"
6. Keep everything grounded in the provided review analysis`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('[AI Planner] ✅ Gemini generated natural language plan');
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err: any) {
      console.error('[AI Planner] ⚠️ Gemini natural plan generation failed:', err.message);
    }
  } else {
    console.log('[AI Planner] ⚠️ No valid Gemini key, using template-based plan generation');
  }
  
  // Fallback: Template-based plan generation (always works)
  console.log('[AI Planner] ⚙️ Generating plan from template');
  
  const visitPlan = recommendations.activities.length > 0
    ? `Based on ${insights.reviewsAnalyzed} tourist reviews, ${placeName} is ${insights.overallSentiment.toLowerCase()}. ${recommendations.activities.slice(0, 2).map(a => a.title).join(' and ')} are highly recommended by visitors.`
    : `Based on ${insights.reviewsAnalyzed} reviews, ${placeName} offers a ${insights.overallSentiment.toLowerCase()} visitor experience.`;
  
  const bestExperiences = insights.positiveThemes.slice(0, 3).map(theme => 
    `${theme.name} (mentioned positively in ${theme.mentions} review${theme.mentions > 1 ? 's' : ''})`
  );
  
  if (bestExperiences.length === 0) {
    bestExperiences.push('Explore the destination', 'Take photos', 'Enjoy the atmosphere');
  }
  
  const planSmarter = insights.negativeThemes.slice(0, 3).map(theme =>
    `Be aware of ${theme.name.toLowerCase()} (mentioned in ${theme.mentions} review${theme.mentions > 1 ? 's' : ''})`
  );
  
  if (planSmarter.length === 0) {
    planSmarter.push('Arrive early to avoid crowds', 'Bring water and snacks', 'Check weather conditions before visiting');
  }
  
  const summary = `Visitors appreciate ${insights.positiveThemes[0]?.name.toLowerCase() || 'the experience'}, though some mention ${insights.negativeThemes[0]?.name.toLowerCase() || 'minor concerns'}.`;
  
  return {
    visitPlan,
    bestExperiences,
    planSmarter,
    summary
  };
}

// POST /api/ai-planner/generate
aiPlannerRouter.post('/generate', async (req, res) => {
  try {
    const { placeName, duration, interests, travelStyle, language }: PlannerRequest = req.body;

    if (!placeName || typeof placeName !== 'string' || placeName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid place name',
      });
    }

    console.log('[AI Planner] Generating plan for:', placeName);

    // Step 1: Get review insights
    const { place, insights } = await getReviewInsights(placeName.trim());

    if (!insights || insights.reviewsAnalyzed === 0) {
      return res.status(200).json({
        success: true,
        place: {
          name: place.title || placeName,
          address: place.address || 'Address not available',
        },
        reviewsAnalyzed: 0,
        message: 'We found the destination, but there is currently insufficient review data to create a review-informed visit plan.',
      });
    }

    // Step 2: Build structured recommendations
    const recommendations = buildStructuredRecommendations(insights, {
      placeName,
      duration,
      interests,
      travelStyle,
      language,
    });

    console.log('[AI Planner] Built recommendations:', {
      activities: recommendations.activities.length,
      tips: recommendations.tips.length,
    });

    // Step 3: Generate natural language plan
    const plan = await generateNaturalPlan(place.title || placeName, insights, recommendations, {
      placeName,
      duration,
      interests,
      travelStyle,
      language,
    });

    console.log('[AI Planner] Generated natural plan');

    // Step 4: Return structured response
    res.status(200).json({
      success: true,
      place: {
        name: place.title || placeName,
        address: place.address || 'Address not available',
      },
      reviewData: {
        reviewsAnalyzed: insights.reviewsAnalyzed,
        overallSentiment: insights.overallSentiment,
        positiveThemes: insights.positiveThemes,
        negativeThemes: insights.negativeThemes,
      },
      plan: {
        visitPlan: plan.visitPlan,
        bestExperiences: plan.bestExperiences,
        planSmarter: plan.planSmarter,
        summary: plan.summary,
        activities: recommendations.activities,
        tips: recommendations.tips,
      },
      userPreferences: {
        duration,
        interests,
        travelStyle,
      },
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[AI Planner Error]', error);

    if (error.message === 'Place not found') {
      return res.status(404).json({
        success: false,
        message: 'Unable to find a destination matching your search. Please try a different name.',
      });
    }

    if (error.message === 'SERPAPI_KEY is not configured' || error.message === 'GEMINI_API_KEY not configured') {
      return res.status(503).json({
        success: false,
        message: 'AI Planner is currently unavailable. Please contact the administrator.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Unable to generate visit plan at this time. Please try again.',
    });
  }
});

export default aiPlannerRouter;
