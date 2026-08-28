import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-[#353A39] text-[#A7AAA5] text-xs">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          {/* Brand Name - NO LOGO */}
          <div className="font-extrabold text-lg text-[#F1F0EB] font-mono tracking-wider">
            MICHIRA
          </div>
          <p className="text-xs text-[#747875] leading-relaxed">
            AI-Perfected Journey Intelligence. Analyzing terrain, elevation, and real-time conditions to craft seamless adventures from start to summit.
          </p>
        </div>

        <div>
          <h4 className="text-[#F1F0EB] font-bold text-xs uppercase tracking-wider mb-3">Capabilities</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#78806C]"></span> AI Smart Route & Trek Planning</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span> Real-time Weather & Risk Alerts</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#A7AAA5]"></span> Multilingual Review Intelligence</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#78806C]"></span> Crowd Radar & Elevation Analysis</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#F1F0EB] font-bold text-xs uppercase tracking-wider mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link to="/explore" className="hover:text-[#F1F0EB] transition-colors">Trekking Map & Destinations</Link></li>
            <li><Link to="/planner" className="hover:text-[#F1F0EB] transition-colors">AI Itinerary & Route Planner</Link></li>
            <li><Link to="/reviews" className="hover:text-[#F1F0EB] transition-colors">Multilingual Guides & Reviews</Link></li>
            <li><Link to="/admin" className="hover:text-[#F1F0EB] transition-colors">Authority Analytics</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[#F1F0EB] font-bold text-xs uppercase tracking-wider mb-3">Verified Intelligence</h4>
          <div className="p-3.5 rounded-2xl bg-[#202323] border border-[#353A39] text-xs text-[#A7AAA5] space-y-1">
            <div className="font-bold text-[#F1F0EB]">
              Explainable AI Engine
            </div>
            <p className="text-[11px] leading-relaxed text-[#747875]">Zero black-box recommendations. Every path has transparent elevation, risk, and weather backing.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[#353A39] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#747875] gap-2">
        <p>© 2026 MICHIRA — AI Journey & Tourism Intelligence</p>
        <div className="flex items-center gap-2">
          <span>All systems operational • Real-time AI connected</span>
        </div>
      </div>
    </footer>
  );
};

