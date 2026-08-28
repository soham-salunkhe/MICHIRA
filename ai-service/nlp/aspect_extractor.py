import re
from typing import List, Dict, Any
from nlp.sentiment_analyzer import analyze_sentiment

ASPECT_KEYWORDS = {
    'cleanliness': [
        'clean', 'cleanliness', 'dirty', 'garbage', 'trash', 'litter', 'waste', 'hygiene', 'smell', 'plastic',
        'गंदगी', 'साफ', 'सफाई', 'कचरा', 'अस्वच्छ', 'स्वच्छता', 'गलिच्छ', 'घाण', 'அசுத்தம்', 'தூய்மை', 'పరిశుభ్రత'
    ],
    'parking': [
        'parking', 'park', 'car park', 'vehicle parking', 'space to park', 'valet',
        'पार्किंग', 'गाड़ी', 'पार्क', 'வாகனம்', 'நிறுத்தம்', 'పార్కింగ్'
    ],
    'food': [
        'food', 'meal', 'lunch', 'dinner', 'breakfast', 'dish', 'seafood', 'restaurant', 'shack', 'taste', 'curry', 'delicious',
        'खाना', 'स्वादिष्ट', 'भोजन', 'नाश्ता', 'स्वाद', 'जेवण', 'खाद्य', 'உணவு', 'சுவை', 'ఆహారం', 'రుచి'
    ],
    'crowd': [
        'crowd', 'crowded', 'overcrowded', 'rush', 'busy', 'line', 'queue', 'touristy',
        'भीड़', 'लाइन', 'कतार', 'गर्दी', 'रांग', 'கூட்டம்', 'வரிசை', 'రద్దీ', 'లైన్'
    ],
    'transport': [
        'transport', 'traffic', 'road', 'cab', 'taxi', 'bus', 'ferry', 'auto', 'rickshaw', 'drive', 'metro',
        'ट्रैफिक', 'सड़क', 'बस', 'गाड़ी', 'ऑटो', 'रस्ता', 'वाहतूक', 'போக்குவரத்து', 'రవాణా'
    ],
    'pricing': [
        'price', 'pricing', 'expensive', 'cost', 'money', 'overpriced', 'cheap', 'budget', 'worth', 'entry fee',
        'महंगा', 'सस्ता', 'पैसा', 'शुल्क', 'किफायती', 'खर्च', 'महाग', 'दर', 'விலை', 'கட்டணம்', 'ధర', 'ఖరీదైన'
    ],
    'staff': [
        'staff', 'guide', 'service', 'personnel', 'helpful', 'polite', 'rude', 'behaviour', 'hospitality',
        'स्टाफ', 'गाइड', 'सेवा', 'व्यवहार', 'कर्मचारी', 'मदत', 'ஊழியர்', 'வழிகாட்டி', 'సిబ్బంది'
    ],
    'safety': [
        'safe', 'safety', 'security', 'tout', 'scam', 'police', 'danger', 'lighting', 'harassment',
        'सुरक्षा', 'सुरक्षित', 'खतरा', 'ठगी', 'दलाल', 'धोका', 'பாதுகாப்பு', 'భద్రత'
    ],
    'heritage': [
        'heritage', 'monument', 'history', 'architecture', 'historical', 'fort', 'palace', 'temple', 'church', 'statue',
        'इतिहास', 'वास्तुकला', 'किला', 'महल', 'मंदिर', 'धरोहर', 'ऐतिहासिक', 'पुरातन', 'வரலாறு', 'கோவில்', 'చరిత్ర', 'కోట'
    ],
    'nature': [
        'nature', 'beach', 'sunset', 'sunrise', 'sea', 'waterfall', 'lake', 'greenery', 'mountain', 'scenery', 'view',
        'समुद्र', 'बीच', 'सूर्यास्त', 'झरना', 'झील', 'निसर्ग', 'डोंगर', 'கடற்கரை', 'இயற்கை', 'సముద్ర తీరం', 'ప్రకృతి'
    ],
    'accommodation': [
        'hotel', 'room', 'resort', 'stay', 'bed', 'bathroom', 'hostel', 'villa',
        'होटल', 'कमरा', 'ठहरना', 'हॉटेल', 'தங்குமிடம்', 'హోటల్', 'గది'
    ],
    'accessibility': [
        'wheelchair', 'stairs', 'ramp', 'elderly', 'accessible', 'climb', 'walk',
        'सीढ़ियां', 'चलना', 'अपंग', 'पायऱ्या', 'நடப்பது', 'నడక'
    ]
}

def extract_aspects(text: str, lang: str = 'en') -> List[Dict[str, Any]]:
    """
    Extracts aspect mentions along with per-aspect sentiment from review text.
    """
    if not text:
        return []

    lower_text = text.lower()
    sentences = re.split(r'[.!?।\n]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        sentences = [text]

    aspect_results = []
    seen_aspects = set()

    for aspect, keywords in ASPECT_KEYWORDS.items():
        matched_sentences = []
        for sentence in sentences:
            s_lower = sentence.lower()
            if any(kw in s_lower for kw in keywords):
                matched_sentences.append(sentence)
        
        if matched_sentences and aspect not in seen_aspects:
            seen_aspects.add(aspect)
            combined_snippet = " ".join(matched_sentences)
            sentiment_data = analyze_sentiment(combined_snippet, lang=lang)
            
            aspect_results.append({
                'aspect': aspect,
                'sentiment': sentiment_data['sentiment'],
                'sentiment_score': sentiment_data['sentiment_score'],
                'confidence': sentiment_data['confidence'],
                'snippet': combined_snippet[:200]
            })

    return aspect_results
