import React from 'react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'News': return { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'Insights': return { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'Specialized': return { border: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' };
      case 'Global': return { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' };
      default: return { border: 'border-l-slate-400', bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  const styles = getCategoryStyles(source.category);

  return (
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`
        block p-5 bg-white rounded-2xl border border-slate-100 shadow-sm 
        hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 
        transition-all duration-300 group border-l-4 ${styles.border}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1">
          {source.name}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${styles.bg} ${styles.text}`}>
          {source.category}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
        {source.description}
      </p>
    </a>
  );
};