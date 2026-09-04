const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  total_reviews: number;
  avg_rating: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  intelligence_score: number;
  attraction_count?: number;
}

export interface Attraction {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  avg_rating: number;
  total_reviews: number;
  positive_pct: number;
  opening_hours: string;
  entry_fee: string;
  is_emerging: boolean;
  emergence_score: number;
}

export interface ProblemCluster {
  id: string;
  destination_id: string;
  name: string;
  category: string;
  mention_count: number;
  mention_pct: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
  trend_pct: number;
  representative_reviews: string[];
}

export interface ServiceQuality {
  id: string;
  category: string;
  score: number;
  review_count: number;
  trend: string;
  trend_pct: number;
}

export interface EmergingAttraction {
  id: string;
  attraction_id: string;
  attraction_name: string;
  emergence_score: number;
  mention_growth_pct: number;
  previous_period_mentions: number;
  current_period_mentions: number;
  positive_sentiment_pct: number;
  reasons: string[];
  type?: string;
  image_url?: string;
}

export interface ReviewAspect {
  id?: string;
  aspect: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score?: number;
  confidence?: number;
  snippet?: string;
  evidence?: string;
}

export interface ReviewProblem {
  problem_name: string;
  category?: string;
  aspect?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string;
  confidence?: number;
}

export interface ReviewAnalysis {
  is_valid_tourist_review: boolean;
  validation_reason: string | null;
  original_text: string;
  cleaned_text: string;
  detected_language: string;
  language?: string;
  language_code: string;
  language_confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  sentiment_score: number;
  confidence: number;
  aspects: ReviewAspect[];
  detected_problems: ReviewProblem[];
  positive_points?: Array<{ point: string; aspect: string; confidence: number }>;
  themes?: string[];
  service_quality?: Array<{ aspect: string; sentiment: 'positive' | 'negative' | 'neutral'; confidence: number }>;
  emerging_attractions?: Array<{ name: string; type: string; signal: string; evidence: string }>;
  actionable_insight?: string;
}

export interface AspectDimensionStat {
  aspect: string;
  mentions: number;
  positive: number;
  negative: number;
  neutral: number;
  satisfaction_rate: number;
}

export interface DestinationIntelligenceData {
  destination: Destination & {
    total_reviews: number;
    avg_rating: number | null;
    positive_pct: number | null;
    neutral_pct: number | null;
    negative_pct: number | null;
  };
  summary_metrics: {
    total_reviews_fetched: number;
    total_reviews_analyzed: number;
    analysis_errors: number;
    data_context_label?: string;
  };
  sentiment: {
    total_reviews: number;
    analyzed_reviews: number;
    positive: number;
    neutral: number;
    negative: number;
    positive_pct: number | null;
    neutral_pct: number | null;
    negative_pct: number | null;
    average_rating: number | null;
  };
  aspects: Array<{
    aspect: string;
    mentions: number;
    positive: number;
    negative: number;
    neutral: number;
    satisfaction_rate: number | null;
    sufficient_data: boolean;
  }>;
  overall_service_score: number | null;
  recurring_problems: Array<{
    id: string;
    name: string;
    category: string;
    mention_count: number;
    mention_pct: string | number | null;
    severity: string;
    description?: string;
    representative_reviews?: string[];
  }>;
  service_quality: Array<{
    id: string;
    category: string;
    score: number | string | null;
    review_count?: number;
    sufficient_data?: boolean;
  }>;
  emerging_attractions: Array<{
    id: string;
    attraction_name: string;
    mention_count: number;
    mention_growth_pct: number | string | null;
    growth_rate?: string;
    reasons?: string[];
    evidence?: string[];
    positive_sentiment_pct?: number | string;
    type?: string;
  }>;
  analysis_errors?: Array<{ review_id: string; message: string }>;
  reviews?: Array<Record<string, unknown>>;
  ai_brief: {
    summary: string;
    recommended_actions?: string[];
    overall_service_score?: number | null;
    data_context?: string;
  };
}

export interface LocalExperience {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  price_range: string;
  avg_rating: number;
  review_count: number;
  positive_sentiment_pct: number;
  popularity: string;
  sustainability_badge: boolean;
}

export const api = {
  // Destinations
  async getDestinations(search?: string): Promise<Destination[]> {
    const url = search ? `${API_BASE_URL}/destinations?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/destinations`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  async getDestinationDetails(slug: string) {
    const res = await fetch(`${API_BASE_URL}/destinations/${slug}`);
    const json = await res.json();
    return json.data;
  },

  // Reviews
  async getReviews(params: { destination_id?: string; language?: string; sentiment?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (params.destination_id) query.append('destination_id', params.destination_id);
    if (params.language) query.append('language', params.language);
    if (params.sentiment) query.append('sentiment', params.sentiment);
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE_URL}/reviews?${query.toString()}`);
    return await res.json();
  },

  async analyzeReview(payload: { destination_id?: string; attraction_id?: string; text: string; rating?: number; reviewer_name?: string }) {
    const res = await fetch(`${API_BASE_URL}/reviews/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async getReviewIntelligence(destinationId?: string): Promise<{ success: boolean; data: DestinationIntelligenceData }> {
    const url = destinationId ? `${API_BASE_URL}/reviews/intelligence?destination_id=${destinationId}` : `${API_BASE_URL}/reviews/intelligence`;
    const res = await fetch(url);
    return await res.json();
  },

  async translateIntelligence(payload: { target_language: string; destination_name: string; data: any }): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE_URL}/reviews/translate-intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async fetchReviews(destinationId: string): Promise<{ success: boolean; cached?: boolean; stale?: boolean; review_count?: number; message?: string; analysis_errors?: number }> {
    const res = await fetch(`${API_BASE_URL}/reviews/fetch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination_id: destinationId })
    });
    return await res.json();
  },

  async scrapeDestination(destinationId: string) {
    return this.fetchReviews(destinationId);
  },

  // Crowd
  async getCrowdForecast(attractionId: string, dayOfWeek: number = 0) {
    const res = await fetch(`${API_BASE_URL}/crowd/forecast/${attractionId}?day_of_week=${dayOfWeek}`);
    return await res.json();
  },

  // Itinerary
  async generateItinerary(payload: {
    destination_id: string;
    duration_days: number;
    budget_inr: number;
    interests: string[];
    crowd_preference: string;
    sustainability_preference: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/itinerary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Chat / Assistant
  async sendChatMessage(message: string, language: string = 'en', destination_slug: string = 'goa') {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, destination_slug })
    });
    return await res.json();
  },

  // Experiences
  async getExperiences(destinationId?: string, category?: string) {
    const query = new URLSearchParams();
    if (destinationId) query.append('destination_id', destinationId);
    if (category) query.append('category', category);
    const res = await fetch(`${API_BASE_URL}/experiences?${query.toString()}`);
    const json = await res.json();
    return json.data || [];
  },

  // Admin
  async getAdminOverview(destinationId?: string) {
    const url = destinationId ? `${API_BASE_URL}/admin/overview?destination_id=${destinationId}` : `${API_BASE_URL}/admin/overview`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  }
};
