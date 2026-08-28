import re
from typing import List, Dict, Any

PROBLEM_TAXONOMY = {
    'parking': {
        'name': 'Parking Unavailability',
        'severity': 'high',
        'keywords': ['parking', 'park', 'nowhere to park', 'no parking', 'पार्किंग', 'పార్కింగ్', 'நிறுத்தம்']
    },
    'crowd': {
        'name': 'Overcrowding & Congestion',
        'severity': 'high',
        'keywords': ['crowd', 'crowded', 'overcrowded', 'rush', 'too many people', 'भीड़', 'गर्दी', 'கூட்டம்', 'రద్దీ']
    },
    'cleanliness': {
        'name': 'Waste & Cleanliness Issues',
        'severity': 'medium',
        'keywords': ['dirty', 'garbage', 'trash', 'litter', 'plastic', 'waste', 'गंदगी', 'कचरा', 'गलिच्छ', 'घाण', 'அசுத்தம்']
    },
    'transport': {
        'name': 'Traffic & Transport Problems',
        'severity': 'high',
        'keywords': ['traffic', 'narrow road', 'no bus', 'auto scam', 'traffic jam', 'ट्रैफिक', 'वाहतूक']
    },
    'safety': {
        'name': 'Aggressive Touts & Safety Concerns',
        'severity': 'medium',
        'keywords': ['hawker', 'tout', 'scam', 'aggressive', 'harassment', 'ठगी', 'दलाल']
    },
    'pricing': {
        'name': 'Overpricing & Hidden Costs',
        'severity': 'medium',
        'keywords': ['overpriced', 'expensive', 'rip off', 'extra charge', 'महंगा', 'महाग']
    },
    'accessibility': {
        'name': 'Poor Accessibility / Facilities',
        'severity': 'medium',
        'keywords': ['steep stairs', 'no wheelchair', 'no shade', 'no water', 'सीढ़ियां', 'पायऱ्या']
    }
}

def detect_problems(text: str, sentiment: str, aspects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Detects recurring problems from negative or neutral review text and extracted aspects.
    """
    if sentiment == 'positive':
        return []
        
    detected = []
    text_lower = text.lower()
    
    for cat, info in PROBLEM_TAXONOMY.items():
        matched = False
        # Check in extracted aspects if negative
        for asp in aspects:
            if asp['aspect'] == cat and asp['sentiment'] in ['negative', 'neutral']:
                matched = True
                break
        
        # Check in raw text keywords
        if not matched and any(kw in text_lower for kw in info['keywords']):
            matched = True
            
        if matched:
            detected.append({
                'category': cat,
                'problem_name': info['name'],
                'severity': info['severity'],
                'evidence': text[:180]
            })
            
    return detected
