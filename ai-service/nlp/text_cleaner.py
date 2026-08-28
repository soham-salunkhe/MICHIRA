import re
import html

def clean_text(text: str) -> str:
    """
    Cleans raw review text, normalizing whitespace and unescaping HTML entities.
    Preserves Indic characters and standard punctuation.
    """
    if not text:
        return ""
    
    # Unescape HTML
    cleaned = html.unescape(text)
    
    # Replace URLs
    cleaned = re.sub(r'https?://\S+|www\.\S+', '', cleaned)
    
    # Normalize multiple whitespace / newlines
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return cleaned
