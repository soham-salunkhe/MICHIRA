import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, ThumbsUp, AlertTriangle, TrendingUp, Sparkles, MapPin, Calendar,
  Shield, CheckCircle, Clock, ArrowRight, MessageSquareText, Layers, Flame,
  Users, ChevronRight, BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar
} from 'recharts';
import { api, Destination, Attraction, ProblemCluster, ServiceQuality, EmergingAttraction, LocalExperience } from '../services/api';
import { SentimentBadge } from '../components/SentimentBadge';
import { CrowdBadge } from '../components/CrowdBadge';
import { MapView } from '../components/MapView';

export const DestinationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{
    destination: Destination;
    attractions: Attraction[];
    problems: ProblemCluster[];
    serviceQuality: ServiceQuality[];
    emergingAttractions: EmergingAttraction[];
    sustainability: any;
    sentimentTimeline: any[];
    experiences: LocalExperience[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [crowdForecast, setCrowdForecast] = useState<any | null>(null);
  const [crowdLoading, setCrowdLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'service' | 'emerging' | 'crowd' | 'experiences' | 'map'>('overview');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getDestinationDetails(slug).then(res => {
      setData(res);
      if (res.attractions && res.attractions.length > 0) {
        setSelectedAttraction(res.attractions[0]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (selectedAttraction) {
      setCrowdLoading(true);
      api.getCrowdForecast(selectedAttraction.id).then(res => {
        setCrowdForecast(res.data);
        setCrowdLoading(false);
      }).catch(() => setCrowdLoading(false));
    }
  }, [selectedAttraction]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-yatra-500/20 border-t-yatra-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-medium">Aggregating {slug?.toUpperCase()} tourist intelligence...</p>
      </div>
    );
  }

  if (!data || !data.destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Destination not found</h2>
        <Link to="/explore" className="mt-4 inline-block text-yatra-400 hover:underline text-sm">
          Return to Destination Explorer
        </Link>
      </div>
    );
  }

  const { destination, attractions, problems, serviceQuality, emergingAttractions, sustainability, sentimentTimeline, experiences } = data;

  // Format Radar data for service quality
  const radarData = serviceQuality.map(sq => ({
    category: sq.category.replace('_', ' ').toUpperCase(),
    score: parseFloat(sq.score as any),
    fullMark: 5
  }));

  // Timeline chart data
  const timelineChartData = sentimentTimeline.map(t => ({
    month: new Date(t.period).toLocaleDateString('en-US', { month: 'short' }),
    Positive: t.positive_count,
    Neutral: t.neutral_count,
    Negative: t.negative_count,
    Rating: parseFloat(t.avg_rating)
  }));

  return (
    <div className="min-h-screen pb-20">
      {/* Destination Hero Header */}
      <section className="relative py-12 border-b border-slate-800 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-yatra-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{destination.state}, {destination.country}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {destination.name}
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yatra-900/90 text-yatra-300 border border-yatra-600/40">
                  {destination.total_reviews.toLocaleString()} Reviews Analyzed
                </span>
              </h1>
              <p className="mt-3 text-slate-300 text-sm max-w-3xl leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Destination Intelligence Composite Score Card */}
            <div className="p-5 rounded-2xl glass-panel border border-yatra-500/30 flex items-center gap-5 min-w-[280px]">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-yatra-500/30 flex flex-col items-center justify-center bg-slate-900">
                  <span className="text-2xl font-black text-white">{destination.intelligence_score}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Destination Intelligence</p>
                <div className="mt-1.5 space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Satisfaction:</span>
                    <span className="font-semibold text-emerald-400">{destination.positive_pct}% Pos</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Avg Rating:</span>
                    <span className="font-semibold text-amber-400">{destination.avg_rating}★</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Sustainability:</span>
                    <span className="font-semibold text-yatra-300">{sustainability?.overall_score || 72}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar border-b border-slate-800 pb-px">
            {[
              { id: 'overview', label: 'Overview & Sentiment' },
              { id: 'problems', label: `Recurring Problems (${problems.length})` },
              { id: 'service', label: 'Service Quality' },
              { id: 'emerging', label: `Emerging Gems (${emergingAttractions.length})` },
              { id: 'crowd', label: 'Crowd Intelligence (TUR04)' },
              { id: 'experiences', label: 'Local Artisans (TUR05)' },
              { id: 'map', label: 'Interactive Map' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-yatra-400 text-white bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: OVERVIEW & SENTIMENT */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl glass-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-slate-400">Sentiment Distribution</span>
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">{destination.positive_pct}%</span>
                  <span className="text-xs text-slate-400 font-medium">Positive</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3 flex">
                  <div style={{ width: `${destination.positive_pct}%` }} className="bg-emerald-400" />
                  <div style={{ width: `${destination.neutral_pct}%` }} className="bg-slate-400" />
                  <div style={{ width: `${destination.negative_pct}%` }} className="bg-rose-400" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                  <span>Pos: {destination.positive_pct}%</span>
                  <span>Neu: {destination.neutral_pct}%</span>
                  <span>Neg: {destination.negative_pct}%</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-slate-400">Top Problem Alert</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-4">
                  <p className="text-lg font-bold text-white">{problems[0]?.name || 'No sufficient data'}</p>
                  <p className="text-xs text-rose-400 font-semibold mt-1">
                    {problems[0]?.mention_count != null ? (problems[0].mention_count + ' mentions') : 'Insufficient data'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">
                    "{problems[0]?.representative_reviews[0]}"
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-slate-400">Top Emerging Gem</span>
                  <Flame className="w-4 h-4 text-saffron-400" />
                </div>
                <div className="mt-4">
                  <p className="text-lg font-bold text-white">{emergingAttractions[0]?.attraction_name || 'No sufficient data'}</p>
                  <p className="text-xs text-saffron-400 font-semibold mt-1">
                    {emergingAttractions[0]?.mention_growth_pct != null ? ('+' + emergingAttractions[0].mention_growth_pct + '% mention velocity') : 'Emerging signal'}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-2">
                    {emergingAttractions[0]?.positive_sentiment_pct != null ? (emergingAttractions[0].positive_sentiment_pct + '% positive mentions') : 'Insufficient data'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sentiment Timeline Analysis Chart */}
            <div className="p-6 rounded-2xl glass-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-yatra-400" />
                    Tourist Satisfaction & Review Volume Timeline
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Monthly trend of positive, neutral, and negative tourist reviews</p>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineChartData}>
                    <defs>
                      <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="Positive" stroke="#10b981" fillOpacity={1} fill="url(#posGrad)" />
                    <Area type="monotone" dataKey="Negative" stroke="#f43f5e" fillOpacity={1} fill="url(#negGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECURRING PROBLEMS */}
        {activeTab === 'problems' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">TUR09: Recurring Tourist Complaints & Problems</h3>
                <p className="text-xs text-slate-400 mt-1">Grouped via semantic clustering from {destination.total_reviews.toLocaleString()} raw reviews</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problems.map((prob) => (
                <div key={prob.id} className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {prob.category}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1.5">{prob.name}</h4>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase ${
                        prob.severity === 'critical' || prob.severity === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {prob.severity} Severity
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Total Mentions: </span>
                        <span className="font-bold text-white">{prob.mention_count}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Trend: </span>
                        <span className="font-bold text-rose-400">↑ {prob.trend_pct}% this month</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <p className="text-xs font-semibold text-slate-300 mb-2">Representative Review Quotes:</p>
                      <div className="space-y-2">
                        {prob.representative_reviews.slice(0, 3).map((snippet, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 text-xs text-slate-300 italic border border-slate-800">
                            "{snippet}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE QUALITY */}
        {activeTab === 'service' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white">TUR09: Multi-Dimensional Service Quality Analysis</h3>
              <p className="text-xs text-slate-400 mt-1">Aspect-based scores calculated across food, transport, staff, cleanliness, and accommodation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Radar Chart */}
              <div className="p-6 rounded-2xl glass-card h-[380px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#475569" fontSize={10} />
                    <Radar name="Service Score" dataKey="score" stroke="#486ff5" fill="#486ff5" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Service Cards Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceQuality.map((sq) => (
                  <div key={sq.id} className="p-4 rounded-xl glass-card">
                    <div className="flex justify-between items-start">
                      <span className="text-xs uppercase font-bold text-slate-400">{sq.category.replace('_', ' ')}</span>
                      <span className="text-base font-extrabold text-white">{sq.score} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                      <div style={{ width: `${(sq.score / 5) * 100}%` }} className="bg-yatra-400 h-full" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <span>{sq.review_count} mentions</span>
                      <span className={sq.trend_pct >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {sq.trend_pct >= 0 ? `↑ +${sq.trend_pct}%` : `↓ ${sq.trend_pct}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EMERGING ATTRACTIONS */}
        {activeTab === 'emerging' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-saffron-400" />
                TUR09: Emerging Hidden Gem Attractions
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Discovered via review growth velocity (+50% min), recency weighting, and 85%+ positive sentiment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergingAttractions.map((att) => (
                <div key={att.id} className="p-6 rounded-2xl glass-card border border-saffron-500/30 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                        Emergence Score: {att.emergence_score}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {att.positive_sentiment_pct}% Positive
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white">{att.attraction_name}</h4>
                    <div className="mt-2 flex items-center gap-2 text-xs text-saffron-400 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{att.mention_growth_pct}% recent mention surge</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <p className="text-xs font-semibold text-slate-300 mb-2">Why travelers love it:</p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {att.reasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{att.current_period_mentions} mentions this month</span>
                    <button
                      onClick={() => {
                        const matched = attractions.find(a => a.name === att.attraction_name);
                        if (matched) {
                          setSelectedAttraction(matched);
                          setActiveTab('crowd');
                        }
                      }}
                      className="text-saffron-400 font-bold hover:text-saffron-300 flex items-center gap-1"
                    >
                      Check Crowd <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CROWD INTELLIGENCE (TUR04) */}
        {activeTab === 'crowd' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  TUR04: ML Crowd Forecasting & Best Visiting Hours
                </h3>
                <p className="text-xs text-slate-400 mt-1">Supervised ML predicting hourly footfall, avoid peak lines & high heat</p>
              </div>

              {/* Attraction selector dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Select Attraction:</span>
                <select
                  value={selectedAttraction?.id}
                  onChange={(e) => {
                    const found = attractions.find(a => a.id === e.target.value);
                    if (found) setSelectedAttraction(found);
                  }}
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-yatra-500"
                >
                  {attractions.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.is_emerging ? '🔥 Emerging' : a.type})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedAttraction && crowdForecast && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hourly Forecast Chart */}
                <div className="lg:col-span-2 p-6 rounded-2xl glass-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-white text-base">{selectedAttraction.name} Hourly Density</h4>
                    <CrowdBadge level={crowdForecast.current_predicted_level} />
                  </div>

                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={crowdForecast.forecast}>
                        <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                        <Bar dataKey="count" fill="#486ff5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Hourly badge list */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-800">
                    {crowdForecast.forecast.map((f: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/90 text-center border border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold">{f.time}</p>
                        <p className={`text-xs font-extrabold uppercase mt-0.5 ${
                          f.level === 'low' ? 'text-emerald-400' : f.level === 'medium' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {f.level}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation & Alternatives Callout */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                      Best Visiting Time
                    </span>
                    <h4 className="text-xl font-bold text-white mt-2">{crowdForecast.best_time_window}</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {crowdForecast.best_time_reason}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl glass-card">
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Less-Crowded Nearby Alternatives</h5>
                    <div className="space-y-3">
                      {crowdForecast.alternatives?.slice(0, 2).map((alt: any) => (
                        <div key={alt.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{alt.name}</p>
                            <p className="text-[10px] text-slate-400">{alt.avg_rating}★ • {alt.positive_pct}% Pos</p>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10">
                            Low Crowd
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LOCAL EXPERIENCES (TUR05) */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-saffron-400" />
                TUR05: Local Artisan & Cultural Experience Discovery
              </h3>
              <p className="text-xs text-slate-400 mt-1">Verified native experiences directly supporting local artisans and culinary traditions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-6 rounded-2xl glass-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {exp.category}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {exp.avg_rating}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white">{exp.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {exp.location}
                    </p>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">{exp.price_range} • {exp.review_count} reviews</span>
                    <span className="text-emerald-400 font-bold">{exp.positive_sentiment_pct}% Pos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: INTERACTIVE MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-yatra-400" />
                Interactive Tourism Intelligence Map
              </h3>
              <p className="text-xs text-slate-400 mt-1">All {attractions.length} indexed attractions with live crowd and emergence indicators</p>
            </div>

            <div className="h-[550px] w-full">
              <MapView
                attractions={attractions}
                center={[destination.latitude, destination.longitude]}
                zoom={11}
                selectedAttractionId={selectedAttraction?.id}
                onSelectAttraction={(att) => setSelectedAttraction(att)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
