import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './IntelligenceDashboard.css';

interface ProblemCluster {
  category: string;
  name: string;
  mention_count: number;
  mention_pct: number;
  severity: 'high' | 'medium' | 'low';
  trend: 'rising' | 'stable' | 'declining';
  trend_pct: number;
  representative_reviews: string[];
}

interface ServiceQuality {
  category: string;
  score: number;
  review_count: number;
  trend: 'improving' | 'stable' | 'declining';
  trend_pct: number;
}

interface LanguageDistribution {
  detected_language: string;
  count: number;
}

interface SentimentDistribution {
  sentiment: string;
  count: number;
}

interface ReviewAnalysis {
  original_text: string;
  detected_language: string;
  language_confidence: number;
  sentiment: string;
  sentiment_score: number;
  confidence: number;
  aspects: Array<{
    aspect: string;
    sentiment: string;
    sentiment_score: number;
    snippet: string;
  }>;
  detected_problems: Array<{
    category: string;
    problem_name: string;
    severity: string;
    evidence: string;
  }>;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  mr: 'मराठी (Marathi)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  bn: 'বাংলা (Bengali)',
};

export const IntelligenceDashboard = () => {
  const [destinations, setDestinations] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [problems, setProblems] = useState<ProblemCluster[]>([]);
  const [serviceQuality, setServiceQuality] = useState<ServiceQuality[]>([]);
  const [languages, setLanguages] = useState<LanguageDistribution[]>([]);
  const [sentiments, setSentiments] = useState<SentimentDistribution[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(4);
  const [analysisResult, setAnalysisResult] = useState<ReviewAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setDestinations(data.data);
          setSelectedDestination(data.data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => {
        // If no destination is selected after fetch, stop loading
        if (destinations.length > 0) setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedDestination) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      fetch(`/api/destinations/${selectedDestination}`).then(r => r.json()),
      fetch(`/api/reviews?destination_id=${selectedDestination}&limit=200`).then(r => r.json()),
    ])
      .then(([destData, reviewData]) => {
        if (destData.success) {
          setProblems(destData.data.problems || []);
          setServiceQuality(destData.data.serviceQuality || []);
        }
        if (reviewData.success && reviewData.meta) {
          setLanguages(reviewData.meta.languages || []);
          setSentiments(reviewData.meta.sentimentDistribution || []);
        }
      })
      .catch((error) => {
        console.error('Failed to load data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDestination]);

  const handleAnalyzeReview = async () => {
    if (!reviewText.trim()) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/reviews/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_id: selectedDestination,
          text: reviewText,
          rating: reviewRating,
          source: 'intelligence_dashboard'
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.data.analysis);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '↗';
      case 'declining': return '↘';
      default: return '→';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#DC2626';
      default: return '#F59E0B';
    }
  };

  const totalReviews = sentiments.reduce((sum, s) => sum + parseInt(s.count as any), 0);

  return (
    <div className="intelligence-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <Link to="/" className="brand">MICHIRA</Link>
          <h1>AI Review Intelligence System</h1>
          <p className="subtitle">Multilingual tourist review analysis for tourism authorities</p>
        </div>
      </header>

      <div className="container dashboard-content">
        {/* Destination Selector */}
        <section className="selector-section">
          <label htmlFor="destination-select">Select Destination</label>
          <select
            id="destination-select"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="destination-select"
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </section>

        {loading ? (
          <div className="loading-state">Analyzing reviews...</div>
        ) : (
          <>
            {/* Overview Stats */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{totalReviews}</div>
                <div className="stat-label">Total Reviews Analyzed</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🌐</div>
                <div className="stat-value">{languages.length}</div>
                <div className="stat-label">Languages Detected</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-value">{problems.length}</div>
                <div className="stat-label">Recurring Problems</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{serviceQuality.length}</div>
                <div className="stat-label">Service Categories</div>
              </div>
            </section>

            {/* Problem Clusters */}
            <section className="problems-section">
              <h2>Recurring Problems Detected</h2>
              <p className="section-desc">AI-identified issues from negative and neutral review sentiment</p>

              {problems.length === 0 ? (
                <div className="empty-state">No recurring problems detected</div>
              ) : (
                <div className="problems-grid">
                  {problems.slice(0, 6).map((problem, idx) => (
                    <div key={idx} className="problem-card">
                      <div className="problem-header">
                        <span
                          className="severity-badge"
                          style={{ backgroundColor: getSeverityColor(problem.severity) }}
                        >
                          {problem.severity.toUpperCase()}
                        </span>
                        <span className="trend-indicator">
                          {getTrendIcon(problem.trend)} {Math.abs(problem.trend_pct)}%
                        </span>
                      </div>
                      <h3 className="problem-name">{problem.name}</h3>
                      <div className="problem-stats">
                        <span className="mention-count">{problem.mention_count} mentions</span>
                        <span className="mention-pct">{problem.mention_pct}% of reviews</span>
                      </div>
                      {problem.representative_reviews && problem.representative_reviews.length > 0 && (
                        <div className="evidence">
                          <strong>Evidence:</strong> "{problem.representative_reviews[0].substring(0, 100)}..."
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Service Quality Metrics */}
            <section className="service-quality-section">
              <h2>Service Quality by Aspect</h2>
              <p className="section-desc">Aspect-based sentiment analysis aggregated from reviews</p>

              {serviceQuality.length === 0 ? (
                <div className="empty-state">No service quality data available</div>
              ) : (
                <div className="quality-grid">
                  {serviceQuality.map((sq, idx) => (
                    <div key={idx} className="quality-card">
                      <div className="quality-header">
                        <h4>{sq.category}</h4>
                        <span className={`trend-badge trend-${sq.trend}`}>
                          {getTrendIcon(sq.trend)} {sq.trend}
                        </span>
                      </div>
                      <div className="quality-score">
                        <div className="score-value">{sq.score.toFixed(2)}</div>
                        <div className="score-max">/ 5.0</div>
                      </div>
                      <div className="quality-bar">
                        <div
                          className="quality-fill"
                          style={{ width: `${(sq.score / 5) * 100}%` }}
                        />
                      </div>
                      <div className="quality-meta">{sq.review_count} reviews analyzed</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Language & Sentiment Distribution */}
            <section className="distribution-section">
              <div className="distribution-card">
                <h2>Language Distribution</h2>
                <div className="distribution-list">
                  {languages.map((lang, idx) => {
                    const pct = ((parseInt(lang.count as any) / totalReviews) * 100).toFixed(1);
                    return (
                      <div key={idx} className="distribution-item">
                        <span className="dist-label">{LANGUAGE_NAMES[lang.detected_language] || lang.detected_language}</span>
                        <div className="dist-bar-container">
                          <div className="dist-bar" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="dist-value">{lang.count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="distribution-card">
                <h2>Sentiment Distribution</h2>
                <div className="distribution-list">
                  {sentiments.map((sent, idx) => {
                    const pct = ((parseInt(sent.count as any) / totalReviews) * 100).toFixed(1);
                    return (
                      <div key={idx} className="distribution-item">
                        <span className="dist-label" style={{ color: getSentimentColor(sent.sentiment) }}>
                          {sent.sentiment}
                        </span>
                        <div className="dist-bar-container">
                          <div
                            className="dist-bar"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: getSentimentColor(sent.sentiment)
                            }}
                          />
                        </div>
                        <span className="dist-value">{sent.count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Live Review Analysis */}
            <section className="analysis-section">
              <h2>Live Review Analysis Demo</h2>
              <p className="section-desc">Submit a review in any supported language to see real-time multilingual NLP analysis</p>

              <div className="analysis-form">
                <div className="form-group">
                  <label htmlFor="review-text">Review Text</label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write a review in English, Hindi, Marathi, Tamil, Telugu, Gujarati, Kannada, or Bengali..."
                    rows={5}
                    className="review-textarea"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-rating">Rating: {reviewRating}/5</label>
                  <input
                    id="review-rating"
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseFloat(e.target.value))}
                    className="rating-slider"
                  />
                </div>

                <button
                  onClick={handleAnalyzeReview}
                  disabled={analyzing || !reviewText.trim()}
                  className="analyze-btn"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Review'}
                </button>
              </div>

              {analysisResult && (
                <div className="analysis-result">
                  <h3>Analysis Results</h3>

                  <div className="result-grid">
                    <div className="result-card">
                      <strong>Detected Language</strong>
                      <div className="result-value">
                        {LANGUAGE_NAMES[analysisResult.detected_language] || analysisResult.detected_language}
                        <span className="confidence"> ({(analysisResult.language_confidence * 100).toFixed(1)}%)</span>
                      </div>
                    </div>

                    <div className="result-card">
                      <strong>Sentiment</strong>
                      <div className="result-value" style={{ color: getSentimentColor(analysisResult.sentiment) }}>
                        {analysisResult.sentiment}
                        <span className="confidence"> (score: {analysisResult.sentiment_score.toFixed(3)})</span>
                      </div>
                    </div>
                  </div>

                  {analysisResult.aspects.length > 0 && (
                    <div className="aspects-section">
                      <h4>Extracted Aspects</h4>
                      <div className="aspects-grid">
                        {analysisResult.aspects.map((asp, idx) => (
                          <div key={idx} className="aspect-card">
                            <div className="aspect-header">
                              <span className="aspect-name">{asp.aspect}</span>
                              <span
                                className="aspect-sentiment"
                                style={{ color: getSentimentColor(asp.sentiment) }}
                              >
                                {asp.sentiment}
                              </span>
                            </div>
                            <div className="aspect-snippet">"{asp.snippet}"</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.detected_problems.length > 0 && (
                    <div className="detected-problems-section">
                      <h4>Detected Problems</h4>
                      <div className="detected-problems-list">
                        {analysisResult.detected_problems.map((prob, idx) => (
                          <div key={idx} className="detected-problem">
                            <span
                              className="severity-badge"
                              style={{ backgroundColor: getSeverityColor(prob.severity) }}
                            >
                              {prob.severity}
                            </span>
                            <div className="problem-info">
                              <strong>{prob.problem_name}</strong>
                              <div className="problem-evidence">"{prob.evidence}"</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};
