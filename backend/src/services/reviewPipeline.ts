import { createHash } from 'node:crypto';
import { pool } from '../config/db.js';
import { analyzeReviewWithGemini, GeminiReviewAnalysis } from './geminiReviewService.js';

export const TOURISM_ASPECTS = [
  'heritage',
  'attractions',
  'transport',
  'parking',
  'cleanliness',
  'crowding',
  'pricing',
  'accommodation',
  'food',
  'service',
  'accessibility',
  'safety',
] as const;

export interface DestinationRecord {
  id: string;
  name: string;
  slug: string;
  state: string;
}

export interface NormalizedApifyReview {
  externalReviewId: string;
  placeName: string | null;
  placeAddress: string | null;
  reviewerName: string | null;
  reviewText: string;
  translatedText: string | null;
  rating: number | null;
  reviewDate: Date | null;
  language: string | null;
  reviewUrl: string | null;
  rawMetadata: Record<string, unknown>;
}

export interface IngestResult {
  totalItems: number;
  newReviews: number;
  updatedReviews: number;
  invalidReviews: number;
  analysisErrors: number;
}

const MAX_REVIEW_TEXT_LENGTH = 12000;
const APIFY_GOOGLE_MAPS_EXTRACTOR = 'compass~google-maps-extractor';
const APIFY_GOOGLE_MAPS_REVIEWS = 'compass~google-maps-reviews-scraper';

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function parseRating(value: unknown): number | null {
  const number = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  return Number.isFinite(number) && number >= 1 && number <= 5 ? number : null;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function stableReviewId(item: Record<string, any>, placeName: string | null, reviewerName: string | null, text: string, reviewDate: Date | null) {
  const suppliedId = firstString(item.reviewId, item.review_id, item.reviewIdHash, item.id);
  if (suppliedId) return suppliedId;
  const reviewUrl = firstString(item.reviewUrl, item.review_url, item.url);
  if (reviewUrl) return reviewUrl;
  return createHash('sha256')
    .update([placeName || '', reviewerName || '', text, reviewDate?.toISOString() || ''].join('|'))
    .digest('hex');
}

export function normalizeApifyReview(item: Record<string, any>, destination: DestinationRecord): NormalizedApifyReview | null {
  const reviewText = firstString(item.text, item.reviewText, item.review_text, item.textTranslated);
  if (!reviewText || reviewText.length < 10) return null;

  const placeName = firstString(
    item.placeName,
    item.place_name,
    item.place?.name,
    item.businessName,
    item.searchString,
    item.title,
    destination.name,
  );
  const reviewerName = firstString(item.reviewerName, item.reviewer_name, item.name, item.author, item.user?.name);
  const reviewDate = parseDate(item.publishedAtDate || item.publishedAt || item.reviewDate || item.date);
  const reviewUrl = firstString(item.reviewUrl, item.review_url, item.url);
  const translatedText = firstString(item.textTranslated, item.translatedText, item.translated_text);
  const language = firstString(item.originalLanguage, item.language, item.detectedLanguage);

  return {
    externalReviewId: stableReviewId(item, placeName, reviewerName, reviewText, reviewDate),
    placeName,
    placeAddress: firstString(item.placeAddress, item.place_address, item.address, item.place?.address),
    reviewerName,
    reviewText: reviewText.slice(0, MAX_REVIEW_TEXT_LENGTH),
    translatedText: translatedText && translatedText !== reviewText ? translatedText.slice(0, MAX_REVIEW_TEXT_LENGTH) : null,
    rating: parseRating(item.stars ?? item.rating),
    reviewDate,
    language,
    reviewUrl,
    rawMetadata: {
      source_url: reviewUrl,
      place_name: placeName,
      place_address: firstString(item.placeAddress, item.place_address, item.address, item.place?.address),
      original_language: language,
      scraped_at: new Date().toISOString(),
    },
  };
}

/**
 * The Google Maps search actor returns one item per place, with its reviews in
 * a nested `reviews` array. Convert it to the flat shape used by the ingestion
 * pipeline, retaining the associated place metadata for every review.
 */
export function flattenApifyPlaceReviews(items: Record<string, any>[]): Record<string, any>[] {
  return items.flatMap((place) => {
    if (!Array.isArray(place.reviews)) return [place];

    return place.reviews.map((review: Record<string, any>) => ({
      ...review,
      placeName: firstString(place.title, place.name, place.placeName),
      placeAddress: firstString(place.address, place.fullAddress, place.placeAddress),
      placeUrl: firstString(place.url, place.googleMapsUrl),
      searchString: firstString(place.searchString),
    }));
  });
}

function asJson(value: unknown): string {
  return JSON.stringify(value ?? []);
}

async function saveRawReview(destination: DestinationRecord, review: NormalizedApifyReview) {
  const result = await pool.query(
    `INSERT INTO reviews (
      destination_id, original_text, translated_text, detected_language, rating,
      review_date, source, reviewer_name, place_name, place_address,
      external_review_id, review_url, analysis_json
    ) VALUES ($1, $2, $3, $4, $5, $6, 'apify_google_maps', $7, $8, $9, $10, $11, $12::jsonb)
    ON CONFLICT (destination_id, external_review_id) WHERE external_review_id IS NOT NULL DO UPDATE SET
      original_text = EXCLUDED.original_text,
      translated_text = COALESCE(EXCLUDED.translated_text, reviews.translated_text),
      detected_language = COALESCE(EXCLUDED.detected_language, reviews.detected_language),
      rating = COALESCE(EXCLUDED.rating, reviews.rating),
      review_date = COALESCE(EXCLUDED.review_date, reviews.review_date),
      reviewer_name = COALESCE(EXCLUDED.reviewer_name, reviews.reviewer_name),
      place_name = COALESCE(EXCLUDED.place_name, reviews.place_name),
      place_address = COALESCE(EXCLUDED.place_address, reviews.place_address),
      review_url = COALESCE(EXCLUDED.review_url, reviews.review_url),
      analysis_json = COALESCE(reviews.analysis_json, EXCLUDED.analysis_json)
    RETURNING id, (xmax = 0) AS inserted`,
    [
      destination.id,
      review.reviewText,
      review.translatedText,
      review.language,
      review.rating,
      review.reviewDate,
      review.reviewerName,
      review.placeName,
      review.placeAddress,
      review.externalReviewId,
      review.reviewUrl,
      asJson(review.rawMetadata),
    ],
  );
  return result.rows[0] as { id: string; inserted: boolean };
}

function clampScore(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : 0;
}

async function persistAnalysis(reviewId: string, reviewText: string, rating: number | null, analysis: GeminiReviewAnalysis) {
  const valid = Boolean(analysis.is_valid_tourist_review);
  await pool.query(
    `UPDATE reviews SET
      detected_language = $2,
      normalized_text = $3,
      sentiment = $4,
      sentiment_score = $5,
      confidence = $6,
      is_valid = $7,
      validation_reason = $8,
      analysis_json = $9::jsonb
    WHERE id = $1`,
    [
      reviewId,
      analysis.language_code || null,
      reviewText.trim(),
      valid ? analysis.overall_sentiment : 'neutral',
      valid ? clampScore(analysis.sentiment_score, -1, 1) : 0,
      valid ? clampScore(analysis.sentiment_confidence, 0, 1) : 0,
      valid,
      analysis.validation_reason,
      JSON.stringify(analysis),
    ],
  );

  await pool.query(
    `INSERT INTO review_analysis (
      review_id, is_valid_tourist_review, language, language_code, language_confidence,
      overall_sentiment, sentiment_score, sentiment_confidence, aspects, problems,
      positive_points, themes, service_quality, emerging_attraction_signals,
      actionable_insight, analysis_status, analysis_error, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb, $15, 'ready', NULL, NOW())
    ON CONFLICT (review_id) DO UPDATE SET
      is_valid_tourist_review = EXCLUDED.is_valid_tourist_review,
      language = EXCLUDED.language,
      language_code = EXCLUDED.language_code,
      language_confidence = EXCLUDED.language_confidence,
      overall_sentiment = EXCLUDED.overall_sentiment,
      sentiment_score = EXCLUDED.sentiment_score,
      sentiment_confidence = EXCLUDED.sentiment_confidence,
      aspects = EXCLUDED.aspects,
      problems = EXCLUDED.problems,
      positive_points = EXCLUDED.positive_points,
      themes = EXCLUDED.themes,
      service_quality = EXCLUDED.service_quality,
      emerging_attraction_signals = EXCLUDED.emerging_attraction_signals,
      actionable_insight = EXCLUDED.actionable_insight,
      analysis_status = 'ready',
      analysis_error = NULL,
      updated_at = NOW()`,
    [
      reviewId,
      valid,
      analysis.language,
      analysis.language_code,
      clampScore(analysis.language_confidence, 0, 1),
      valid ? analysis.overall_sentiment : 'neutral',
      valid ? clampScore(analysis.sentiment_score, -1, 1) : 0,
      valid ? clampScore(analysis.sentiment_confidence, 0, 1) : 0,
      asJson(analysis.aspects),
      asJson(analysis.problems),
      asJson(analysis.positive_points),
      asJson(analysis.themes),
      asJson(analysis.service_quality),
      asJson(analysis.emerging_attractions),
      analysis.actionable_insight || null,
    ],
  );
}

async function persistAnalysisError(reviewId: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  await pool.query(
    `INSERT INTO review_analysis (
      review_id, is_valid_tourist_review, aspects, problems, positive_points,
      themes, service_quality, emerging_attraction_signals, analysis_status,
      analysis_error, updated_at
    ) VALUES ($1, FALSE, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, 'error', $2, NOW())
    ON CONFLICT (review_id) DO UPDATE SET
      analysis_status = 'error',
      analysis_error = EXCLUDED.analysis_error,
      updated_at = NOW()`,
    [reviewId, message],
  );
  await pool.query(
    `UPDATE reviews SET is_valid = NULL, validation_reason = $2::text, analysis_json = jsonb_build_object('analysis_status', 'error', 'error', $2::text) WHERE id = $1`,
    [reviewId, message],
  );
}

export async function ingestApifyItems(destination: DestinationRecord, items: Record<string, any>[]): Promise<IngestResult> {
  const reviews = flattenApifyPlaceReviews(items);
  const result: IngestResult = { totalItems: reviews.length, newReviews: 0, updatedReviews: 0, invalidReviews: 0, analysisErrors: 0 };

  for (const item of reviews) {
    const normalized = normalizeApifyReview(item, destination);
    if (!normalized) continue;

    const saved = await saveRawReview(destination, normalized);
    if (saved.inserted) result.newReviews += 1;
    else result.updatedReviews += 1;

    try {
      const analysis = await analyzeReviewWithGemini(normalized.reviewText, normalized.rating ?? undefined);
      await persistAnalysis(saved.id, normalized.reviewText, normalized.rating, analysis);
      if (!analysis.is_valid_tourist_review) result.invalidReviews += 1;
    } catch (error) {
      result.analysisErrors += 1;
      await persistAnalysisError(saved.id, error);
      console.error(`[Review Analysis Error] ${saved.id}`, error);
    }
  }

  await pool.query(
    `UPDATE destinations SET total_reviews = (
      SELECT COUNT(*) FROM reviews WHERE destination_id = $1 AND source = 'apify_google_maps'
    ), avg_rating = COALESCE((SELECT ROUND(AVG(rating), 2) FROM reviews WHERE destination_id = $1 AND source = 'apify_google_maps' AND rating IS NOT NULL), 0), updated_at = NOW() WHERE id = $1`,
    [destination.id],
  );

  return result;
}

export function buildSearchTarget(destination: DestinationRecord): string {
  const name = destination.name.trim();
  const state = destination.state?.trim();
  const stateSuffix = state && state.toLowerCase() !== name.toLowerCase() ? `, ${state}` : '';
  return `${name}${stateSuffix} tourist attractions`;
}

export async function startApifyRun(destination: DestinationRecord) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error('APIFY_API_TOKEN is not configured');

  const maxPlaces = Math.max(1, Number.parseInt(process.env.APIFY_MAX_PLACES || '3', 10) || 3);
  const target = buildSearchTarget(destination);
  const response = await fetch(`https://api.apify.com/v2/acts/${APIFY_GOOGLE_MAPS_EXTRACTOR}/runs?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searchStringsArray: [target],
      locationQuery: `${destination.state || destination.name}, India`,
      maxCrawledPlacesPerSearch: maxPlaces,
      language: 'en',
    }),
  });

  if (!response.ok) {
    throw new Error(`Apify start failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  }
  const payload = await response.json() as { data?: { id?: string } };
  if (!payload.data?.id) throw new Error('Apify did not return a run id');
  return { runId: payload.data.id, target };
}

export function extractGoogleMapsPlaceUrls(items: Record<string, any>[]): string[] {
  return [...new Set(items
    .map((item) => firstString(item.googleMapsUrl, item.url, item.placeUrl))
    .filter((url): url is string => Boolean(url && /google\.[^/]+\/maps|goo\.gl\/maps/i.test(url))))];
}

export async function startApifyReviewsRun(placeUrls: string[]) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error('APIFY_API_TOKEN is not configured');
  if (placeUrls.length === 0) throw new Error('Google Maps Extractor returned no place URLs to fetch reviews from');

  const maxReviews = Math.max(1, Number.parseInt(process.env.APIFY_MAX_REVIEWS || '50', 10) || 50);
  const response = await fetch(`https://api.apify.com/v2/acts/${APIFY_GOOGLE_MAPS_REVIEWS}/runs?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startUrls: placeUrls.map((url) => ({ url })),
      maxReviews,
      reviewsSort: 'mostRelevant',
      reviewsOrigin: 'google',
      personalData: false,
      language: 'en',
    }),
  });

  if (!response.ok) {
    throw new Error(`Apify review fetch failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  }
  const payload = await response.json() as { data?: { id?: string } };
  if (!payload.data?.id) throw new Error('Apify did not return a review run id');
  return { runId: payload.data.id, placeCount: placeUrls.length };
}

export async function waitForApifyDataset(runId: string): Promise<Record<string, any>[]> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error('APIFY_API_TOKEN is not configured');
  const timeoutMs = Math.max(15000, Number.parseInt(process.env.APIFY_POLL_TIMEOUT_MS || '90000', 10) || 90000);
  const intervalMs = Math.max(1000, Number.parseInt(process.env.APIFY_POLL_INTERVAL_MS || '3000', 10) || 3000);
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?token=${encodeURIComponent(token)}`);
    if (!statusResponse.ok) throw new Error(`Apify status failed (${statusResponse.status})`);
    const statusPayload = await statusResponse.json() as { data?: { status?: string } };
    const status = statusPayload.data?.status;

    if (status === 'SUCCEEDED') {
      const datasetResponse = await fetch(`https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}/dataset/items?token=${encodeURIComponent(token)}&limit=1000`);
      if (!datasetResponse.ok) throw new Error(`Apify dataset fetch failed (${datasetResponse.status})`);
      const items = await datasetResponse.json();
      return Array.isArray(items) ? items : [];
    }
    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      throw new Error(`Apify run ended with status ${status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Apify run ${runId} exceeded the ${timeoutMs}ms polling timeout`);
}

function normalizedKey(value: unknown): string {
  return String(value || '').toLowerCase().normalize('NFKC').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function displayLabel(value: string): string {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function sentimentOf(value: unknown): 'positive' | 'negative' | 'neutral' {
  return value === 'positive' || value === 'negative' ? value : 'neutral';
}

function dateRecencyFactor(date: string | Date | null): number {
  if (!date) return 0.5;
  const ageDays = Math.max(0, (Date.now() - new Date(date).getTime()) / 86400000);
  return Math.max(0.5, 1 - Math.min(ageDays, 365) / 730);
}

export async function getDestinationIntelligence(destinationId: string) {
  const destinationResult = await pool.query('SELECT id, name, slug, state, total_reviews, avg_rating FROM destinations WHERE id = $1', [destinationId]);
  if (destinationResult.rows.length === 0) return null;
  const destination = destinationResult.rows[0];

  const rawCountResult = await pool.query(`SELECT COUNT(*)::int AS count FROM reviews WHERE destination_id = $1 AND source = 'apify_google_maps'`, [destinationId]);
  const rawCount = rawCountResult.rows[0]?.count || 0;

  const rowsResult = await pool.query(
    `SELECT r.id, r.rating, r.review_date, r.original_text, r.detected_language, r.translated_text,
            r.reviewer_name, r.place_name, r.place_address, r.review_url, r.source, r.created_at,
            ra.is_valid_tourist_review, ra.language, ra.language_code, ra.overall_sentiment,
            ra.sentiment_score, ra.sentiment_confidence, ra.aspects, ra.problems,
            ra.positive_points, ra.themes, ra.service_quality, ra.emerging_attraction_signals,
            ra.actionable_insight, ra.analysis_status, ra.analysis_error
     FROM reviews r
     LEFT JOIN review_analysis ra ON ra.review_id = r.id
     WHERE r.destination_id = $1 AND r.source = 'apify_google_maps'
     ORDER BY COALESCE(r.review_date, r.created_at::date) DESC, r.created_at DESC`,
    [destinationId],
  );

  const analyzedRows = rowsResult.rows.filter((row) => row.is_valid_tourist_review === true && row.analysis_status === 'ready');
  const analyzedCount = analyzedRows.length;
  const sentiment = { positive: 0, neutral: 0, negative: 0 };
  let ratingTotal = 0;
  let ratingCount = 0;
  const aspectMap = new Map<string, { mentions: number; positive: number; negative: number; neutral: number }>();
  const problemMap = new Map<string, { name: string; category: string; mentions: number; severity: string; evidence: string[] }>();
  const serviceMap = new Map<string, { positive: number; negative: number; neutral: number }>();
  const attractionMap = new Map<string, { name: string; type: string; mentions: number; positive: number; evidence: string[]; recency: number; signals: string[] }>();
  const severityRank: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };

  for (const row of analyzedRows) {
    const rowSentiment: 'positive' | 'negative' | 'neutral' = row.overall_sentiment === 'positive' || row.overall_sentiment === 'negative' ? row.overall_sentiment : 'neutral';
    sentiment[rowSentiment] += 1;
    if (row.rating !== null && row.rating !== undefined) {
      ratingTotal += Number(row.rating);
      ratingCount += 1;
    }

    for (const aspect of Array.isArray(row.aspects) ? row.aspects : []) {
      const key = normalizedKey(aspect.aspect);
      if (!key || !TOURISM_ASPECTS.includes(key as typeof TOURISM_ASPECTS[number])) continue;
      const current = aspectMap.get(key) || { mentions: 0, positive: 0, negative: 0, neutral: 0 };
      current.mentions += 1;
      current[sentimentOf(aspect.sentiment)] += 1;
      aspectMap.set(key, current);
    }

    for (const problem of Array.isArray(row.problems) ? row.problems : []) {
      const name = firstString(problem.problem, problem.problem_name, problem.canonical_problem);
      if (!name) continue;
      const category = normalizedKey(problem.aspect || problem.category) || 'general';
      const key = `${category}:${normalizedKey(name)}`;
      const current = problemMap.get(key) || { name, category, mentions: 0, severity: 'low', evidence: [] };
      current.mentions += 1;
      if ((severityRank[String(problem.severity)] || 1) > (severityRank[current.severity] || 1)) current.severity = String(problem.severity);
      current.evidence.push(firstString(problem.evidence, row.original_text) || row.original_text);
      problemMap.set(key, current);
    }

    for (const service of Array.isArray(row.service_quality) ? row.service_quality : []) {
      const key = normalizedKey(service.aspect);
      if (!key) continue;
      const current = serviceMap.get(key) || { positive: 0, negative: 0, neutral: 0 };
      current[sentimentOf(service.sentiment)] += 1;
      serviceMap.set(key, current);
    }

    for (const signal of Array.isArray(row.emerging_attraction_signals) ? row.emerging_attraction_signals : []) {
      const name = firstString(signal.name);
      if (!name) continue;
      const key = normalizedKey(name);
      const current = attractionMap.get(key) || { name, type: firstString(signal.type) || 'place', mentions: 0, positive: 0, evidence: [], recency: 0, signals: [] };
      current.mentions += 1;
      if (rowSentiment === 'positive' || rowSentiment === 'neutral') current.positive += 1;
      current.evidence.push(firstString(signal.evidence, row.original_text) || row.original_text);
      current.signals.push(firstString(signal.signal) || 'Positive mention');
      current.recency += dateRecencyFactor(row.review_date || row.created_at);
      attractionMap.set(key, current);
    }
  }

  const sentimentTotal = analyzedCount || 0;
  const percent = (count: number) => sentimentTotal ? Math.round((count / sentimentTotal) * 100) : null;
  const aspects = TOURISM_ASPECTS.map((aspect) => {
    const stats = aspectMap.get(aspect);
    return {
      aspect,
      mentions: stats?.mentions || 0,
      positive: stats?.positive || 0,
      negative: stats?.negative || 0,
      neutral: stats?.neutral || 0,
      satisfaction_rate: stats?.mentions ? Math.round((stats.positive / stats.mentions) * 100) : null,
      sufficient_data: Boolean(stats?.mentions),
    };
  });

  const recurringProblems = [...problemMap.values()]
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 8)
    .map((problem, index) => ({
      id: `${destinationId}-problem-${index}`,
      name: problem.name,
      category: problem.category,
      mention_count: problem.mentions,
      mention_pct: analyzedCount ? Math.round((problem.mentions / analyzedCount) * 100) : null,
      severity: problem.severity,
      description: `${problem.mentions} analyzed review${problem.mentions === 1 ? '' : 's'} mention this issue.`,
      representative_reviews: problem.evidence.slice(0, 3),
    }));

  const serviceQuality = [...serviceMap.entries()]
    .map(([category, stats], index) => {
      const mentions = stats.positive + stats.negative + stats.neutral;
      const score = mentions ? Math.round((stats.positive / mentions) * 100) : null;
      return { id: `${destinationId}-service-${index}`, category: displayLabel(category), score, review_count: mentions, sufficient_data: Boolean(mentions) };
    })
    .filter((item) => item.sufficient_data)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const emergingAttractions = [...attractionMap.values()]
    .filter((attraction) => attraction.mentions >= 2)
    .map((attraction, index) => {
      const positiveSentimentPct = Math.round((attraction.positive / attraction.mentions) * 100);
      const emergenceScore = Number((attraction.mentions * (positiveSentimentPct / 100) * (attraction.recency / attraction.mentions) * 100).toFixed(2));
      return {
        id: `${destinationId}-emerging-${index}`,
        attraction_name: attraction.name,
        type: attraction.type,
        mention_count: attraction.mentions,
        positive_sentiment_pct: positiveSentimentPct,
        emergence_score: emergenceScore,
        reasons: [...new Set(attraction.signals)].slice(0, 3),
        evidence: attraction.evidence.slice(0, 3),
        mention_growth_pct: null,
        growth_rate: 'Emerging signal',
      };
    })
    .sort((a, b) => b.emergence_score - a.emergence_score)
    .slice(0, 8);

  const serviceScores = serviceQuality.filter((item) => item.score !== null).map((item) => item.score as number);
  const overallServiceScore = serviceScores.length ? Math.round(serviceScores.reduce((sum, score) => sum + score, 0) / serviceScores.length) : null;
  const analysisErrors = rowsResult.rows.filter((row) => row.analysis_status === 'error').length;

  return {
    destination: {
      ...destination,
      total_reviews: rawCount,
      avg_rating: ratingCount ? Number((ratingTotal / ratingCount).toFixed(2)) : null,
      positive_pct: percent(sentiment.positive),
      neutral_pct: percent(sentiment.neutral),
      negative_pct: percent(sentiment.negative),
    },
    summary_metrics: {
      total_reviews_fetched: rawCount,
      total_reviews_analyzed: analyzedCount,
      analysis_errors: analysisErrors,
      data_context_label: analyzedCount ? `Based on ${analyzedCount} analyzed tourist reviews` : 'No analyzed reviews yet',
    },
    sentiment: {
      total_reviews: rawCount,
      analyzed_reviews: analyzedCount,
      positive: sentiment.positive,
      neutral: sentiment.neutral,
      negative: sentiment.negative,
      positive_pct: percent(sentiment.positive),
      neutral_pct: percent(sentiment.neutral),
      negative_pct: percent(sentiment.negative),
      average_rating: ratingCount ? Number((ratingTotal / ratingCount).toFixed(2)) : null,
    },
    aspects,
    overall_service_score: overallServiceScore,
    recurring_problems: recurringProblems,
    service_quality: serviceQuality,
    emerging_attractions: emergingAttractions,
    analysis_errors: rowsResult.rows.filter((row) => row.analysis_status === 'error').map((row) => ({ review_id: row.id, message: row.analysis_error })),
    reviews: rowsResult.rows.map((row) => ({
      id: row.id,
      original_text: row.original_text,
      translated_text: row.translated_text,
      rating: row.rating,
      detected_language: row.detected_language || row.language_code || 'unknown',
      sentiment: row.overall_sentiment || 'unavailable',
      review_date: row.review_date,
      created_at: row.created_at,
      reviewer_name: row.reviewer_name,
      place_name: row.place_name,
      place_address: row.place_address,
      review_url: row.review_url,
      source: row.source,
      analysis_status: row.analysis_status || 'pending',
      analysis_error: row.analysis_error,
    })),
  };
}

export async function generateEvidenceBrief(evidence: unknown) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    });
    const prompt = `You are generating a tourism brief from already analyzed tourist-review evidence. Use ONLY the supplied evidence. Do not introduce outside facts. Do not invent statistics, attractions, complaints, or recommendations. If the evidence is insufficient, say so explicitly. Return only JSON with keys summary and recommended_actions, where summary is a concise string and recommended_actions is an array of concise strings.\n\nEvidence:\n${JSON.stringify(evidence)}`;
    const response = await model.generateContent(prompt);
    const parsed = JSON.parse(response.response.text());
    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      recommended_actions: Array.isArray(parsed.recommended_actions) ? parsed.recommended_actions.filter((item: unknown) => typeof item === 'string') : [],
    };
  } catch (error) {
    console.error('[Gemini Destination Brief Error]', error);
    return null;
  }
}
