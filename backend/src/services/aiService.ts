import axios from 'axios';
import { analyzeReviewWithGemini, GeminiReviewAnalysis } from './geminiReviewService.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export interface ReviewAnalysisResult {
  is_valid_tourist_review: boolean;
  validation_reason: string | null;
  original_text: string;
  cleaned_text: string;
  detected_language: string;
  language_code: string;
  language_confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  sentiment_score: number;
  confidence: number;
  aspects: Array<{
    aspect: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    sentiment_score?: number;
    confidence: number;
    snippet: string;
    evidence?: string;
  }>;
  detected_problems: Array<{
    category: string;
    problem_name: string;
    severity: string;
    evidence?: string;
    confidence?: number;
  }>;
  positive_points?: Array<{
    point: string;
    aspect: string;
    confidence: number;
  }>;
  themes?: string[];
  service_quality?: Array<{
    aspect: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  }>;
  emerging_attractions?: Array<{
    name: string;
    type: string;
    signal: string;
    evidence: string;
  }>;
  actionable_insight?: string;
}

export async function analyzeReviewWithAI(text: string, rating?: number): Promise<ReviewAnalysisResult> {
  // Primary engine: Gemini Review Intelligence
  try {
    const geminiResult = await analyzeReviewWithGemini(text, rating);
    return {
      is_valid_tourist_review: geminiResult.is_valid_tourist_review,
      validation_reason: geminiResult.validation_reason,
      original_text: text,
      cleaned_text: text.trim(),
      detected_language: geminiResult.language_code || 'en',
      language_code: geminiResult.language_code || 'en',
      language_confidence: geminiResult.language_confidence,
      sentiment: geminiResult.overall_sentiment,
      sentiment_score: geminiResult.sentiment_score,
      confidence: geminiResult.sentiment_confidence,
      aspects: geminiResult.aspects.map(a => ({
        aspect: a.aspect,
        sentiment: a.sentiment,
        sentiment_score: a.sentiment === 'positive' ? 0.8 : a.sentiment === 'negative' ? -0.8 : 0,
        confidence: a.confidence,
        snippet: a.evidence || `${a.aspect} mentioned`,
        evidence: a.evidence
      })),
      detected_problems: geminiResult.problems.map(p => ({
        category: p.aspect,
        problem_name: p.problem,
        severity: p.severity,
        evidence: text.slice(0, 150),
        confidence: p.confidence
      })),
      positive_points: geminiResult.positive_points,
      themes: geminiResult.themes,
      service_quality: geminiResult.service_quality,
      emerging_attractions: geminiResult.emerging_attractions,
      actionable_insight: geminiResult.actionable_insight
    };
  } catch (geminiErr) {
    console.warn('[Review Intelligence] Gemini pipeline error, falling back to secondary engine:', geminiErr);
  }

  // Secondary fallback: Python FastAPI if running
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze-review`, { text, rating }, { timeout: 3000 });
    if (response.data && response.data.data) {
      const d = response.data.data;
      return {
        is_valid_tourist_review: true,
        validation_reason: null,
        original_text: text,
        cleaned_text: d.cleaned_text || text.trim(),
        detected_language: d.detected_language || 'en',
        language_code: d.detected_language || 'en',
        language_confidence: d.language_confidence || 0.85,
        sentiment: d.sentiment || 'neutral',
        sentiment_score: d.sentiment_score || 0,
        confidence: d.confidence || 0.85,
        aspects: d.aspects || [],
        detected_problems: d.detected_problems || [],
        actionable_insight: 'Standard review processed.'
      };
    }
  } catch (err) {
    // Secondary fallback offline
  }

  // Basic safe fallback
  return {
    is_valid_tourist_review: text.trim().length >= 10,
    validation_reason: text.trim().length < 10 ? 'Insufficient review content for analysis.' : null,
    original_text: text,
    cleaned_text: text.trim(),
    detected_language: 'en',
    language_code: 'en',
    language_confidence: 0.8,
    sentiment: rating && rating >= 4 ? 'positive' : rating && rating <= 2.5 ? 'negative' : 'neutral',
    sentiment_score: rating && rating >= 4 ? 0.75 : rating && rating <= 2.5 ? -0.7 : 0,
    confidence: 0.8,
    aspects: [],
    detected_problems: [],
    actionable_insight: 'Address ongoing visitor feedback.'
  };
}

export async function predictCrowdWithAI(hour: number, dayOfWeek: number, isWeekend: boolean = false) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/crowd-predict`, {
      hour,
      day_of_week: dayOfWeek,
      is_weekend: isWeekend
    }, { timeout: 4000 });
    return response.data.data;
  } catch (err) {
    const isPeak = (11 <= hour && hour <= 14) || (16 <= hour && hour <= 19);
    return {
      hour,
      day_of_week: dayOfWeek,
      predicted_level: isWeekend && isPeak ? 'very_high' : isPeak ? 'high' : hour < 10 ? 'low' : 'medium',
      predicted_count: isPeak ? 750 : 220,
      confidence: 0.85,
      best_time_window: '7:00 AM – 10:00 AM',
      model_version: 'fallback_heuristic'
    };
  }
}
