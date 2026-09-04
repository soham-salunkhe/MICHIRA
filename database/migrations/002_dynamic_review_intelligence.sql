-- Migration 002: Dynamic Apify review intelligence
-- The live review pipeline stores raw source records separately from Gemini analysis.

BEGIN;

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS place_name TEXT,
  ADD COLUMN IF NOT EXISTS place_address TEXT,
  ADD COLUMN IF NOT EXISTS external_review_id TEXT,
  ADD COLUMN IF NOT EXISTS review_url TEXT,
  ADD COLUMN IF NOT EXISTS is_valid BOOLEAN,
  ADD COLUMN IF NOT EXISTS validation_reason TEXT,
  ADD COLUMN IF NOT EXISTS analysis_json JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS uq_reviews_destination_external_id
  ON reviews(destination_id, external_review_id)
  WHERE external_review_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_destination_source_created
  ON reviews(destination_id, source, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_review_url
  ON reviews(review_url)
  WHERE review_url IS NOT NULL;

CREATE TABLE IF NOT EXISTS review_analysis (
  review_id UUID PRIMARY KEY REFERENCES reviews(id) ON DELETE CASCADE,
  is_valid_tourist_review BOOLEAN NOT NULL DEFAULT FALSE,
  language TEXT,
  language_code VARCHAR(10),
  language_confidence NUMERIC(4,3),
  overall_sentiment VARCHAR(20),
  sentiment_score NUMERIC(4,3),
  sentiment_confidence NUMERIC(4,3),
  aspects JSONB NOT NULL DEFAULT '[]'::jsonb,
  problems JSONB NOT NULL DEFAULT '[]'::jsonb,
  positive_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  themes JSONB NOT NULL DEFAULT '[]'::jsonb,
  service_quality JSONB NOT NULL DEFAULT '[]'::jsonb,
  emerging_attraction_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
  actionable_insight TEXT,
  analysis_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  analysis_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_analysis_valid
  ON review_analysis(is_valid_tourist_review, analysis_status);

CREATE INDEX IF NOT EXISTS idx_review_analysis_sentiment
  ON review_analysis(overall_sentiment);

COMMIT;
