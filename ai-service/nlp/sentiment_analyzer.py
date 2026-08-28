import re
from typing import Dict, Any
from textblob import TextBlob

# Multilingual Sentiment Lexicon for Indian Languages
POSITIVE_INDIC_WORDS = {
    # Hindi / Marathi
    'सुंदर', 'अद्भुत', 'लाजवाब', 'शानदार', 'बढ़िया', 'स्वादिष्ट', 'आनंद', 'मजा', 
    'उत्कृष्ट', 'अच्छा', 'अच्छी', 'अच्छे', 'पसंद', 'प्यारा', 'जादुई', 'स्वर्ग',
    'छान', 'अप्रतिम', 'सुरेख', 'मजेदार', 'उत्तम', 'गोड', 'आवडले', 'रत्न',
    # Tamil
    'அழகு', 'அற்புதமான', 'சுவையான', 'சிறந்த', 'நன்றாக', 'மகிழ்ச்சி',
    # Telugu
    'బాగుంది', 'అద్భుతమైన', 'రుచికరమైన', 'మంచి', 'సంతోషం', 'అందమైన'
}

NEGATIVE_INDIC_WORDS = {
    # Hindi / Marathi
    'खराब', 'गंदा', 'गंदगी', 'भीड़', 'कचरा', 'निराशा', 'महंगा', 'मुश्किल', 'परेशान',
    'कमी', 'त्रास', 'गलिच्छ', 'अजिबात', 'कंटाळवाणा', 'धोकादायक', 'अस्वच्छ',
    # Tamil
    'மோசமான', 'அசுத்தமான', 'கூட்டம்', 'விலை', 'ஏமாற்றம்',
    # Telugu
    'చెడు', 'మురికి', 'రద్దీ', 'ఎక్కువ', 'నిరాశ'
}

def analyze_sentiment(text: str, rating: float = None, lang: str = 'en') -> Dict[str, Any]:
    """
    Multilingual sentiment analysis returning sentiment label, polarity score (-1.0 to 1.0),
    and confidence score.
    """
    if not text:
        return {'sentiment': 'neutral', 'sentiment_score': 0.0, 'confidence': 0.5}

    lower_text = text.lower()
    
    # 1. TextBlob English Sentiment Polarity
    blob = TextBlob(text)
    tb_polarity = blob.sentiment.polarity
    
    # 2. Indic Lexicon Matching
    pos_count = sum(1 for word in POSITIVE_INDIC_WORDS if word in text)
    neg_count = sum(1 for word in NEGATIVE_INDIC_WORDS if word in text)
    
    indic_polarity = 0.0
    if pos_count > 0 or neg_count > 0:
        indic_polarity = (pos_count - neg_count) / max(1, pos_count + neg_count)

    # 3. Combine Polarities
    combined_score = tb_polarity
    if lang in ['hi', 'mr', 'ta', 'te'] or (pos_count + neg_count) > 0:
        if abs(indic_polarity) > 0:
            combined_score = indic_polarity * 0.7 + tb_polarity * 0.3
    
    # Adjust with user rating if provided
    if rating is not None:
        rating_norm = (rating - 3.0) / 2.0  # Maps 1-5 to -1.0 to 1.0
        combined_score = combined_score * 0.6 + rating_norm * 0.4

    # Determine class and confidence
    score = max(-1.0, min(1.0, round(combined_score, 3)))
    
    if score >= 0.15:
        sentiment = 'positive'
        confidence = round(0.70 + abs(score) * 0.28, 3)
    elif score <= -0.15:
        sentiment = 'negative'
        confidence = round(0.70 + abs(score) * 0.28, 3)
    else:
        sentiment = 'neutral'
        confidence = round(0.65 + (1.0 - abs(score)) * 0.25, 3)
        
    return {
        'sentiment': sentiment,
        'sentiment_score': score,
        'confidence': min(0.99, confidence)
    }
