#!/bin/bash
# YatraAI Database Setup Script

set -e

DB_NAME="yatraai"
DB_USER="${DB_USER:-kanra}"

echo "🗄️  YatraAI Database Setup"
echo "========================="

# Check if database exists
if psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "⚠️  Database '$DB_NAME' already exists. Dropping and recreating..."
    psql -U "$DB_USER" -d postgres -c "DROP DATABASE $DB_NAME;"
fi

echo "📦 Creating database '$DB_NAME'..."
psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "📋 Running schema migration..."
psql -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/migrations/001_schema.sql"

echo "🌱 Seeding data..."
psql -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/seed/seed_data.sql"

echo ""
echo "✅ Database setup complete!"
echo ""

# Verify
echo "📊 Verification:"
psql -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 'destinations' as table_name, count(*) as rows FROM destinations
UNION ALL SELECT 'attractions', count(*) FROM attractions
UNION ALL SELECT 'reviews', count(*) FROM reviews
UNION ALL SELECT 'review_aspects', count(*) FROM review_aspects
UNION ALL SELECT 'problem_clusters', count(*) FROM problem_clusters
UNION ALL SELECT 'service_quality', count(*) FROM service_quality
UNION ALL SELECT 'emerging_attractions', count(*) FROM emerging_attractions
UNION ALL SELECT 'crowd_historical', count(*) FROM crowd_historical
UNION ALL SELECT 'crowd_predictions', count(*) FROM crowd_predictions
UNION ALL SELECT 'local_experiences', count(*) FROM local_experiences
UNION ALL SELECT 'sustainability_scores', count(*) FROM sustainability_scores
UNION ALL SELECT 'sentiment_timeline', count(*) FROM sentiment_timeline
UNION ALL SELECT 'alerts', count(*) FROM alerts
ORDER BY table_name;
"
