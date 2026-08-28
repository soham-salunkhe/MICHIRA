import React from 'react';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'neutral' | 'negative' | string;
  score?: number;
  confidence?: number;
  showIcon?: boolean;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment, score, confidence, showIcon = true }) => {
  const norm = sentiment?.toLowerCase();

  if (norm === 'positive') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {showIcon && <ThumbsUp className="w-3 h-3" />}
        <span>Positive</span>
        {score !== undefined && <span className="text-[10px] text-emerald-300 opacity-80">({(score > 0 ? '+' : '') + score.toFixed(2)})</span>}
      </span>
    );
  }

  if (norm === 'negative') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        {showIcon && <ThumbsDown className="w-3 h-3" />}
        <span>Negative</span>
        {score !== undefined && <span className="text-[10px] text-rose-300 opacity-80">({score.toFixed(2)})</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
      {showIcon && <Minus className="w-3 h-3" />}
      <span>Neutral</span>
    </span>
  );
};
