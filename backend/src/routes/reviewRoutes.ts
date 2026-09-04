import { Router } from 'express';
import { pool } from '../config/db.js';
import { analyzeReviewWithGemini } from '../services/geminiReviewService.js';
import {
  DestinationRecord,
  extractGoogleMapsPlaceUrls,
  generateEvidenceBrief,
  getDestinationIntelligence,
  ingestApifyItems,
  startApifyRun,
  startApifyReviewsRun,
  waitForApifyDataset,
} from '../services/reviewPipeline.js';

export const reviewRouter = Router();

const REVIEW_CACHE_TTL_HOURS = Math.max(1, Number.parseInt(process.env.REVIEW_CACHE_TTL_HOURS || '24', 10) || 24);
const MIN_CACHED_REVIEWS = Math.max(1, Number.parseInt(process.env.REVIEW_CACHE_MIN_REVIEWS || '1', 10) || 1);

function asDestination(row: any): DestinationRecord {
  return { id: row.id, name: row.name, slug: row.slug, state: row.state };
}

async function resolveDestination(query: { destination_id?: unknown; destination?: unknown; state?: unknown }) {
  const id = typeof query.destination_id === 'string' ? query.destination_id.trim() : '';
  const destination = typeof query.destination === 'string' ? query.destination.trim() : '';
  const state = typeof query.state === 'string' ? query.state.trim() : '';

  if (id) {
    const result = await pool.query('SELECT id, name, slug, state FROM destinations WHERE id = $1', [id]);
    return result.rows[0] ? asDestination(result.rows[0]) : null;
  }
  if (!destination) return null;

  const result = await pool.query(
    `SELECT id, name, slug, state FROM destinations
     WHERE (slug = lower(regexp_replace($1, '[^a-zA-Z0-9]+', '-', 'g')) OR lower(name) = lower($1))
       AND ($2 = '' OR lower(state) = lower($2))
     ORDER BY CASE WHEN lower(name) = lower($1) THEN 0 ELSE 1 END
     LIMIT 1`,
    [destination, state],
  );
  return result.rows[0] ? asDestination(result.rows[0]) : null;
}

async function liveReviewCache(destinationId: string) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count, MAX(created_at) AS last_fetched
     FROM reviews
     WHERE destination_id = $1 AND source = 'apify_google_maps'`,
    [destinationId],
  );
  const count = result.rows[0]?.count || 0;
  const lastFetched = result.rows[0]?.last_fetched ? new Date(result.rows[0].last_fetched) : null;
  const fresh = Boolean(lastFetched && Date.now() - lastFetched.getTime() < REVIEW_CACHE_TTL_HOURS * 60 * 60 * 1000);
  return { count, lastFetched, fresh };
}

async function buildIntelligenceResponse(destination: DestinationRecord) {
  const intelligence = await getDestinationIntelligence(destination.id);
  if (!intelligence) return null;

  const briefEvidence = {
    destination: destination.name,
    analyzed_reviews: intelligence.summary_metrics.total_reviews_analyzed,
    sentiment: intelligence.sentiment,
    recurring_problems: intelligence.recurring_problems,
    service_quality: intelligence.service_quality,
    emerging_attractions: intelligence.emerging_attractions,
    aspects: intelligence.aspects,
  };
  const aiBrief = await generateEvidenceBrief(briefEvidence);

  return {
    ...intelligence,
    ai_brief: {
      summary: aiBrief?.summary || '',
      recommended_actions: aiBrief?.recommended_actions || [],
      overall_service_score: intelligence.overall_service_score,
      data_context: intelligence.summary_metrics.data_context_label,
    },
  };
}

async function fetchAndAnalyze(destination: DestinationRecord) {
  const cache = await liveReviewCache(destination.id);
  if (cache.fresh && cache.count >= MIN_CACHED_REVIEWS) {
    return {
      success: true,
      destination,
      cached: true,
      stale: false,
      review_count: cache.count,
      last_fetched: cache.lastFetched,
      message: `Using ${cache.count} reviews fetched within the last ${REVIEW_CACHE_TTL_HOURS} hours.`,
    };
  }

  if (!process.env.APIFY_API_TOKEN) {
    if (cache.count > 0) {
      return {
        success: true,
        destination,
        cached: true,
        stale: true,
        apify_unavailable: true,
        review_count: cache.count,
        last_fetched: cache.lastFetched,
        message: 'Showing previously fetched reviews. Live review fetching is unavailable because APIFY_API_TOKEN is not configured.',
      };
    }
    return {
      success: false,
      destination,
      code: 'APIFY_NOT_CONFIGURED',
      message: 'Unable to fetch live reviews right now. Configure APIFY_API_TOKEN and retry.',
    };
  }

  try {
    const discoveryRun = await startApifyRun(destination);
    const places = await waitForApifyDataset(discoveryRun.runId);
    const reviewRun = await startApifyReviewsRun(extractGoogleMapsPlaceUrls(places));
    const reviews = await waitForApifyDataset(reviewRun.runId);
    const ingest = await ingestApifyItems(destination, reviews);
    const after = await liveReviewCache(destination.id);
    return {
      success: true,
      destination,
      cached: false,
      stale: false,
      discovery_run_id: discoveryRun.runId,
      run_id: reviewRun.runId,
      search_target: discoveryRun.target,
      places_discovered: reviewRun.placeCount,
      review_count: after.count,
      reviews_fetched: ingest.newReviews + ingest.updatedReviews,
      new_reviews: ingest.newReviews,
      updated_reviews: ingest.updatedReviews,
      invalid_reviews: ingest.invalidReviews,
      analysis_errors: ingest.analysisErrors,
      message: `${ingest.newReviews + ingest.updatedReviews} live reviews processed for ${destination.name}.`,
    };
  } catch (error) {
    console.error('[Apify Fetch Error]', error);
    if (cache.count > 0) {
      return {
        success: true,
        destination,
        cached: true,
        stale: true,
        fetch_error: true,
        review_count: cache.count,
        last_fetched: cache.lastFetched,
        message: 'Unable to fetch live reviews right now. Showing previously fetched reviews.',
      };
    }
    return {
      success: false,
      destination,
      code: 'APIFY_FETCH_FAILED',
      message: 'Unable to fetch live reviews right now. Please retry.',
    };
  }
}

// POST /api/reviews/fetch — fetch or reuse fresh live reviews for any destination.
reviewRouter.post('/fetch', async (req, res) => {
  try {
    const destination = await resolveDestination(req.body || {});
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found.' });
    const result = await fetchAndAnalyze(destination);
    res.status(result.success ? 200 : 502).json(result);
  } catch (error: any) {
    console.error('[Review Fetch Route Error]', error);
    res.status(500).json({ success: false, message: 'Unable to fetch live reviews right now.', error: error.message });
  }
});

// GET /api/reviews/intelligence — evidence-based aggregate intelligence.
reviewRouter.get('/intelligence', async (req, res) => {
  try {
    const destination = await resolveDestination(req.query);
    if (!destination) return res.status(404).json({ success: false, message: 'A valid destination_id or destination is required.' });
    const data = await buildIntelligenceResponse(destination);
    if (!data) return res.status(404).json({ success: false, message: 'No destination intelligence found.' });
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('[Review Intelligence Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/reviews — actual indexed review records. No demo fallback is returned.
reviewRouter.get('/', async (req, res) => {
  try {
    const destination = await resolveDestination(req.query);
    const destinationId = destination?.id || (typeof req.query.destination_id === 'string' ? req.query.destination_id : null);
    if (!destinationId) return res.status(400).json({ success: false, message: 'destination_id or destination is required.' });

    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || '50'), 10) || 50));
    const offset = Math.max(0, Number.parseInt(String(req.query.offset || '0'), 10) || 0);
    const params: any[] = [destinationId];
    let filters = `r.destination_id = $1 AND r.source = 'apify_google_maps'`;
    if (req.query.sentiment && req.query.sentiment !== 'all') {
      params.push(String(req.query.sentiment));
      filters += ` AND COALESCE(ra.overall_sentiment, 'unavailable') = $${params.length}`;
    }
    if (req.query.language && req.query.language !== 'all') {
      params.push(String(req.query.language));
      filters += ` AND COALESCE(r.detected_language, ra.language_code) = $${params.length}`;
    }
    params.push(limit, offset);

    const result = await pool.query(
      `SELECT r.id, r.original_text, r.translated_text, r.rating, r.detected_language,
              r.review_date, r.created_at, r.reviewer_name, r.place_name, r.place_address,
              r.review_url, r.source, ra.overall_sentiment AS sentiment,
              COALESCE(ra.analysis_status, 'pending') AS analysis_status,
              ra.analysis_error
       FROM reviews r
       LEFT JOIN review_analysis ra ON ra.review_id = r.id
       WHERE ${filters}
       ORDER BY COALESCE(r.review_date, r.created_at::date) DESC, r.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    const stats = await pool.query(
      `SELECT COALESCE(r.detected_language, ra.language_code, 'unknown') AS language,
              COALESCE(ra.overall_sentiment, 'unavailable') AS sentiment,
              COUNT(*)::int AS count
       FROM reviews r LEFT JOIN review_analysis ra ON ra.review_id = r.id
       WHERE r.destination_id = $1 AND r.source = 'apify_google_maps'
       GROUP BY 1, 2 ORDER BY count DESC`,
      [destinationId],
    );

    res.json({ success: true, count: result.rows.length, data: result.rows, meta: { destination, distributions: stats.rows } });
  } catch (error: any) {
    console.error('[Reviews List Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/reviews/scrape-destination — backwards-compatible alias for live fetching.
reviewRouter.post('/scrape-destination', async (req, res) => {
  try {
    const destination = await resolveDestination(req.body || {});
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found.' });
    const result = await fetchAndAnalyze(destination);
    res.status(result.success ? 200 : 502).json(result);
  } catch (error: any) {
    console.error('[Review Scrape Route Error]', error);
    res.status(500).json({ success: false, message: 'Unable to fetch live reviews right now.' });
  }
});

// POST /api/reviews/ingest-apify — ingest a completed Apify actor run when polling externally.
reviewRouter.post('/ingest-apify', async (req, res) => {
  try {
    const destination = await resolveDestination(req.body || {});
    const runId = typeof req.body?.run_id === 'string' ? req.body.run_id : '';
    if (!destination || !runId) return res.status(400).json({ success: false, message: 'run_id and destination_id are required.' });
    const items = await waitForApifyDataset(runId);
    const result = await ingestApifyItems(destination, items);
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[Apify Ingest Route Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/reviews/analyze — strict single-review validation and analysis for the live review tool.
reviewRouter.post('/analyze', async (req, res) => {
  try {
    const { destination_id, text, rating, reviewer_name } = req.body || {};
    if (!text || !String(text).trim()) return res.status(400).json({ success: false, message: 'Review text is required.' });

    let analysis;
    try {
      analysis = await analyzeReviewWithGemini(String(text), rating);
    } catch (error: any) {
      return res.status(503).json({ success: false, message: 'Review analysis is temporarily unavailable.', analysis_error: error.message });
    }

    if (!analysis.is_valid_tourist_review) {
      return res.json({ success: true, is_valid: false, data: { analysis, savedRecord: null, message: analysis.validation_reason || 'Insufficient tourism context' } });
    }

    if (!destination_id) return res.json({ success: true, is_valid: true, data: { analysis, savedRecord: null, message: 'Analysis complete. Select a destination to index this review.' } });

    const insert = await pool.query(
      `INSERT INTO reviews (destination_id, original_text, detected_language, normalized_text, rating, review_date, source, reviewer_name, sentiment, sentiment_score, confidence, is_valid, validation_reason, analysis_json)
       VALUES ($1, $2, $3, $2, $4, CURRENT_DATE, 'web_user', $5, $6, $7, $8, TRUE, NULL, $9::jsonb) RETURNING *`,
      [destination_id, String(text).trim(), analysis.language_code, rating || null, reviewer_name || 'Anonymous Traveler', analysis.overall_sentiment, analysis.sentiment_score, analysis.sentiment_confidence, JSON.stringify(analysis)],
    );
    res.json({ success: true, is_valid: true, data: { analysis, savedRecord: insert.rows[0] } });
  } catch (error: any) {
    console.error('[Review Analyze Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/reviews/translate-intelligence — optional presentation translation of already-derived evidence.
reviewRouter.post('/translate-intelligence', async (req, res) => {
  try {
    const { target_language, data } = req.body || {};
    if (!target_language || String(target_language).toLowerCase() === 'english') return res.json({ success: true, data });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.json({ success: true, data });
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } });
    const prompt = `Translate only the supplied tourism evidence into ${target_language}. Preserve names and numbers. Do not add facts. Return JSON with ai_summary, recurring_problems, service_quality, and emerging_attractions.\n${JSON.stringify(data)}`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, data: JSON.parse(result.response.text()) });
  } catch (error: any) {
    console.error('[Translation Error]', error);
    res.status(502).json({ success: false, error: 'Translation unavailable.' });
  }
});
