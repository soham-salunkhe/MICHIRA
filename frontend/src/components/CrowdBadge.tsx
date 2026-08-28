import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';

interface CrowdBadgeProps {
  level: 'low' | 'medium' | 'high' | 'very_high' | string;
  confidence?: number;
  showIcon?: boolean;
}

export const CrowdBadge: React.FC<CrowdBadgeProps> = ({ level, confidence, showIcon = true }) => {
  const norm = level?.toLowerCase();

  switch (norm) {
    case 'low':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Low Crowd</span>
          {confidence && <span className="text-[10px] opacity-75 font-normal">{Math.round(confidence * 100)}% conf</span>}
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Moderate Crowd</span>
          {confidence && <span className="text-[10px] opacity-75 font-normal">{Math.round(confidence * 100)}% conf</span>}
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">
          <span className="w-2 h-2 rounded-full bg-orange-400"></span>
          <span>High Crowd</span>
          {confidence && <span className="text-[10px] opacity-75 font-normal">{Math.round(confidence * 100)}% conf</span>}
        </span>
      );
    case 'very_high':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Very High Crowd</span>
          {confidence && <span className="text-[10px] opacity-75 font-normal">{Math.round(confidence * 100)}% conf</span>}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
          {showIcon && <Users className="w-3 h-3" />}
          <span>{level}</span>
        </span>
      );
  }
};
