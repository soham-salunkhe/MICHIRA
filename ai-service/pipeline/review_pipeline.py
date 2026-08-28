from typing import Dict, Any, List
from nlp.language_detector import detect_language
from nlp.text_cleaner import clean_text
from nlp.sentiment_analyzer import analyze_sentiment
from nlp.aspect_extractor import extract_aspects
from nlp.problem_detector import detect_problems

class ReviewPipeline:
    def process_review(self, raw_text: str, rating: float = None) -> Dict[str, Any]:
        """
        Executes the end-to-end review intelligence pipeline:
        Review -> Language Detection -> Cleaning -> Sentiment -> Aspects -> Problems
        """
        cleaned = clean_text(raw_text)
        lang, lang_conf = detect_language(cleaned)
        sentiment_res = analyze_sentiment(cleaned, rating=rating, lang=lang)
        aspects = extract_aspects(cleaned, lang=lang)
        problems = detect_problems(cleaned, sentiment=sentiment_res['sentiment'], aspects=aspects)

        return {
            'original_text': raw_text,
            'cleaned_text': cleaned,
            'detected_language': lang,
            'language_confidence': lang_conf,
            'sentiment': sentiment_res['sentiment'],
            'sentiment_score': sentiment_res['sentiment_score'],
            'confidence': sentiment_res['confidence'],
            'aspects': aspects,
            'detected_problems': problems
        }

review_pipeline = ReviewPipeline()
