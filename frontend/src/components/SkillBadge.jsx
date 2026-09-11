import React from 'react';

export const SkillBadge = ({ name, type = 'default', priority = null, onClick }) => {
  const styles = {
    known: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    partiallyKnown: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    missing: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    highPriority: 'bg-purple-500/15 border-purple-500/40 text-purple-300 font-bold',
    lowPriority: 'bg-gray-800/80 border-gray-700 text-gray-400',
    default: 'bg-brand-500/10 border-brand-500/30 text-brand-accent'
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs border transition-all ${
        styles[type] || styles.default
      } ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      {priority && (
        <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center justify-center">
          {priority}
        </span>
      )}
      <span>{name}</span>
    </span>
  );
};
