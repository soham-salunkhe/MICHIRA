import re
from typing import Tuple

INDIC_LANG_SCRIPTS = {
    'devanagari': (0x0900, 0x097F),
    'tamil': (0x0B80, 0x0BFF),
    'telugu': (0x0C00, 0x0C7F),
    'kannada': (0x0C80, 0x0CFF),
    'malayalam': (0x0D00, 0x0D7F),
    'bengali': (0x0980, 0x09FF),
    'gujarati': (0x0A80, 0x0AFF),
}

# Distinctive word markers for Devanagari Hindi vs Marathi
MARATHI_MARKERS = {
    'आहे', 'आहेत', 'खूप', 'छान', 'नक्की', 'इथे', 'इथलं', 'बघा', 'सांगा', 'सुचवा', 
    'सुंदर', 'कमी', 'गर्दी', 'सोय', 'अजिबात', 'पण', 'करा', 'होते', 'झालं', 'पर्यटक', 
    'स्वच्छतेची', 'पाहण्यासारखे', 'अप्रतिम', 'रत्न', 'नाही', 'आलो', 'गेलो', 'आमचा'
}

HINDI_MARKERS = {
    'है', 'हैं', 'था', 'थे', 'थी', 'बहुत', 'सुंदर', 'खाना', 'यहाँ', 'यहां', 'जगह', 
    'देखना', 'चाहिए', 'शान', 'लाजवाब', 'भीड़', 'कचरा', 'गंदगी', 'निराशा', 'अद्भुत', 
    'मजा', 'फैला', 'हुआ', 'मिलेगा', 'बताइए', 'सुझाव', 'दीजिए', 'कैसा', 'कौन'
}

def detect_script(text: str) -> str:
    script_counts = {}
    for char in text:
        code = ord(char)
        for script, (start, end) in INDIC_LANG_SCRIPTS.items():
            if start <= code <= end:
                script_counts[script] = script_counts.get(script, 0) + 1
    
    if not script_counts:
        return 'latin'
    
    return max(script_counts.items(), key=lambda x: x[1])[0]

def detect_language(text: str) -> Tuple[str, float]:
    """
    Detects language: 'en', 'hi', 'mr', 'ta', 'te', 'gu', 'kn', 'bn'
    Returns (lang_code, confidence)
    """
    if not text or not text.strip():
        return 'en', 0.5

    clean = text.strip()
    script = detect_script(clean)
    
    if script == 'tamil':
        return 'ta', 0.95
    elif script == 'telugu':
        return 'te', 0.95
    elif script == 'kannada':
        return 'kn', 0.95
    elif script == 'bengali':
        return 'bn', 0.95
    elif script == 'gujarati':
        return 'gu', 0.95
    elif script == 'devanagari':
        words = set(re.findall(r'[\u0900-\u097F]+', clean.lower()))
        mr_matches = len(words.intersection(MARATHI_MARKERS))
        hi_matches = len(words.intersection(HINDI_MARKERS))
        
        if mr_matches > hi_matches:
            return 'mr', 0.92
        elif hi_matches > mr_matches:
            return 'hi', 0.92
        else:
            # Check character frequency common in Marathi (ळ, etc.)
            if 'ळ' in clean:
                return 'mr', 0.95
            return 'hi', 0.85
    
    # Check for English or transliterated Indian languages
    try:
        from langdetect import detect, detect_langs
        langs = detect_langs(clean)
        if langs:
            top = langs[0]
            if top.lang in ['en', 'hi', 'mr', 'ta', 'te', 'fr', 'de', 'es']:
                return top.lang, round(top.prob, 3)
    except Exception:
        pass

    return 'en', 0.88
