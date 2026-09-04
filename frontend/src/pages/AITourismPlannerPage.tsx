import React, { useState } from 'react';
import { Search, Loader2, MapPin, TrendingUp, AlertCircle, Sparkles, Clock, Users, Heart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface PlanResult {
  success: boolean;
  place: {
    name: string;
    address: string;
  };
  reviewData: {
    reviewsAnalyzed: number;
    overallSentiment: string;
    positiveThemes: Array<{ name: string; mentions: number }>;
    negativeThemes: Array<{ name: string; mentions: number }>;
  };
  plan: {
    visitPlan: string;
    bestExperiences: string[];
    planSmarter: string[];
    summary: string;
    activities: Array<{
      title: string;
      description: string;
      evidence: string;
      priority: string;
    }>;
    tips: Array<{
      title: string;
      description: string;
      evidence: string;
      category: string;
    }>;
  };
  userPreferences?: {
    duration?: string;
    interests?: string[];
    travelStyle?: string;
  };
}

type LoadingState = 'idle' | 'searching' | 'analyzing' | 'planning';

export const AITourismPlannerPage: React.FC = () => {
  const [placeName, setPlaceName] = useState('');
  const [duration, setDuration] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<string>('');
  
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const durationOptions = [
    { value: '1-2_hours', label: '1–2 Hours' },
    { value: 'half_day', label: 'Half Day' },
    { value: 'full_day', label: 'Full Day' },
  ];

  const interestOptions = [
    { value: 'history', label: 'History & Culture' },
    { value: 'nature', label: 'Nature & Scenery' },
    { value: 'photography', label: 'Photography' },
    { value: 'food', label: 'Food' },
    { value: 'relaxed', label: 'Relaxed Experience' },
  ];

  const travelStyleOptions = [
    { value: 'solo', label: 'Solo' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'friends', label: 'Friends' },
  ];

  const toggleInterest = (value: string) => {
    setInterests(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
  };

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
      // Show progress messages
      const searchTimer = setTimeout(() => setLoadingState('analyzing'), 1000);
      const analyzeTimer = setTimeout(() => setLoadingState('planning'), 3000);

      console.log('[AI Planner Frontend] Sending request for:', placeName);

      const response = await fetch(`${API_URL}/api/ai-planner/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeName: placeName.trim(),
          duration: duration || undefined,
          interests: interests.length > 0 ? interests : undefined,
          travelStyle: travelStyle || undefined,
        }),
      });

      // Clear timers
      clearTimeout(searchTimer);
      clearTimeout(analyzeTimer);

      console.log('[AI Planner Frontend] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[AI Planner Frontend] Received data:', { success: data.success, reviewsAnalyzed: data.reviewData?.reviewsAnalyzed });

      if (!data.success) {
        throw new Error(data.message || 'Unable to generate plan');
      }

      setResult(data);
      setLoadingState('idle');
      console.log('[AI Planner Frontend] ✅ Plan loaded successfully');
    } catch (err: any) {
      console.error('[AI Planner Frontend] Error:', err);
      setError(err.message || 'Unable to generate plan. Please try again.');
      setLoadingState('idle');
    }
  };

  const getLoadingMessage = () => {
    switch (loadingState) {
      case 'searching':
        return 'Preparing your trip...';
      case 'analyzing':
        return 'Analyzing visitor feedback...';
      case 'planning':
        return 'Creating your personalized plan...';
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
          Review-Driven AI Tourism Planner
        </p>
        <h1
          className="text-4xl sm:text-5xl text-[#F3EFE6] leading-tight mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          What Should I Do Here?
        </h1>
        <p className="text-[#7A7870] text-base font-light leading-relaxed max-w-2xl">
          Get personalized visit recommendations based on what real tourists loved, 
          experienced, and advised. Powered by actual review analysis.
        </p>
      </header>

      <div className="border-t border-[#1E2120] mb-12" />

      {/* Main Content */}
      <main className="px-6 sm:px-12 max-w-4xl mx-auto pb-24">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-12">
          {/* Destination Input */}
          <div className="mb-6">
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6A6860] mb-2">
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Enter a tourist destination (e.g., Taj Mahal, Hampi)"
                disabled={loadingState !== 'idle'}
                className="w-full bg-[#0F1111] border border-[#2A2C2B] text-[#F3EFE6] px-5 py-4 text-base focus:outline-none focus:border-[#B99550] transition-colors placeholder:text-[#4A4C4B] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Optional Preferences */}
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#6A6860] mb-3">
              Optional Preferences
            </p>

            {/* Duration */}
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-[0.14em] text-[#8A8880] mb-2">
                Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDuration(duration === opt.value ? '' : opt.value)}
                    disabled={loadingState !== 'idle'}
                    className={`px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
                      duration === opt.value
                        ? 'bg-[#B99550] text-[#0B0D0D] font-medium'
                        : 'bg-[#0F1111] text-[#9E9C94] border border-[#2A2C2B] hover:border-[#B99550]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-[0.14em] text-[#8A8880] mb-2">
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleInterest(opt.value)}
                    disabled={loadingState !== 'idle'}
                    className={`px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
                      interests.includes(opt.value)
                        ? 'bg-[#B99550] text-[#0B0D0D] font-medium'
                        : 'bg-[#0F1111] text-[#9E9C94] border border-[#2A2C2B] hover:border-[#B99550]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-[0.14em] text-[#8A8880] mb-2">
                Travel Style
              </label>
              <div className="flex flex-wrap gap-2">
                {travelStyleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTravelStyle(travelStyle === opt.value ? '' : opt.value)}
                    disabled={loadingState !== 'idle'}
                    className={`px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
                      travelStyle === opt.value
                        ? 'bg-[#B99550] text-[#0B0D0D] font-medium'
                        : 'bg-[#0F1111] text-[#9E9C94] border border-[#2A2C2B] hover:border-[#B99550]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loadingState !== 'idle' || !placeName.trim()}
            className="w-full bg-[#B99550] hover:bg-[#A88540] text-[#0B0D0D] px-6 py-4 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loadingState !== 'idle' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {getLoadingMessage()}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate My Visit Plan
              </>
            )}
          </button>
        </form>

        {/* Loading State */}
        {loadingState !== 'idle' && (
          <div className="py-16 text-center" aria-live="polite">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1C1B] mb-6">
              <Loader2 className="w-8 h-8 text-[#B99550] animate-spin" />
            </div>
            <h2 className="text-xl font-serif text-[#F3EFE6] mb-2">{placeName}</h2>
            <p className="text-sm text-[#8A8880] mb-8 font-light">{getLoadingMessage()}</p>
            <div className="space-y-2 text-sm font-light">
              <p className={loadingState === 'searching' ? 'text-[#B99550]' : 'text-[#6A6860]'}>
                · Understanding what tourists recommend
              </p>
              <p
                className={
                  loadingState === 'analyzing' || loadingState === 'planning'
                    ? 'text-[#B99550]'
                    : 'text-[#6A6860]'
                }
              >
                · Analyzing visitor feedback
              </p>
              <p className={loadingState === 'planning' ? 'text-[#B99550]' : 'text-[#6A6860]'}>
                · Creating personalized recommendations
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
          <div className="space-y-8">
            {/* Place Info */}
            <section>
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-5 h-5 text-[#B99550] mt-1 shrink-0" />
                <div>
                  <h2
                    className="text-3xl sm:text-4xl text-[#F3EFE6] leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                  >
                    {result.place.name}
                  </h2>
                  <p className="text-[#6A6860] text-sm font-light mt-1">{result.place.address}</p>
                </div>
              </div>
            </section>

            <div className="border-t border-[#1E2120]" />

            {/* No Data Message */}
            {!result.reviewData && (
              <section className="py-8 text-center">
                <p className="text-[#8A8880] text-sm font-light">
                  {result.success === false ? error : 'Insufficient review data for plan generation'}
                </p>
              </section>
            )}

            {/* Visit Plan */}
            {result.reviewData && result.plan && (
              <>
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#B99550]" />
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860]">
                      Your Visit Plan
                    </p>
                  </div>
                  <p
                    className="text-[#C8C5BC] text-lg font-light leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                  >
                    {result.plan.visitPlan}
                  </p>
                </section>

                <div className="border-t border-[#1E2120]" />

                {/* Best Experiences */}
                {result.plan.bestExperiences.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-4 h-4 text-[#6A7856]" />
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860]">
                          Best Experiences
                        </p>
                      </div>
                      <p className="text-[#8A8880] text-xs font-light mb-4">
                        Based on positive tourist feedback
                      </p>
                      <div className="space-y-3">
                        {result.plan.bestExperiences.map((exp, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="text-sm text-[#6A7856] mt-0.5">✓</span>
                            <span className="text-sm text-[#D6D3CB] font-light">{exp}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="border-t border-[#1E2120]" />
                  </>
                )}

                {/* Plan Smarter */}
                {result.plan.planSmarter.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 text-[#9A6A55]" />
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860]">
                          Plan Smarter
                        </p>
                      </div>
                      <p className="text-[#8A8880] text-xs font-light mb-4">
                        Based on common review concerns
                      </p>
                      <div className="space-y-3">
                        {result.plan.planSmarter.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="text-sm text-[#9A6A55] mt-0.5">•</span>
                            <span className="text-sm text-[#D6D3CB] font-light">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="border-t border-[#1E2120]" />
                  </>
                )}

                {/* What to Expect */}
                {result.plan.summary && (
                  <>
                    <section>
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860] mb-3">
                        What to Expect
                      </p>
                      <p className="text-[#C8C5BC] text-base font-light leading-relaxed italic">
                        {result.plan.summary}
                      </p>
                    </section>

                    <div className="border-t border-[#1E2120]" />
                  </>
                )}

                {/* Evidence */}
                <section className="pt-4">
                  <p className="text-[10px] text-[#4A4C4B] font-light">
                    Plan based on currently analyzed tourist reviews
                  </p>
                  <p className="text-[10px] text-[#4A4C4B] font-light mt-1">
                    Reviews analyzed: {result.reviewData.reviewsAnalyzed} · Overall sentiment:{' '}
                    {result.reviewData.overallSentiment}
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
