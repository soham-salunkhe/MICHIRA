import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, ThumbsUp, ArrowRight, Filter } from 'lucide-react';
import { api, Destination } from '../services/api';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState(queryParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getDestinations(queryParam).then(res => {
      setDestinations(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Indian Tourism Destinations
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl">
          Search indexed destinations and dive into real tourist review analytics, crowd models, and emerging hidden gems.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, state, or keywords..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yatra-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-yatra-600 hover:bg-yatra-500 text-white text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading destinations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <Link
              key={d.id}
              to={`/destination/${d.slug}`}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{d.name}</h3>
                    <p className="text-xs text-slate-400">{d.state}, India</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400">{d.positive_pct}% Pos</span>
                    <p className="text-[10px] text-slate-500">Score: {d.intelligence_score}/100</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {d.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {d.avg_rating}★ <span className="text-slate-500 font-normal">({d.total_reviews} reviews)</span>
                </div>
                <span className="text-yatra-400 font-semibold flex items-center gap-1">
                  View Intelligence <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
