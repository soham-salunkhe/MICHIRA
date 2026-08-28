import numpy as np
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestClassifier

class CrowdPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.classes = ['low', 'medium', 'high', 'very_high']
        self._train_base_model()
        
    def _train_base_model(self):
        # Synthetic realistic training distribution
        # Features: [hour (0-23), day_of_week (0-6), is_weekend (0/1), month (1-12)]
        X = []
        y = []
        
        for month in range(1, 13):
            for dow in range(7):
                is_weekend = 1 if dow in [5, 6] else 0
                for hour in range(6, 23):
                    # Peak tourism hours: 11-13 and 16-19
                    is_peak_hour = 1 if (11 <= hour <= 13 or 16 <= hour <= 19) else 0
                    is_morning = 1 if (6 <= hour <= 9) else 0
                    is_afternoon = 1 if (14 <= hour <= 15) else 0
                    
                    if is_morning:
                        level = 'low'
                    elif is_weekend and is_peak_hour:
                        level = 'very_high'
                    elif is_peak_hour:
                        level = 'high'
                    elif is_weekend:
                        level = 'medium' if hour < 11 else 'high'
                    else:
                        level = 'medium' if (10 <= hour <= 16) else 'low'
                        
                    X.append([hour, dow, is_weekend, month])
                    y.append(level)
                    
        self.model.fit(X, y)

    def predict(self, hour: int, day_of_week: int, month: int = 7, is_weekend: bool = False) -> Dict[str, Any]:
        """
        Predicts crowd level for a given timestamp.
        """
        is_wk = 1 if (is_weekend or day_of_week in [5, 6]) else 0
        features = np.array([[hour, day_of_week, is_wk, month]])
        
        pred_label = self.model.predict(features)[0]
        probs = self.model.predict_proba(features)[0]
        confidence = float(np.max(probs))
        
        # Estimate visitor range based on level
        count_ranges = {
            'low': (30, 150),
            'medium': (150, 450),
            'high': (450, 850),
            'very_high': (850, 1400)
        }
        low_val, high_val = count_ranges.get(pred_label, (100, 500))
        predicted_count = int(low_val + (high_val - low_val) * (hour % 3 / 3.0))

        # Best time recommendation
        best_times = "7:00 AM – 10:00 AM" if pred_label in ['high', 'very_high'] else "Anytime morning or late afternoon"
        
        return {
            'hour': hour,
            'day_of_week': day_of_week,
            'predicted_level': pred_label,
            'predicted_count': predicted_count,
            'confidence': round(confidence, 3),
            'best_time_window': best_times,
            'model_version': 'rf_ensemble_v1.2'
        }

    def predict_24h(self, day_of_week: int, month: int = 7) -> List[Dict[str, Any]]:
        results = []
        for h in [6, 8, 10, 12, 14, 16, 18, 20, 22]:
            results.append(self.predict(hour=h, day_of_week=day_of_week, month=month))
        return results

crowd_predictor = CrowdPredictor()
