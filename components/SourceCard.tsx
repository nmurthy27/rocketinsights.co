import React from 'react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'News': return { border: 'border-l-slate-600', bg: 'bg-slate-100', text: 'text-slate-700' };
      case 'Insights': return { border: 'border-l-slate-500', bg: 'bg-slate-100', text: 'text-slate-700' };
      case 'Specialized': return { border: 'border-l-slate-400', bg: 'bg-slate-100', text: 'text-slate-700' };
      case 'Global': return { border: 'border-l-slate-800', bg: 'bg-slate-100', text: 'text-slate-700' };
      default: return { border: 'border-l-slate-300', bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  const styles = getCategoryStyles(source.category);

  return (
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`
        block p-5 bg-white rounded-xl border border-slate-200 shadow-sm 
        hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 
        transition-all duration-200 group border-l-[3px] ${styles.border}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-sm line-clamp-1">
          {source.name}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide ${styles.bg} ${styles.text}`}>
          {source.category}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
        {source.description}
      </p>
    </a>
  );
};