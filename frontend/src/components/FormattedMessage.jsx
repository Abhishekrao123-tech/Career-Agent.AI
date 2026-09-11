import React from 'react';

export const FormattedMessage = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  const parseInline = (str) => {
    if (!str) return '';
    const parts = [];
    // Match **bold**, `code`, *italic*
    const regex = /(\*\*(.*?)\*\*|`([^`]+)`|\*(.*?)\*)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      if (match[2] !== undefined) {
        // **bold** -> clean styled bold text
        parts.push(
          <strong key={match.index} className="font-bold text-cyan-300">
            {match[2]}
          </strong>
        );
      } else if (match[3] !== undefined) {
        // `code` -> clean styled inline code
        parts.push(
          <code key={match.index} className="bg-gray-800 text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-gray-700">
            {match[3]}
          </code>
        );
      } else if (match[4] !== undefined) {
        // *italic*
        parts.push(
          <em key={match.index} className="italic text-gray-300">
            {match[4]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Horizontal rule ---
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="border-gray-800 my-2" />;
        }

        // Headers ###
        if (trimmed.startsWith('###')) {
          return (
            <h3 key={idx} className="font-bold text-indigo-300 text-xs mt-2 mb-1">
              {parseInline(trimmed.replace(/^###\s*/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('##')) {
          return (
            <h2 key={idx} className="font-bold text-cyan-300 text-xs mt-2 mb-1">
              {parseInline(trimmed.replace(/^##\s*/, ''))}
            </h2>
          );
        }
        if (trimmed.startsWith('#')) {
          return (
            <h1 key={idx} className="font-bold text-cyan-400 text-xs mt-2 mb-1">
              {parseInline(trimmed.replace(/^#\s*/, ''))}
            </h1>
          );
        }

        // Bullet points (- or * or •)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const itemText = trimmed.replace(/^[-*•]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-1">
              <span className="text-cyan-400 font-bold shrink-0">•</span>
              <span className="text-gray-200 flex-1">{parseInline(itemText)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-1">
              <span className="text-cyan-400 font-bold shrink-0">{numMatch[1]}.</span>
              <span className="text-gray-200 flex-1">{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        // Table line | ... |
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (trimmed.includes('---')) return null; // table divider line
          const cells = trimmed.split('|').filter((c) => c.trim().length > 0);
          return (
            <div key={idx} className="flex gap-2 bg-dark-bg/60 p-1.5 rounded-lg border border-gray-800 my-1 text-[11px]">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="flex-1 text-gray-300">
                  {parseInline(cell.trim())}
                </div>
              ))}
            </div>
          );
        }

        return <p key={idx}>{parseInline(trimmed)}</p>;
      })}
    </div>
  );
};
