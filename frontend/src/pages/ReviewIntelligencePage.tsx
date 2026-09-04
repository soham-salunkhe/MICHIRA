import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api, Destination, DestinationIntelligenceData } from '../services/api';
import { DestinationPicker } from '../components/DestinationPicker';

// ── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  original_text: string;
  translated_text?: string | null;
  rating: number | string;
  detected_language: string;
  sentiment: string;
  review_date: string;
  created_at: string;
  attraction_name?: string | null;
  destination_name?: string;
  source?: string;
  reviewer_name?: string | null;
  place_name?: string | null;
  place_address?: string | null;
  review_url?: string | null;
  analysis_status?: string;
  analysis_error?: string | null;
}

interface TranslatedContent {
  ai_summary?: string;
  recurring_problems?: Array<{ name: string; description?: string }>;
  service_quality?: Array<{ category: string }>;
  emerging_attractions?: Array<{ attraction_name: string; reasons?: string[] }>;
}

// ── Constants ────────────────────────────────────────────────────────────────

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number | string }) {
  const r = typeof rating === 'string' ? parseFloat(rating) : rating;
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return (
    <span className="text-[#D2A95D] text-sm tracking-tight select-none" aria-label={`${r} stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return '★';
        if (i === full && half) return '½';
        return '☆';
      }).join('')}
    </span>
  );
}

function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function langFlag(code: string): string {
  const flags: Record<string, string> = {
    en: '🇬🇧', hi: '🇮🇳', mr: '🇮🇳', bn: '🇮🇳', ta: '🇮🇳',
    te: '🇮🇳', kn: '🇮🇳', ml: '🇮🇳', gu: '🇮🇳', pa: '🇮🇳',
    or: '🇮🇳', as: '🇮🇳', ur: '🇮🇳',
  };
  return flags[code] || '🌐';
}

function langName(code: string): string {
  const names: Record<string, string> = {
    en: 'English', hi: 'Hindi', mr: 'Marathi', bn: 'Bengali',
    ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam',
    gu: 'Gujarati', pa: 'Punjabi', or: 'Odia', as: 'Assamese', ur: 'Urdu',
  };
  return names[code] || code.toUpperCase();
}

function normalizeScore(score: number | string | null): number | null {
  if (score === null || score === undefined || score === '') return null;
  const n = typeof score === 'string' ? parseFloat(score) : score;
  if (!Number.isFinite(n)) return null;
  return n <= 5 ? Math.round(n * 20) : Math.round(n);
}

function normalizePct(pct: number | string | null): number {
  if (pct === null || pct === undefined || pct === '') return 0;
  const n = typeof pct === 'string' ? parseFloat(pct) : pct;
  if (!Number.isFinite(n)) return 0;
  // If stored as decimal fraction (0.32) vs percentage (32)
  return n > 0 && n < 1 ? Math.round(n * 100) : Math.round(n);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return <div className="border-t border-[#1E2120] my-12" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860] mb-2 font-sans">
      {children}
    </p>
  );
}

function LoadingSteps({ destName, phase }: { destName: string; phase: 'fetching' | 'analyzing' }) {
  const fetching = phase === 'fetching';
  return (
    <div className="py-20 text-center" aria-live="polite">
      <h2 className="text-2xl font-serif text-[#F3EFE6] mb-1">{destName}</h2>
      <p className="text-sm text-[#8A8880] mb-8 font-light">
        {fetching ? 'Gathering recent reviews from Google Maps...' : 'MICHIRA is extracting multilingual tourism insights...'}
      </p>
      <div className="space-y-2 text-sm font-light">
        <p className={fetching ? 'text-[#B99550]' : 'text-[#6A6860]'}>· Fetching tourist reviews</p>
        <p className={!fetching ? 'text-[#B99550]' : 'text-[#6A6860]'}>· Analyzing review evidence</p>
        <p className="text-[#6A6860]">· Calculating destination intelligence</p>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  showTranslation,
  onToggleTranslation,
}: {
  review: Review;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}) {
  const rating = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
  const hasTranslation = review.detected_language !== 'en' && review.translated_text;
  const displayDate = review.review_date || review.created_at;

  return (
    <article className="pt-6 first:pt-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <StarRating rating={rating || 0} />
        <span className="text-[11px] text-[#6A6860] font-mono shrink-0 mt-0.5">
          {formatRelativeDate(displayDate)}
        </span>
      </div>

      <p className="text-[#D6D3CB] text-sm font-light leading-relaxed mb-2">
        &ldquo;{review.original_text}&rdquo;
      </p>

      {hasTranslation && showTranslation && (
        <p className="text-[#8A8880] text-xs font-light italic border-l border-[#2A2C2B] pl-3 mb-2 leading-relaxed">
          {review.translated_text}
        </p>
      )}

      {review.analysis_status === 'error' && (
        <p className="text-[11px] text-[#9A6A55] mb-2">
          Review indexed; analysis unavailable right now.
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-[#6A6860]">
          {review.attraction_name && (
            <span className="font-medium text-[#9E9C94]">{review.attraction_name}</span>
          )}
          {review.attraction_name && <span>·</span>}
          <span>{langFlag(review.detected_language)} {langName(review.detected_language)}</span>
        </div>
        {hasTranslation && (
          <button
            onClick={onToggleTranslation}
            className="text-[10px] text-[#6A6860] hover:text-[#B99550] transition-colors font-sans tracking-wide"
          >
            {showTranslation ? 'Hide translation' : 'View translation'}
          </button>
        )}
      </div>

      <div className="border-t border-[#181A19] mt-5" />
    </article>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

type LoadingState = 'idle' | 'loading' | 'error' | 'no-data';
type LoadingPhase = 'fetching' | 'analyzing';

export const ReviewIntelligencePage: React.FC = () => {
  // ── State ──────────────────────────────────────────────────────────────
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [intelligence, setIntelligence] = useState<DestinationIntelligenceData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('fetching');
  const [loadMessage, setLoadMessage] = useState<string | null>(null);

  // Review panel state
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // category filter for "view related reviews"
  const [expandedTranslations, setExpandedTranslations] = useState<Set<string>>(new Set());

  // Multilingual
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState<Record<string, TranslatedContent>>({});

  const retryLoad = useCallback(() => {
    if (selectedDestination) {
      // Create a new value so the destination-loading effect runs again.
      setSelectedDestination({ ...selectedDestination });
    }
  }, [selectedDestination]);

  // ── Load destinations ─────────────────────────────────────────────────
  useEffect(() => {
    api.getDestinations().then((dests) => {
      if (dests && dests.length > 0) {
        setDestinations(dests);
        const defaultDest = dests.find((d) => d.slug === 'goa') || dests[0];
        setSelectedDestination(defaultDest);
      }
    }).catch(console.error);
  }, []);

  // ── Load data when destination changes ────────────────────────────────
  useEffect(() => {
    if (!selectedDestination) return;
    let active = true;
    const destId = selectedDestination.id;

    setIntelligence(null);
    setReviews([]);
    setActiveFilter(null);
    setShowAllReviews(false);
    setSelectedLanguage('en');
    setTranslatedData({});
    setExpandedTranslations(new Set());
    setLoadMessage(null);
    setLoadingState('loading');
    setLoadingPhase('fetching');

    (async () => {
      try {
        const fetchResult = await api.fetchReviews(destId);
        if (!active) return;
        setLoadMessage(fetchResult.message || null);
        // Only bail out if fetch failed AND there's explicitly no cached data
        // (apify_unavailable still sets cached:true so we proceed)
        if (!fetchResult.success && !fetchResult.cached && fetchResult.review_count === 0) {
          setLoadingState('error');
          return;
        }

        setLoadingPhase('analyzing');
        const [intelligenceRes, reviewsRes] = await Promise.all([
          api.getReviewIntelligence(destId),
          api.getReviews({ destination_id: destId, limit: 30 }),
        ]);
        if (!active) return;

        const hasIntelligence = intelligenceRes?.success && intelligenceRes?.data;
        const validReviews = ((reviewsRes?.data || []) as Review[]).filter(
          (review) => review.original_text && review.original_text.trim().length >= 10
        );
        const fetchedCount = intelligenceRes?.data?.summary_metrics?.total_reviews_fetched || 0;

        if (!hasIntelligence || fetchedCount === 0) {
          setLoadingState('no-data');
          return;
        }

        setIntelligence(intelligenceRes.data);
        setReviews(validReviews);
        setLoadingState('idle');
      } catch (err) {
        if (!active) return;
        console.error('Failed to load review intelligence:', err);
        setLoadingState('error');
      }
    })();

    return () => { active = false; };
  }, [selectedDestination]);

  // ── Handle language translation ───────────────────────────────────────
  const handleLanguageChange = useCallback(async (langCode: string) => {
    setSelectedLanguage(langCode);
    if (langCode === 'en' || !intelligence) return;
    if (translatedData[langCode]) return; // already cached

    const targetLang = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (!targetLang) return;

    setTranslating(true);
    try {
      const res = await api.translateIntelligence({
        target_language: targetLang.label,
        destination_name: selectedDestination?.name || '',
        data: {
          ai_summary: intelligence.ai_brief?.summary || '',
          recurring_problems: intelligence.recurring_problems || [],
          service_quality: intelligence.service_quality || [],
          emerging_attractions: intelligence.emerging_attractions || [],
        },
      });
      if (res.success && res.data) {
        setTranslatedData((prev) => ({ ...prev, [langCode]: res.data }));
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  }, [intelligence, selectedDestination, translatedData]);

  // ── Derived data ──────────────────────────────────────────────────────
  const translation = selectedLanguage !== 'en' ? translatedData[selectedLanguage] : null;

  const recurringProblems = useMemo(() => {
    if (!intelligence?.recurring_problems) return [];
    return intelligence.recurring_problems.slice(0, 5).map((p, i) => ({
      ...p,
      displayName: translation?.recurring_problems?.[i]?.name || p.name,
      displayDesc: translation?.recurring_problems?.[i]?.description || p.description,
      pct: normalizePct(p.mention_pct),
    }));
  }, [intelligence, translation]);

  const serviceQualityItems = useMemo(() => {
    if (!intelligence?.service_quality) return [];
    return intelligence.service_quality.slice(0, 6)
      .map((s, i) => ({
        ...s,
        displayCategory: translation?.service_quality?.[i]?.category || s.category,
        normalizedScore: normalizeScore(s.score),
      }))
      .filter((s) => s.normalizedScore !== null);
  }, [intelligence, translation]);

  const overallScore = intelligence?.overall_service_score ?? (serviceQualityItems.length
    ? Math.round(serviceQualityItems.reduce((a, s) => a + (s.normalizedScore || 0), 0) / serviceQualityItems.length)
    : null);

  const emergingAttractions = useMemo(() => {
    if (!intelligence?.emerging_attractions) return [];
    return intelligence.emerging_attractions.slice(0, 5).map((ea, i) => ({
      ...ea,
      displayReasons: translation?.emerging_attractions?.[i]?.reasons || ea.reasons || [],
      growthLabel: ea.growth_rate || (ea.mention_growth_pct !== null && ea.mention_growth_pct !== undefined
        ? `+${Math.round(normalizePct(ea.mention_growth_pct))}% mentions`
        : 'Emerging signal'),
    }));
  }, [intelligence, translation]);

  const aiSummary = translation?.ai_summary || intelligence?.ai_brief?.summary || '';

  // Filtered reviews (by problem category or show all)
  const filteredReviews = useMemo(() => {
    if (!activeFilter) return reviews;
    return reviews.filter((r) => {
      const text = (r.original_text + ' ' + (r.translated_text || '')).toLowerCase();
      return text.includes(activeFilter.toLowerCase());
    });
  }, [reviews, activeFilter]);

  const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);

  const reviewCount = intelligence?.summary_metrics?.total_reviews_fetched
    ?? intelligence?.destination?.total_reviews
    ?? reviews.length;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[#0B0D0D] text-[#F3EFE6] antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ═══════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════ */}
      <header className="pt-24 pb-10 px-6 sm:px-12 max-w-3xl mx-auto">
        <SectionLabel>Tourist Intelligence</SectionLabel>

        <h1
          className="text-4xl sm:text-5xl text-[#F3EFE6] leading-tight mb-4"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontWeight: 500 }}
        >
          Multilingual Review Intelligence
        </h1>

        <p className="text-[#7A7870] text-base font-light leading-relaxed mb-8 max-w-xl">
          Understand what travelers love, what frustrates them,
          and what is emerging across India.
        </p>

        {/* Destination Selector */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6A6860] mb-2">
            Destination
          </p>
          <DestinationPicker
            destinations={destinations}
            selectedDestination={selectedDestination}
            onSelect={(dest) => setSelectedDestination(dest)}
          />
        </div>
      </header>

      <Divider />

      {/* ═══════════════════════════════════════════════════════
          CONTENT — switches between states
      ═══════════════════════════════════════════════════════ */}
      <main className="px-6 sm:px-12 max-w-3xl mx-auto pb-24">

        {/* LOADING */}
        {loadingState === 'loading' && (
          <LoadingSteps destName={selectedDestination?.name || 'Loading...'} phase={loadingPhase} />
        )}

        {/* ERROR */}
        {loadingState === 'error' && (
          <div className="py-20 text-center">
            <p className="text-[#8A8880] text-sm mb-4">
              Unable to retrieve review intelligence right now.
            </p>
            <button
              onClick={retryLoad}
              className="text-xs text-[#B99550] border border-[#B99550]/30 px-4 py-2 hover:border-[#B99550] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* NO DATA */}
        {loadingState === 'no-data' && (
          <div className="py-20">
            <h2
              className="text-2xl text-[#F3EFE6] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              {selectedDestination?.name}
            </h2>
            <p className="text-[#6A6860] text-sm font-light">
              No reviews fetched yet. Retry to request live Google Maps review data.
            </p>
            {loadMessage && (
              <p className="text-[#8A8880] text-xs font-light mt-3 max-w-lg">
                {loadMessage}
              </p>
            )}
            <button
              onClick={retryLoad}
              className="mt-6 text-xs text-[#B99550] border border-[#B99550]/30 px-4 py-2 hover:border-[#B99550] transition-colors"
            >
              Retry fetching reviews
            </button>
          </div>
        )}

        {/* INTELLIGENCE — shown when loaded */}
        {loadingState === 'idle' && (intelligence || reviews.length > 0) && (
          <>
            {/* ─── DESTINATION CONTEXT ─────────────────────────── */}
            <section className="mb-12">
              <h2
                className="text-3xl sm:text-4xl text-[#F3EFE6] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                {selectedDestination?.name}
              </h2>
              <p className="text-[#6A6860] text-xs font-light tracking-wide">
                Review intelligence
                {reviewCount > 0 && (
                  <> &nbsp;·&nbsp; Based on {reviewCount} fetched tourist reviews</>
                )}
                {loadMessage && (
                  <span className="block mt-2 text-[#8A8880]">{loadMessage}</span>
                )}
              </p>
            </section>

            <Divider />

            {/* ─── RECURRING PROBLEMS ──────────────────────────── */}
            {recurringProblems.length > 0 && (
              <>
                <section className="mb-12">
                  <SectionLabel>Recurring Problems</SectionLabel>
                  <h3
                    className="text-xl text-[#F3EFE6] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                  >
                    The issues tourists mention most often.
                  </h3>

                  <div className="mt-8 space-y-5">
                    {recurringProblems.map((p, i) => (
                      <div key={p.id || i} className="group">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <div className="flex items-baseline gap-3">
                            <span className="text-[11px] font-mono text-[#4A4C4B] w-5 shrink-0">
                              0{i + 1}
                            </span>
                            <span className="text-sm text-[#D6D3CB] font-light">{p.displayName}</span>
                          </div>
                          <span className="text-xs font-mono text-[#7A7870] shrink-0 ml-4">{p.pct}%</span>
                        </div>
                        {/* Thin 1px bar */}
                        <div className="ml-8 h-[1px] w-full bg-[#1E2120]">
                          <div
                            className="h-full bg-[#7A3535]"
                            style={{ width: `${Math.min(100, Math.max(4, p.pct))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviews.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveFilter(activeFilter ? null : 'problem');
                        setShowAllReviews(true);
                        setTimeout(() => {
                          document.getElementById('tourist-voices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="mt-6 text-xs text-[#7A7870] hover:text-[#B99550] transition-colors font-light"
                    >
                      View the reviews behind these findings →
                    </button>
                  )}
                </section>

                <Divider />
              </>
            )}

            {/* ─── SERVICE QUALITY ─────────────────────────────── */}
            {serviceQualityItems.length > 0 && (
              <>
                <section className="mb-12">
                  <SectionLabel>Service Quality</SectionLabel>

                  {overallScore !== null && (
                    <div className="mb-8">
                      <p className="text-[#6A6860] text-xs font-light mb-0.5">Overall</p>
                      <p
                        className="text-5xl text-[#F3EFE6] leading-none"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                      >
                        {overallScore}
                        <span className="text-lg text-[#4A4C4B] ml-1">/ 100</span>
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {serviceQualityItems.map((s, i) => (
                      <div key={s.id || i} className="flex items-center justify-between gap-6">
                        <span className="text-sm text-[#9E9C94] font-light shrink-0 min-w-0">{s.displayCategory}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Thin score bar */}
                          <div className="w-20 h-[1px] bg-[#1E2120]">
                            <div
                              className="h-full bg-[#6A7856]"
                              style={{ width: `${s.normalizedScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-[#7A7870] w-6 text-right">{s.normalizedScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviews.length > 0 && (
                    <button
                      onClick={() => {
                        setShowAllReviews(true);
                        setTimeout(() => {
                          document.getElementById('tourist-voices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="mt-6 text-xs text-[#7A7870] hover:text-[#B99550] transition-colors font-light"
                    >
                      View supporting reviews →
                    </button>
                  )}
                </section>

                <Divider />
              </>
            )}

            {/* ─── EMERGING ATTRACTIONS ────────────────────────── */}
            {emergingAttractions.length > 0 && (
              <>
                <section className="mb-12">
                  <SectionLabel>Emerging Attractions</SectionLabel>
                  <h3
                    className="text-xl text-[#F3EFE6] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                  >
                    Places gaining attention in recent reviews.
                  </h3>

                  <div className="mt-8 space-y-4">
                    {emergingAttractions.map((ea, i) => (
                      <div key={ea.id || i} className="flex items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-[11px] font-mono text-[#4A4C4B] w-5 shrink-0">
                            0{i + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="text-sm text-[#D6D3CB] font-light">{ea.attraction_name}</span>
                            {ea.displayReasons?.[0] && (
                              <p className="text-[11px] text-[#5A5C5B] font-light mt-0.5 truncate">
                                {ea.displayReasons[0]}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[#4A7856] shrink-0">{ea.growthLabel}</span>
                      </div>
                    ))}
                  </div>

                  {reviews.length > 0 && (
                    <button
                      onClick={() => {
                        setShowAllReviews(true);
                        setTimeout(() => {
                          document.getElementById('tourist-voices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="mt-6 text-xs text-[#7A7870] hover:text-[#B99550] transition-colors font-light"
                    >
                      View mentions →
                    </button>
                  )}
                </section>

                <Divider />
              </>
            )}

            {/* ─── AI INSIGHT ──────────────────────────────────── */}
            {aiSummary && (
              <>
                <section className="mb-12">
                  <SectionLabel>AI Insight</SectionLabel>

                  {translating ? (
                    <p className="text-[#6A6860] text-sm font-light italic">Translating...</p>
                  ) : (
                    <p
                      className="text-[#C8C5BC] text-lg font-light leading-relaxed italic"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                    >
                      &ldquo;{aiSummary}&rdquo;
                    </p>
                  )}

                  {/* Language Selector */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className="text-xs text-[#6A6860] font-light">Insights in:</span>
                    <div className="relative inline-block">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        disabled={translating}
                        className="appearance-none bg-transparent border-b border-[#3A3C3B] text-xs text-[#B99550] pb-0.5 pr-4 focus:outline-none cursor-pointer hover:border-[#B99550] transition-colors disabled:opacity-40"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <option
                            key={lang.code}
                            value={lang.code}
                            className="bg-[#0B0D0D] text-[#F3EFE6]"
                          >
                            {lang.native} ({lang.label})
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-0 top-0 text-[#6A6860] pointer-events-none text-xs">▾</span>
                    </div>
                  </div>
                </section>

                <Divider />
              </>
            )}

            {/* ─── TOURIST VOICES ──────────────────────────────── */}
            {reviews.length > 0 && (
              <section id="tourist-voices" className="mb-12">
                <SectionLabel>Tourist Voices</SectionLabel>
                <h3
                  className="text-xl text-[#F3EFE6] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                >
                  What travelers actually said.
                </h3>

                {/* Active filter notice */}
                {activeFilter && (
                  <div className="mt-4 mb-6 flex items-center gap-2">
                    <span className="text-xs text-[#6A6860] font-light">
                      Filtered: showing reviews related to &ldquo;{activeFilter}&rdquo;
                    </span>
                    <button
                      onClick={() => setActiveFilter(null)}
                      className="text-xs text-[#7A3535] hover:text-[#E07070] transition-colors ml-1"
                    >
                      Clear filter
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  {visibleReviews.length === 0 ? (
                    <p className="text-[#6A6860] text-sm font-light">
                      No reviews match this filter.
                    </p>
                  ) : (
                    visibleReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        showTranslation={expandedTranslations.has(review.id)}
                        onToggleTranslation={() => {
                          setExpandedTranslations((prev) => {
                            const next = new Set(prev);
                            if (next.has(review.id)) next.delete(review.id);
                            else next.add(review.id);
                            return next;
                          });
                        }}
                      />
                    ))
                  )}
                </div>

                {!showAllReviews && filteredReviews.length > 5 && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="mt-4 text-xs text-[#7A7870] hover:text-[#B99550] transition-colors font-light"
                  >
                    View all {filteredReviews.length} reviews →
                  </button>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};
