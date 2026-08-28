-- YatraAI Database Schema
-- Migration 001: Initial Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================================
-- DESTINATIONS
-- ============================================================
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    total_reviews INTEGER DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    positive_pct NUMERIC(5,2) DEFAULT 0,
    neutral_pct NUMERIC(5,2) DEFAULT 0,
    negative_pct NUMERIC(5,2) DEFAULT 0,
    intelligence_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_name ON destinations USING gin(name gin_trgm_ops);

-- ============================================================
-- ATTRACTIONS
-- ============================================================
CREATE TABLE attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- beach, temple, market, museum, etc.
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    positive_pct NUMERIC(5,2) DEFAULT 0,
    opening_hours TEXT,
    entry_fee TEXT,
    is_emerging BOOLEAN DEFAULT FALSE,
    emergence_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(destination_id, slug)
);

CREATE INDEX idx_attractions_destination ON attractions(destination_id);
CREATE INDEX idx_attractions_type ON attractions(type);
CREATE INDEX idx_attractions_emerging ON attractions(is_emerging) WHERE is_emerging = TRUE;

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    attraction_id UUID REFERENCES attractions(id) ON DELETE SET NULL,
    original_text TEXT NOT NULL,
    detected_language VARCHAR(10),
    normalized_text TEXT,
    translated_text TEXT,
    rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5),
    review_date DATE,
    source VARCHAR(100) DEFAULT 'manual',
    reviewer_name VARCHAR(255),
    -- NLP results stored directly for fast queries
    sentiment VARCHAR(20), -- positive, neutral, negative
    sentiment_score NUMERIC(4,3), -- -1.0 to 1.0
    confidence NUMERIC(4,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_destination ON reviews(destination_id);
CREATE INDEX idx_reviews_attraction ON reviews(attraction_id);
CREATE INDEX idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX idx_reviews_language ON reviews(detected_language);
CREATE INDEX idx_reviews_date ON reviews(review_date);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- REVIEW ASPECTS (aspect-based sentiment)
-- ============================================================
CREATE TABLE review_aspects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    aspect VARCHAR(100) NOT NULL, -- cleanliness, parking, food, etc.
    sentiment VARCHAR(20) NOT NULL,
    sentiment_score NUMERIC(4,3),
    confidence NUMERIC(4,3),
    snippet TEXT -- the part of review mentioning this aspect
);

CREATE INDEX idx_review_aspects_review ON review_aspects(review_id);
CREATE INDEX idx_review_aspects_aspect ON review_aspects(aspect);
CREATE INDEX idx_review_aspects_sentiment ON review_aspects(sentiment);

-- ============================================================
-- PROBLEM CLUSTERS
-- ============================================================
CREATE TABLE problem_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- parking, cleanliness, transport, etc.
    mention_count INTEGER DEFAULT 0,
    mention_pct NUMERIC(5,2) DEFAULT 0,
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    trend VARCHAR(20) DEFAULT 'stable', -- increasing, stable, decreasing
    trend_pct NUMERIC(6,2) DEFAULT 0,
    representative_reviews TEXT[], -- array of example review snippets
    affected_attractions UUID[], -- array of attraction IDs
    first_detected DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_problem_clusters_destination ON problem_clusters(destination_id);
CREATE INDEX idx_problem_clusters_category ON problem_clusters(category);

-- ============================================================
-- SERVICE QUALITY
-- ============================================================
CREATE TABLE service_quality (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    attraction_id UUID REFERENCES attractions(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL, -- staff, food, cleanliness, transport, etc.
    score NUMERIC(3,2) CHECK (score >= 0 AND score <= 5),
    review_count INTEGER DEFAULT 0,
    trend VARCHAR(20) DEFAULT 'stable',
    trend_pct NUMERIC(6,2) DEFAULT 0,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_quality_destination ON service_quality(destination_id);
CREATE INDEX idx_service_quality_category ON service_quality(category);

-- Monthly service quality snapshots for trend analysis
CREATE TABLE service_quality_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    score NUMERIC(3,2),
    month DATE NOT NULL,
    review_count INTEGER DEFAULT 0
);

CREATE INDEX idx_sq_history_destination ON service_quality_history(destination_id);
CREATE INDEX idx_sq_history_month ON service_quality_history(month);

-- ============================================================
-- EMERGING ATTRACTIONS
-- ============================================================
CREATE TABLE emerging_attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    emergence_score NUMERIC(5,2) DEFAULT 0,
    mention_growth_pct NUMERIC(6,2) DEFAULT 0,
    previous_period_mentions INTEGER DEFAULT 0,
    current_period_mentions INTEGER DEFAULT 0,
    positive_sentiment_pct NUMERIC(5,2) DEFAULT 0,
    reasons TEXT[], -- why people like it
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_emerging_destination ON emerging_attractions(destination_id);
CREATE INDEX idx_emerging_score ON emerging_attractions(emergence_score DESC);

-- ============================================================
-- CROWD DATA & PREDICTIONS
-- ============================================================
CREATE TABLE crowd_historical (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour INTEGER CHECK (hour >= 0 AND hour <= 23),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    month INTEGER CHECK (month >= 1 AND month <= 12),
    is_holiday BOOLEAN DEFAULT FALSE,
    is_weekend BOOLEAN DEFAULT FALSE,
    visitor_count INTEGER,
    crowd_level VARCHAR(20), -- low, medium, high, very_high
    weather VARCHAR(50),
    temperature NUMERIC(4,1)
);

CREATE INDEX idx_crowd_hist_attraction ON crowd_historical(attraction_id);
CREATE INDEX idx_crowd_hist_date ON crowd_historical(date);

CREATE TABLE crowd_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour INTEGER CHECK (hour >= 0 AND hour <= 23),
    predicted_level VARCHAR(20) NOT NULL,
    predicted_count INTEGER,
    confidence NUMERIC(4,3),
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crowd_pred_attraction ON crowd_predictions(attraction_id);
CREATE INDEX idx_crowd_pred_date ON crowd_predictions(date);

-- ============================================================
-- LOCAL EXPERIENCES
-- ============================================================
CREATE TABLE local_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- food, crafts, workshop, cultural, market
    description TEXT,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    price_range VARCHAR(50), -- ₹, ₹₹, ₹₹₹
    avg_rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    positive_sentiment_pct NUMERIC(5,2) DEFAULT 0,
    popularity VARCHAR(20) DEFAULT 'moderate', -- low, moderate, high, trending
    sustainability_badge BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_experiences_destination ON local_experiences(destination_id);
CREATE INDEX idx_experiences_category ON local_experiences(category);

-- ============================================================
-- SUSTAINABILITY SCORES
-- ============================================================
CREATE TABLE sustainability_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    attraction_id UUID REFERENCES attractions(id) ON DELETE SET NULL,
    environmental_impact NUMERIC(5,2) DEFAULT 0,
    public_transport NUMERIC(5,2) DEFAULT 0,
    crowd_pressure NUMERIC(5,2) DEFAULT 0,
    local_benefit NUMERIC(5,2) DEFAULT 0,
    overall_score NUMERIC(5,2) DEFAULT 0,
    recommendations TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sustainability_destination ON sustainability_scores(destination_id);

-- ============================================================
-- ITINERARIES
-- ============================================================
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    user_preferences JSONB, -- budget, interests, crowd_pref, etc.
    duration_days INTEGER NOT NULL,
    budget_inr INTEGER,
    route_type VARCHAR(50) DEFAULT 'balanced', -- fastest, cheapest, least_crowded, sustainable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE itinerary_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    time_slot VARCHAR(20), -- 08:00
    attraction_id UUID REFERENCES attractions(id),
    experience_id UUID REFERENCES local_experiences(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    reasons TEXT[], -- why this was recommended
    rating NUMERIC(3,2),
    sentiment_pct NUMERIC(5,2),
    crowd_prediction VARCHAR(20),
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);

-- ============================================================
-- CHAT
-- ============================================================
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(10) DEFAULT 'en',
    destination_id UUID REFERENCES destinations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, assistant
    content TEXT NOT NULL,
    detected_language VARCHAR(10),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);

-- ============================================================
-- USERS (simplified for demo)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- user, admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SENTIMENT TIMELINE (pre-aggregated for fast chart queries)
-- ============================================================
CREATE TABLE sentiment_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    period DATE NOT NULL,
    period_type VARCHAR(10) DEFAULT 'month', -- day, week, month
    positive_count INTEGER DEFAULT 0,
    neutral_count INTEGER DEFAULT 0,
    negative_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0
);

CREATE INDEX idx_sentiment_timeline_dest ON sentiment_timeline(destination_id);
CREATE INDEX idx_sentiment_timeline_period ON sentiment_timeline(period);

-- ============================================================
-- ALERTS (for admin dashboard)
-- ============================================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- problem_increase, emerging_attraction, sentiment_drop, etc.
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, critical
    title VARCHAR(255) NOT NULL,
    description TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_destination ON alerts(destination_id);
CREATE INDEX idx_alerts_unread ON alerts(is_read) WHERE is_read = FALSE;
