import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ThumbsUp, ThumbsDown, Filter, Send, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { SentimentBadge } from '../components/SentimentBadge';

export const ReviewIntelligencePage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [rating, setRating] = useState(4.0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Preset demo test reviews in multiple languages
  const samplePrompts = [
    {
      lang: 'Marathi',
      text: 'इथे खूप गर्दी आहे आणि पार्किंग ची अजिबात सोय नाही. पण समुद्र सुंदर आहे.',
      rating: 2.5
    },
    {
      lang: 'Hindi',
      text: 'बागा बीच बहुत सुंदर है और यहाँ का सीफूड खाना बहुत ही लाजवाब है!',
      rating: 5.0
    },
    {
      lang: 'English',
      text: 'Finding parking was impossible at Calangute Beach and hawkers were extremely aggressive.',
      rating: 2.0
    },
    {
      lang: 'Tamil',
      text: 'பாகா கடற்கரை மிகவும் அழகாக உள்ளது. உணவு சுவையாக இருந்தது ஆனால் கூட்டம் அதிகம்.',
      rating: 4.0
    }
  ];

  const fetchRecentReviews = () => {
    setLoadingReviews(true);
    api.getReviews({
      language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
      sentiment: selectedSentiment !== 'all' ? selectedSentiment : undefined,
      limit: 25
    }).then(res => {
      setReviews(res.data || []);
      setLoadingReviews(false);
    }).catch(() => setLoadingReviews(false));
  };

  useEffect(() => {
    fetchRecentReviews();
  }, [selectedLanguage, selectedSentiment]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setAnalyzing(true);
    try {
      const res = await api.analyzeReview({
        text: inputText,
        rating: rating,
        destination_id: 'd1000000-0000-0000-0000-000000000001', // Goa default
        reviewer_name: 'Live Hackathon Judge'
      });

      if (res.success && res.data) {
        setAnalysisResult(res.data.analysis);
        fetchRecentReviews(); // Refresh review list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yatra-900/80 border border-yatra-700/50 text-xs font-semibold text-yatra-300 mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>TUR09 Core Intelligence Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multilingual Review Intelligence & Aspect Extraction
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl">
          Ingests tourist reviews across Indian languages (English, Hindi, Marathi, Tamil, Telugu), performs sentiment analysis, extracts 12 aspect dimensions, and clusters recurring complaints in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: LIVE REVIEW INGESTION & NLP TESTER (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-yatra-500/30">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-yatra-400" />
              Live NLP Pipeline Ingestion
            </h2>

            {/* Quick Sample Prompts */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 mb-2">Try Sample Reviews:</p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(s.text);
                      setRating(s.rating);
                    }}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-yatra-500 transition-colors"
                  >
                    {s.lang}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tourist Review Text (Any Indian language)
                </label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type a tourist review in English, हिन्दी, मराठी, தமிழ், or తెలుగు..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yatra-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  User Rating: {rating} ★
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full accent-yatra-500"
                />
              </div>

              <button
                type="submit"
                disabled={analyzing || !inputText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yatra-600 to-indigo-600 hover:from-yatra-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-yatra-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing NLP Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Run TUR09 Intelligence Pipeline</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* LIVE ANALYSIS OUTPUT BREAKDOWN */}
          {analysisResult && (
            <div className="p-6 rounded-2xl glass-card border border-emerald-500/40 bg-emerald-950/10 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  NLP Pipeline Result
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-yatra-900/90 text-yatra-300 border border-yatra-600/40">
                    Lang: {analysisResult.detected_language.toUpperCase()} ({Math.round(analysisResult.language_confidence * 100)}%)
                  </span>
                  <SentimentBadge sentiment={analysisResult.sentiment} score={analysisResult.sentiment_score} />
                </div>
              </div>

              {/* Aspects Extracted */}
              <div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Aspect-Based Sentiment (ABSA):</p>
                {analysisResult.aspects && analysisResult.aspects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.aspects.map((asp: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                        <span className="font-semibold text-white capitalize">{asp.aspect}</span>
                        <SentimentBadge sentiment={asp.sentiment} showIcon={false} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific aspect keyword triggers</p>
                )}
              </div>

              {/* Detected Problems */}
              {analysisResult.detected_problems && analysisResult.detected_problems.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Clustered Problem:</p>
                  {analysisResult.detected_problems.map((p: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300 flex items-center justify-between">
                      <span className="font-bold">{p.problem_name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-900/60">{p.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REVIEWS FEED WITH MULTILINGUAL FILTER (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Indexed Tourist Reviews Feed</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real reviews processed with language detection & sentiment tags</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">All Languages</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>

                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">All Sentiment</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>

            {/* Review Cards List */}
            {loadingReviews ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No reviews found matching the filters.</div>
            ) : (
              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{r.reviewer_name || 'Traveler'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {r.attraction_name ? `• ${r.attraction_name}` : `• ${r.destination_name || 'General'}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {r.detected_language}
                        </span>
                        <SentimentBadge sentiment={r.sentiment} score={parseFloat(r.sentiment_score)} />
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {r.original_text}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                      <span>Rating: {r.rating}★</span>
                      <span>{new Date(r.review_date || r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
