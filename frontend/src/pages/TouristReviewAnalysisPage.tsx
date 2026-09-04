import React, { useState } from 'react';
import { Search, Loader2, MapPin, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

interface AspectTheme {
  name: string;
  mentions: number;
}

interface AnalysisResult {
  success: boolean;
  place: {
    name: string;
    address: string;
  };
  provider: string;
  reviewsAnalyzed: number;
  overallSentiment: {
    label: string;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    mixedCount: number;
  };
  positiveAspects: AspectTheme[];
  negativeAspects: AspectTheme[];
  summary: string;
  message?: string;
}

type LoadingState = 'idle' | 'searching' | 'fetching' | 'analyzing' | 'generating';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const TouristReviewAnalysisPage: React.FC = () => {
  const [placeName, setPlaceName] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!placeName.trim()) {
      setError('Please enter a place name');
      return;
    }

    setError(null);
    setResult(null);
    setLoadingState('searching');

    try {
      // Create timer references for loading phases
      const fetchTimer = setTimeout(() => setLoadingState('fetching'), 800);
      const analyzeTimer = setTimeout(() => setLoadingState('analyzing'), 2000);
      const generateTimer = setTimeout(() => setLoadingState('generating'), 4000);

      console.log('[Tourist Review Analysis] Sending request for:', placeName);

      const response = await fetch(`${API_URL}/api/tourist-review-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeName: placeName.trim() }),
      });

      // Clear all timers immediately
      clearTimeout(fetchTimer);
      clearTimeout(analyzeTimer);
      clearTimeout(generateTimer);

      console.log('[Tourist Review Analysis] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[Tourist Review Analysis] Received data:', { 
        success: data.success, 
        reviewsAnalyzed: data.reviewsAnalyzed 
      });

      if (!data.success) {
        throw new Error(data.message || 'Unable to analyze reviews');
      }

      setResult(data);
      setLoadingState('idle');
      console.log('[Tourist Review Analysis] ✅ Results loaded successfully');
    } catch (err: any) {
      console.error('[Tourist Review Analysis] Error:', err);
      setError(err.message || 'Unable to analyze reviews. Please try again.');
      setLoadingState('idle');
    }
  };

  const getLoadingMessage = () => {
    switch (loadingState) {
      case 'searching':
        return 'Finding destination...';
      case 'fetching':
        return 'Fetching available reviews...';
      case 'analyzing':
        return 'Analyzing tourist feedback...';
      case 'generating':
        return 'Generating insights...';
      default:
        return '';
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0B0D0D] text-[#F3EFE6] antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header className="pt-24 pb-12 px-6 sm:px-12 max-w-4xl mx-auto">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860] mb-3 font-sans">
          AI Tourist Review Analysis
        </p>
        <h1
          className="text-4xl sm:text-5xl text-[#F3EFE6] leading-tight mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          Real-Time Tourist Insights
        </h1>
        <p className="text-[#7A7870] text-base font-light leading-relaxed max-w-2xl">
          Enter any tourist destination to discover what travelers love and what concerns them most.
          Powered by real reviews and multilingual AI analysis.
        </p>
      </header>

      <div className="border-t border-[#1E2120] mb-12" />

      {/* Search Form */}
      <main className="px-6 sm:px-12 max-w-4xl mx-auto pb-24">
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="Enter a tourist destination (e.g., Taj Mahal, Hampi, Ajanta Caves)"
              disabled={loadingState !== 'idle'}
              className="w-full bg-[#0F1111] border border-[#2A2C2B] text-[#F3EFE6] px-5 py-4 pr-32 text-base focus:outline-none focus:border-[#B99550] transition-colors placeholder:text-[#4A4C4B] disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <button
              type="submit"
              disabled={loadingState !== 'idle' || !placeName.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#B99550] hover:bg-[#A88540] text-[#0B0D0D] px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingState !== 'idle' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loadingState !== 'idle' && (
          <div className="py-20 text-center" aria-live="polite">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1C1B] mb-6">
              <Loader2 className="w-8 h-8 text-[#B99550] animate-spin" />
            </div>
            <h2 className="text-2xl font-serif text-[#F3EFE6] mb-2">{placeName}</h2>
            <p className="text-sm text-[#8A8880] mb-8 font-light">{getLoadingMessage()}</p>
            <div className="space-y-2 text-sm font-light">
              <p className={loadingState === 'searching' ? 'text-[#B99550]' : 'text-[#6A6860]'}>
                · Finding destination
              </p>
              <p
                className={
                  loadingState === 'fetching' || loadingState === 'analyzing' || loadingState === 'generating'
                    ? 'text-[#B99550]'
                    : 'text-[#6A6860]'
                }
              >
                · Fetching tourist reviews
              </p>
              <p
                className={
                  loadingState === 'analyzing' || loadingState === 'generating'
                    ? 'text-[#B99550]'
                    : 'text-[#6A6860]'
                }
              >
                · Analyzing review evidence
              </p>
              <p className={loadingState === 'generating' ? 'text-[#B99550]' : 'text-[#6A6860]'}>
                · Generating insights
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1A1A] mb-4">
              <AlertCircle className="w-6 h-6 text-[#9A6A55]" />
            </div>
            <p className="text-[#8A8880] text-sm mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setResult(null);
              }}
              className="text-xs text-[#B99550] border border-[#B99550]/30 px-4 py-2 hover:border-[#B99550] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {result && loadingState === 'idle' && (
          <div className="space-y-12">
            {/* Place Information */}
            <section>
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-5 h-5 text-[#B99550] mt-1 shrink-0" />
                <div>
                  <h2
                    className="text-3xl sm:text-4xl text-[#F3EFE6] leading-tight"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 500,
                    }}
                  >
                    {result.place.name}
                  </h2>
                  <p className="text-[#6A6860] text-sm font-light mt-1">{result.place.address}</p>
                </div>
              </div>
            </section>

            <div className="border-t border-[#1E2120]" />

            {/* No Reviews Message */}
            {result.reviewsAnalyzed === 0 && result.message && (
              <section className="py-8 text-center">
                <p className="text-[#8A8880] text-sm font-light">{result.message}</p>
              </section>
            )}

            {/* Overall Sentiment */}
            {result.reviewsAnalyzed > 0 && (
              <>
                <section>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860] mb-3">
                    Overall Sentiment
                  </p>
                  <div className="flex items-baseline gap-4">
                    <h3
                      className="text-3xl text-[#F3EFE6]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                      }}
                    >
                      {result.overallSentiment.label}
                    </h3>
                    <span className="text-sm text-[#6A6860] font-light">
                      Based on {result.reviewsAnalyzed} analyzed review
                      {result.reviewsAnalyzed !== 1 ? 's' : ''}
                    </span>
                  </div>
                </section>

                <div className="border-t border-[#1E2120]" />

                {/* What Tourists Like */}
                {result.positiveAspects.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-[#6A7856]" />
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860]">
                          What Tourists Like
                        </p>
                      </div>
                      <div className="space-y-4">
                        {result.positiveAspects.map((aspect, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                              <span className="text-[11px] font-mono text-[#4A4C4B] w-5 shrink-0">
                                0{idx + 1}
                              </span>
                              <span className="text-sm text-[#D6D3CB] font-light">
                                ✓ {aspect.name}
                              </span>
                            </div>
                            <span className="text-xs text-[#6A6860] font-mono shrink-0">
                              Mentioned in {aspect.mentions} review{aspect.mentions !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="border-t border-[#1E2120]" />
                  </>
                )}

                {/* Common Concerns */}
                {result.negativeAspects.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 text-[#9A6A55]" />
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860]">
                          Common Concerns
                        </p>
                      </div>
                      <div className="space-y-4">
                        {result.negativeAspects.map((aspect, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                              <span className="text-[11px] font-mono text-[#4A4C4B] w-5 shrink-0">
                                0{idx + 1}
                              </span>
                              <span className="text-sm text-[#D6D3CB] font-light">
                                ⚠ {aspect.name}
                              </span>
                            </div>
                            <span className="text-xs text-[#6A6860] font-mono shrink-0">
                              Mentioned in {aspect.mentions} review{aspect.mentions !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="border-t border-[#1E2120]" />
                  </>
                )}

                {result.negativeAspects.length === 0 && result.positiveAspects.length > 0 && (
                  <>
                    <section>
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860] mb-3">
                        Common Concerns
                      </p>
                      <p className="text-sm text-[#6A6860] font-light italic">
                        No strong recurring concerns were detected in the currently available reviews.
                      </p>
                    </section>

                    <div className="border-t border-[#1E2120]" />
                  </>
                )}

                {/* AI Summary */}
                {result.summary && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-[#B99550]" />
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860]">
                        TourIntel AI Summary
                      </p>
                    </div>
                    <p
                      className="text-[#C8C5BC] text-lg font-light leading-relaxed italic"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                      }}
                    >
                      &ldquo;{result.summary}&rdquo;
                    </p>
                  </section>
                )}

                {/* Provider Attribution */}
                <section className="pt-6">
                  <p className="text-[10px] text-[#4A4C4B] font-light">
                    Data source: {result.provider} · Analysis powered by MICHIRA AI
                  </p>
                  <p className="text-[9px] text-[#3A3C3B] font-light mt-1">
                    Review data accessed via SerpAPI · No affiliation with Google
                  </p>
                </section>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
