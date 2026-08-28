import React, { useState } from 'react';
import { Sparkles, Compass, CalendarDays, Wallet, Users, Check, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const inputClass =
  'w-full bg-[var(--elevated)] border border-[var(--hair)] px-4 py-3 text-[13px] text-[var(--ink)] ' +
  'placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--gold)] transition-colors';

const labelClass = 'block text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)] mb-2';

export const PlannerPage: React.FC = () => {
  const [destinationId, setDestinationId] = useState('d1000000-0000-0000-0000-000000000001'); // Goa
  const [durationDays, setDurationDays] = useState(3);
  const [budgetInr, setBudgetInr] = useState(15000);
  const [interests, setInterests] = useState<string[]>(['beaches', 'food', 'culture']);
  const [crowdPreference, setCrowdPreference] = useState('avoid_crowds');
  const [sustainabilityPreference, setSustainabilityPreference] = useState('balanced');

  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any | null>(null);

  const interestOptions = [
    { id: 'beaches', label: '🏖️ Beaches & Coastal' },
    { id: 'heritage', label: '🏛️ Heritage & Architecture' },
    { id: 'food', label: '🍛 Local Food & Culinary' },
    { id: 'culture', label: '🎨 Cultural & Artisan' },
    { id: 'nature', label: '🌿 Nature & Waterfalls' },
    { id: 'nightlife', label: '✨ Nightlife & Markets' },
  ];

  const handleInterestToggle = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.generateItinerary({
        destination_id: destinationId,
        duration_days: durationDays,
        budget_inr: budgetInr,
        interests,
        crowd_preference: crowdPreference,
        sustainability_preference: sustainabilityPreference,
      });

      if (res.success && res.data) {
        setItinerary(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16 sm:py-24">
        {/* ── Header ── */}
        <div className="max-w-[700px] mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[var(--gold)]"></span>
            <span className="eyebrow">TUR01 · Explainable Travel Planner</span>
          </div>
          <h1 className="font-serif text-[clamp(34px,4.2vw,54px)] leading-[1.08] text-[var(--ink)] font-medium">
            Tell us how you travel.
            <br />
            <em className="text-[var(--gold-2)]">We'll shape the rest.</em>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--ink-2)] max-w-[500px]">
            Every recommendation is shaped by traveler review sentiment, ML crowd forecasts and
            local artisan support — with a clear reason behind each stop.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ── LEFT: PREFERENCES ── */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleGenerate}
              className="bg-[var(--card)] border border-[var(--hair)] p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[var(--hair)]">
                <Compass className="w-4 h-4 text-[var(--gold-2)]" />
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">
                  Travel Preferences
                </h2>
              </div>

              {/* Destination */}
              <div className="mb-6">
                <label className={labelClass}>Destination</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className={inputClass}
                >
                  <option value="d1000000-0000-0000-0000-000000000001">Goa (Primary Intelligence)</option>
                  <option value="d1000000-0000-0000-0000-000000000002">Mumbai</option>
                  <option value="d1000000-0000-0000-0000-000000000003">Jaipur</option>
                  <option value="d1000000-0000-0000-0000-000000000004">Kerala</option>
                  <option value="d1000000-0000-0000-0000-000000000005">Delhi</option>
                  <option value="d1000000-0000-0000-0000-000000000006">Agra</option>
                </select>
              </div>

              {/* Duration & Budget */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={labelClass}>Duration</label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className={inputClass}
                  >
                    <option value={1}>1 Day</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Budget (₹)</label>
                  <input
                    type="number"
                    value={budgetInr}
                    onChange={(e) => setBudgetInr(parseInt(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Crowd Preference */}
              <div className="mb-6">
                <label className={labelClass}>Crowd Preference</label>
                <select
                  value={crowdPreference}
                  onChange={(e) => setCrowdPreference(e.target.value)}
                  className={inputClass}
                >
                  <option value="avoid_crowds">Avoid Crowds (Schedule Off-Peak)</option>
                  <option value="popular">Popular Tourist Hotspots</option>
                  <option value="hidden_gems">Prioritize Emerging Hidden Gems</option>
                </select>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <label className={labelClass}>Interests</label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleInterestToggle(opt.id)}
                      className={`px-3 py-2.5 text-left text-[12.5px] font-medium border transition-all ${
                        interests.includes(opt.id)
                          ? 'bg-[rgba(185,149,80,0.12)] border-[rgba(185,149,80,0.5)] text-[var(--ink)]'
                          : 'bg-[var(--elevated)] border-[var(--hair)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[rgba(185,149,80,0.3)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="btn-gold w-full justify-center py-3.5"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a1305]/30 border-t-[#1a1305] rounded-full animate-spin"></div>
                    <span>Shaping your journey...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create My Journey</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── RIGHT: ITINERARY ── */}
          <div className="lg:col-span-8">
            {itinerary ? (
              <div className="space-y-6">
                {/* Summary Banner */}
                <div className="bg-[var(--card)] border border-[rgba(185,149,80,0.3)] p-7">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[var(--hair)]">
                    <div>
                      <h3 className="font-serif text-2xl text-[var(--ink)]">
                        {itinerary.duration_days}-Day Journey · {itinerary.destination}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-[#93A97C] font-semibold">
                        Estimated Cost ₹{itinerary.estimated_cost_inr.toLocaleString()} — within your ₹
                        {itinerary.budget_inr.toLocaleString()} budget
                      </p>
                    </div>
                    <div className="px-4 py-2 border border-[rgba(147,169,124,0.3)] bg-[rgba(147,169,124,0.08)] text-[12px] font-semibold text-[#93A97C] whitespace-nowrap">
                      Sustainability · {itinerary.sustainability_score}/100
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-2)] italic font-serif text-[15px]">
                    {itinerary.explanation_summary}
                  </p>
                </div>

                {/* Day-by-Day Timeline */}
                {itinerary.days.map((day: any) => (
                  <div key={day.day_number} className="bg-[var(--card)] border border-[var(--hair)] p-7">
                    <div className="flex items-center gap-4 pb-5 border-b border-[var(--hair)] mb-6">
                      <span className="w-9 h-9 rounded-full border border-[rgba(185,149,80,0.5)] text-[var(--gold-2)] font-serif text-[15px] flex items-center justify-center">
                        {day.day_number}
                      </span>
                      <h4 className="font-serif text-xl text-[var(--ink)]">{day.title}</h4>
                    </div>

                    <div className="space-y-6">
                      {day.items.map((item: any, idx: number) => (
                        <div key={idx} className="relative pl-7 border-l border-[var(--hair)] space-y-3">
                          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--bg)] border-2 border-[var(--gold)]"></div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--gold-2)] font-semibold">
                                {item.time_slot}
                              </span>
                              <span className="text-[14.5px] font-semibold text-[var(--ink)]">{item.title}</span>
                              <span className="text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 bg-[var(--elevated)] text-[var(--ink-2)] border border-[var(--hair)]">
                                {item.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-semibold text-[var(--gold-2)]">{item.rating} ★</span>
                              <span className="text-[10px] px-2 py-0.5 border border-[rgba(147,169,124,0.25)] bg-[rgba(147,169,124,0.08)] text-[#93A97C] font-semibold">
                                {item.sentiment_pct}% Pos
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-[var(--elevated)] text-[var(--ink-2)] font-semibold">
                                {item.predicted_crowd} CROWD
                              </span>
                            </div>
                          </div>

                          <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{item.description}</p>

                          {/* Explainability Reason Callout */}
                          <div className="p-4 bg-[var(--elevated)] border border-[var(--hair)]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--gold-2)] mb-2">
                              Why Michira Recommended This
                            </p>
                            <ul className="space-y-1.5">
                              {item.reasons.map((r: string, rIdx: number) => (
                                <li key={rIdx} className="flex items-start gap-2 text-[12px] text-[var(--ink-2)]">
                                  <span className="text-[#93A97C] font-bold mt-px">✓</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-h-[540px] bg-[var(--card)] border border-[var(--hair)] flex flex-col items-center justify-center text-center px-10">
                <div className="w-14 h-14 rounded-full border border-[rgba(185,149,80,0.5)] flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6 text-[var(--gold-2)]" />
                </div>
                <h3 className="font-serif text-2xl text-[var(--ink)]">Your tailored journey awaits</h3>
                <p className="mt-3 text-[13px] text-[var(--ink-3)] max-w-[380px] leading-relaxed">
                  Choose your destination, duration, budget and interests on the left — then let
                  MICHIRA shape an explainable, data-backed travel plan.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--gold-2)]">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Day-by-day · Data-backed · Deliberate</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
