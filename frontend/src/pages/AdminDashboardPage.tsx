import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Sparkles, Flame, Bell, Globe, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminOverview().then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading tourism authority analytics...</div>;
  }

  if (!data) {
    return <div className="py-20 text-center text-white text-sm">Failed to load analytics dashboard.</div>;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/50 text-xs font-semibold text-indigo-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tourism Authority & Business Intelligence Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tourism Authority Analytics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Total Analyzed:</span>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            {data.totalReviews.toLocaleString()} Reviews
          </span>
        </div>
      </div>

      {/* "WHAT CHANGED THIS MONTH?" AI SUMMARY BANNER */}
      <div className="mb-10 p-6 rounded-2xl glass-card border border-yatra-500/30 bg-gradient-to-r from-yatra-950/40 via-slate-900 to-yatra-950/40">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-saffron-400" />
          "What Changed?" — High Priority Intelligence Alerts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.whatChanged?.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
                item.type === 'warning'
                  ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                  : item.type === 'emerging'
                  ? 'bg-saffron-950/20 border-saffron-800/40 text-saffron-200'
                  : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
              }`}
            >
              <div className="mt-0.5">
                {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                {item.type === 'emerging' && <Flame className="w-4 h-4 text-saffron-400" />}
                {item.type === 'positive' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <p className="font-semibold text-white">{item.text}</p>
                <span className="text-[10px] opacity-75 font-bold mt-1 inline-block">Shift: {item.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: TOP RECURRING PROBLEMS & ALERTS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Problems */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-base font-bold text-white mb-4">Top Recurring Tourist Problems</h3>
            <div className="space-y-3">
              {data.topProblems?.map((prob: any) => (
                <div key={prob.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{prob.category}</span>
                    <p className="text-sm font-bold text-white mt-0.5">{prob.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">{prob.mention_count} mentions</span>
                    <p className="text-[10px] text-rose-400 font-bold">↑ +{prob.trend_pct}% trend</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Alerts Feed */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-saffron-400" />
              Automated Anomaly & Trend Alerts
            </h3>
            <div className="space-y-3">
              {data.alerts?.map((al: any) => (
                <div key={al.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{al.title}</span>
                    <span className="text-[10px] text-slate-500">{new Date(al.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{al.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EMERGING ATTRACTIONS & LANGUAGE BREAKDOWN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emerging Leaderboard */}
          <div className="p-6 rounded-2xl glass-card border border-saffron-500/30">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-saffron-400" />
              Emerging Attractions Leaderboard
            </h3>
            <div className="space-y-3">
              {data.emergingAttractions?.map((em: any) => (
                <div key={em.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{em.attraction_name}</p>
                    <p className="text-[10px] text-slate-400">{em.destination_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-saffron-400">+{em.mention_growth_pct}% Mentions</span>
                    <p className="text-[10px] text-emerald-400 font-bold">{em.positive_sentiment_pct}% Pos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multilingual Review Breakdown */}
          <div className="p-6 rounded-2xl glass-card">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-yatra-400" />
              Multilingual Review Distribution
            </h3>
            <div className="space-y-3">
              {data.languageDistribution?.map((lang: any) => (
                <div key={lang.detected_language} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span className="uppercase">{lang.detected_language === 'en' ? 'English' : lang.detected_language === 'hi' ? 'Hindi (हिन्दी)' : lang.detected_language === 'mr' ? 'Marathi (मराठी)' : lang.detected_language === 'ta' ? 'Tamil (தமிழ்)' : lang.detected_language === 'te' ? 'Telugu (తెలుగు)' : lang.detected_language}</span>
                    <span>{lang.pct}% ({lang.count} reviews)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${lang.pct}%` }} className="bg-yatra-500 h-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
