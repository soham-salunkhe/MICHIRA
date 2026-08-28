import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export interface ReviewAnalysisResult {
  original_text: string;
  cleaned_text: string;
  detected_language: string;
  language_confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  confidence: number;
  aspects: Array<{
    aspect: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    sentiment_score: number;
    confidence: number;
    snippet: string;
  }>;
  detected_problems: Array<{
    category: string;
    problem_name: string;
    severity: string;
    evidence: string;
  }>;
}

export async function analyzeReviewWithAI(text: string, rating?: number): Promise<ReviewAnalysisResult> {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze-review`, { text, rating }, { timeout: 5000 });
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (err) {
    console.warn('AI Service unavailable or timed out, using fallback rules', err);
  }

  // Fallback heuristic if Python service is momentarily offline
  const isPos = (rating && rating >= 4) || text.toLowerCase().includes('good') || text.toLowerCase().includes('great') || text.toLowerCase().includes('beautiful');
  const isNeg = (rating && rating <= 2.5) || text.toLowerCase().includes('crowd') || text.toLowerCase().includes('dirty') || text.toLowerCase().includes('parking');
  
  return {
    original_text: text,
    cleaned_text: text.trim(),
    detected_language: 'en',
    language_confidence: 0.85,
    sentiment: isPos ? 'positive' : isNeg ? 'negative' : 'neutral',
    sentiment_score: isPos ? 0.75 : isNeg ? -0.7 : 0.0,
    confidence: 0.88,
    aspects: [],
    detected_problems: isNeg ? [{
      category: 'general',
      problem_name: 'Reported Issue',
      severity: 'medium',
      evidence: text.slice(0, 100)
    }] : []
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
