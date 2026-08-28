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
