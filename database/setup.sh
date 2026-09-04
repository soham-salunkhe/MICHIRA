#!/usr/bin/env bash
# MICHIRA database bootstrap for live, evidence-backed review intelligence.

set -euo pipefail

DB_NAME="${DB_NAME:-yatraai}"
DB_USER="${DB_USER:-kanra}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

printf '%s\n' 'MICHIRA PostgreSQL setup' '========================'

if psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "Database '$DB_NAME' already exists. Dropping and recreating..."
  psql -U "$DB_USER" -d postgres -c "DROP DATABASE $DB_NAME;"
fi

psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
psql -U "$DB_USER" -d "$DB_NAME" -f "$SCRIPT_DIR/migrations/001_schema.sql"
psql -U "$DB_USER" -d "$DB_NAME" -f "$SCRIPT_DIR/migrations/002_dynamic_review_intelligence.sql"

cat <<'EOF'

Schema installed without demo review/intelligence rows.
The backend seeds only the static India-wide destination selector. Review data is
created by the server-side Apify -> PostgreSQL -> Gemini pipeline.

Required backend environment variables for live fetching:
  APIFY_API_TOKEN
  GEMINI_API_KEY
EOF

psql -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 'destinations' AS table_name, count(*) AS rows FROM destinations
UNION ALL SELECT 'reviews', count(*) FROM reviews
UNION ALL SELECT 'review_analysis', count(*) FROM review_analysis
UNION ALL SELECT 'problem_clusters', count(*) FROM problem_clusters
UNION ALL SELECT 'service_quality', count(*) FROM service_quality
UNION ALL SELECT 'emerging_attractions', count(*) FROM emerging_attractions
ORDER BY table_name;
"
