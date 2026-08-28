import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Star, Heart, Filter, ShieldCheck } from 'lucide-react';
import { api, LocalExperience } from '../services/api';

export const ExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<LocalExperience[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getExperiences(undefined, selectedCategory !== 'all' ? selectedCategory : undefined).then(res => {
      setExperiences(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'food', label: '🍛 Local Food & Culinary' },
    { id: 'crafts', label: '🏺 Pottery & Crafts' },
    { id: 'cultural', label: '🎭 Cultural Heritage Walks' },
    { id: 'experience', label: '🌿 Eco & Wellness' }
  ];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yatra-900/80 border border-yatra-700/50 text-xs font-semibold text-yatra-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TUR05 Native Artisan & Experience Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Local Experiences & Artisan Workshops
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-3xl">
          Discover verified community-led activities, traditional handicraft workshops, and culinary heritage spots with positive traveler ratings.
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-yatra-600 text-white shadow-md shadow-yatra-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading local experiences...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {exp.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {exp.avg_rating}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{exp.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {exp.location}
                </p>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{exp.price_range} • {exp.review_count} reviews</span>
                <span className="text-emerald-400 font-bold">{exp.positive_sentiment_pct}% Positive</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
