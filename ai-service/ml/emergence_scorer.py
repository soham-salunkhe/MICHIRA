from typing import Dict, Any, List

def calculate_emergence_score(
    previous_mentions: int,
    current_mentions: int,
    positive_sentiment_pct: float,
    recent_rating: float
) -> Dict[str, Any]:
    """
    Computes an Emergence Score for attractions based on:
    - Mention growth rate (40% weight)
    - Positive sentiment ratio (30% weight)
    - Rating quality (20% weight)
    - Absolute mention velocity (10% weight)
    """
    if previous_mentions <= 0:
        previous_mentions = 1
        
    growth_pct = ((current_mentions - previous_mentions) / previous_mentions) * 100.0
    
    # Normalized components (0 to 100)
    growth_score = min(100.0, max(0.0, growth_pct / 3.0))
    sentiment_score = positive_sentiment_pct
    rating_score = (recent_rating / 5.0) * 100.0
    volume_score = min(100.0, current_mentions * 1.5)
    
    emergence_score = (
        0.40 * growth_score +
        0.30 * sentiment_score +
        0.20 * rating_score +
        0.10 * volume_score
    )
    
    is_emerging = emergence_score >= 65.0 and growth_pct >= 50.0 and positive_sentiment_pct >= 80.0
    
    return {
        'emergence_score': round(emergence_score, 1),
        'is_emerging': is_emerging,
        'growth_pct': round(growth_pct, 1),
        'positive_sentiment_pct': positive_sentiment_pct,
        'breakdown': {
            'growth_component': round(growth_score, 1),
            'sentiment_component': round(sentiment_score, 1),
            'rating_component': round(rating_score, 1),
            'volume_component': round(volume_score, 1)
        }
    }
