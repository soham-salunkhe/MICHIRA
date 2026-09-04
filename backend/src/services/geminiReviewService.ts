import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

export interface ReviewAspectExtraction {
  aspect: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  evidence: string;
}

export interface ReviewProblemExtraction {
  problem: string;
  aspect: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence?: string;
}

export interface PositivePointExtraction {
  point: string;
  aspect: string;
  confidence: number;
}

export interface EmergingAttractionSignal {
  name: string;
  type: string;
  signal: string;
  evidence: string;
}

export interface GeminiReviewAnalysis {
  is_valid_tourist_review: boolean;
  validation_reason: string | null;
  language: string;
  language_code: string;
  language_confidence: number;
  overall_sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentiment_score: number;
  sentiment_confidence: number;
  aspects: ReviewAspectExtraction[];
  problems: ReviewProblemExtraction[];
  positive_points: PositivePointExtraction[];
  themes: string[];
  service_quality: Array<{ aspect: string; sentiment: 'positive' | 'negative' | 'neutral'; confidence: number }>;
  emerging_attractions: EmergingAttractionSignal[];
  actionable_insight: string;
}

const VALIDATION_MESSAGE = 'Insufficient tourism context';
const ALLOWED_ASPECTS = new Set([
  'heritage', 'attractions', 'transport', 'parking', 'cleanliness', 'crowding',
  'pricing', 'accommodation', 'food', 'service', 'accessibility', 'safety',
]);

const SYSTEM_PROMPT = `You are MICHIRA's multilingual tourist-review intelligence engine.
Analyze only the supplied review text. Never invent information that is not present in the review.

First validate the input. A meaningful review must contain tourism context such as a destination, attraction, accommodation, food, transport, guide, service, safety, accessibility, pricing, crowding, or cleanliness experience. Greetings, gibberish, test strings, and generic single words are invalid. For invalid input, return is_valid_tourist_review false, validation_reason exactly "Insufficient tourism context", neutral sentiment, zero confidence, and empty arrays.

Use these exact aspect keys when applicable: heritage, attractions, transport, parking, cleanliness, crowding, pricing, accommodation, food, service, accessibility, safety. Extract an aspect only when the review provides evidence for it. Normalize multilingual descriptions into a canonical English problem name, but include evidence from the review. Extract named attractions or experiences only when explicitly mentioned. Do not infer growth, popularity, or facts outside the review.

Return only valid JSON matching this shape:
{
  "is_valid_tourist_review": boolean,
  "validation_reason": string | null,
  "language": string,
  "language_code": string,
  "language_confidence": number,
  "overall_sentiment": "positive" | "negative" | "neutral" | "mixed",
  "sentiment_score": number,
  "sentiment_confidence": number,
  "aspects": [{"aspect": string, "sentiment": "positive" | "negative" | "neutral", "confidence": number, "evidence": string}],
  "problems": [{"problem": string, "aspect": string, "severity": "low" | "medium" | "high" | "critical", "confidence": number, "evidence": string}],
  "positive_points": [{"point": string, "aspect": string, "confidence": number}],
  "themes": [string],
  "service_quality": [{"aspect": string, "sentiment": "positive" | "negative" | "neutral", "confidence": number}],
  "emerging_attractions": [{"name": string, "type": string, "signal": string, "evidence": string}],
  "actionable_insight": string
}`;

function invalidAnalysis(reason = VALIDATION_MESSAGE): GeminiReviewAnalysis {
  return {
    is_valid_tourist_review: false,
    validation_reason: reason,
    language: 'Unknown',
    language_code: 'und',
    language_confidence: 1,
    overall_sentiment: 'neutral',
    sentiment_score: 0,
    sentiment_confidence: 0,
    aspects: [],
    problems: [],
    positive_points: [],
    themes: [],
    service_quality: [],
    emerging_attractions: [],
    actionable_insight: '',
  };
}

function sanitize(data: any): GeminiReviewAnalysis {
  const aspects = Array.isArray(data?.aspects)
    ? data.aspects.filter((item: any) => ALLOWED_ASPECTS.has(String(item?.aspect || '').toLowerCase())).map((item: any) => ({
      aspect: String(item.aspect).toLowerCase(),
      sentiment: ['positive', 'negative', 'neutral'].includes(item.sentiment) ? item.sentiment : 'neutral',
      confidence: clamp(item.confidence, 0, 1),
      evidence: String(item.evidence || ''),
    }))
    : [];
  const problems = Array.isArray(data?.problems) ? data.problems.filter((item: any) => item?.problem).map((item: any) => ({
    problem: String(item.problem).trim(),
    aspect: String(item.aspect || 'general').toLowerCase(),
    severity: ['low', 'medium', 'high', 'critical'].includes(item.severity) ? item.severity : 'medium',
    confidence: clamp(item.confidence, 0, 1),
    evidence: item.evidence ? String(item.evidence) : undefined,
  })) : [];

  return {
    is_valid_tourist_review: Boolean(data?.is_valid_tourist_review),
    validation_reason: data?.is_valid_tourist_review ? null : (data?.validation_reason || VALIDATION_MESSAGE),
    language: String(data?.language || 'Unknown'),
    language_code: String(data?.language_code || 'und'),
    language_confidence: clamp(data?.language_confidence, 0, 1),
    overall_sentiment: ['positive', 'negative', 'neutral', 'mixed'].includes(data?.overall_sentiment) ? data.overall_sentiment : 'neutral',
    sentiment_score: clamp(data?.sentiment_score, -1, 1),
    sentiment_confidence: clamp(data?.sentiment_confidence, 0, 1),
    aspects,
    problems,
    positive_points: Array.isArray(data?.positive_points) ? data.positive_points : [],
    themes: Array.isArray(data?.themes) ? data.themes.map(String) : [],
    service_quality: Array.isArray(data?.service_quality) ? data.service_quality : [],
    emerging_attractions: Array.isArray(data?.emerging_attractions) ? data.emerging_attractions.filter((item: any) => item?.name).map((item: any) => ({
      name: String(item.name),
      type: String(item.type || 'place'),
      signal: String(item.signal || ''),
      evidence: String(item.evidence || ''),
    })) : [],
    actionable_insight: String(data?.actionable_insight || ''),
  };
}

function clamp(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : 0;
}

export async function analyzeReviewWithGemini(text: string, rating?: number): Promise<GeminiReviewAnalysis> {
  const trimmed = String(text || '').trim();
  if (!trimmed || trimmed.length < 3) return invalidAnalysis();
  if (/^(hello|hi|hey|test|testing|asdf|asdfghjkl|qwerty|123|123456|good|ok|bad)$/i.test(trimmed)) return invalidAnalysis();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
  });
  const timeoutMs = Math.max(5000, Number.parseInt(process.env.GEMINI_TIMEOUT_MS || '20000', 10) || 20000);
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Gemini review analysis timed out')), timeoutMs));
  const response = await Promise.race([
    model.generateContent(`Review text:\n${trimmed}\n${rating !== undefined ? `Reviewer rating: ${rating}/5` : ''}`),
    timeout,
  ]);
  return sanitize(JSON.parse(response.response.text()));
}
