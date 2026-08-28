import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from pipeline.review_pipeline import review_pipeline
from nlp.language_detector import detect_language
from nlp.sentiment_analyzer import analyze_sentiment
from nlp.aspect_extractor import extract_aspects
from ml.crowd_predictor import crowd_predictor
from ml.emergence_scorer import calculate_emergence_score

app = FastAPI(
    title="YatraAI Intelligence Engine",
    description="Multilingual tourist review intelligence, sentiment & aspect analysis, problem clustering & crowd forecasting for SIH 2026.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class ReviewAnalysisRequest(BaseModel):
    text: str = Field(..., description="Raw tourist review text")
    rating: Optional[float] = Field(None, ge=1.0, le=5.0, description="User rating (1-5)")

class BatchReviewRequest(BaseModel):
    reviews: List[ReviewAnalysisRequest]

class CrowdPredictRequest(BaseModel):
    hour: int = Field(..., ge=0, le=23)
    day_of_week: int = Field(..., ge=0, le=6)
    month: Optional[int] = Field(7, ge=1, le=12)
    is_weekend: Optional[bool] = False

class EmergenceScoreRequest(BaseModel):
    previous_mentions: int
    current_mentions: int
    positive_sentiment_pct: float
    recent_rating: float

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "yatraai-ai-engine",
        "supported_languages": ["en", "hi", "mr", "ta", "te", "gu", "kn", "bn"],
        "modules": ["language_detection", "sentiment_analysis", "aspect_extraction", "problem_clustering", "crowd_prediction", "emergence_scoring"]
    }

@app.post("/analyze-review")
def analyze_single_review(req: ReviewAnalysisRequest):
    try:
        result = review_pipeline.process_review(raw_text=req.text, rating=req.rating)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-analyze")
def analyze_batch_reviews(req: BatchReviewRequest):
    try:
        results = [review_pipeline.process_review(raw_text=r.text, rating=r.rating) for r in req.reviews]
        return {"success": True, "count": len(results), "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-language")
def detect_lang(payload: Dict[str, str]):
    text = payload.get("text", "")
    lang, conf = detect_language(text)
    return {"language": lang, "confidence": conf}

@app.post("/crowd-predict")
def predict_crowd(req: CrowdPredictRequest):
    try:
        result = crowd_predictor.predict(
            hour=req.hour,
            day_of_week=req.day_of_week,
            month=req.month,
            is_weekend=req.is_weekend
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/crowd-forecast/{day_of_week}")
def forecast_crowd_day(day_of_week: int, month: int = 7):
    try:
        forecast = crowd_predictor.predict_24h(day_of_week=day_of_week, month=month)
        return {"success": True, "day_of_week": day_of_week, "forecast": forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/calculate-emergence")
def get_emergence(req: EmergenceScoreRequest):
    try:
        result = calculate_emergence_score(
            previous_mentions=req.previous_mentions,
            current_mentions=req.current_mentions,
            positive_sentiment_pct=req.positive_sentiment_pct,
            recent_rating=req.recent_rating
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
