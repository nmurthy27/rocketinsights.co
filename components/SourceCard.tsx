import React from 'react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'News': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Insights': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Specialized': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Global': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
          {source.name}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(source.category)} font-medium`}>
          {source.category}
        </span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">
        {source.description}
      </p>
    </a>
  );
};