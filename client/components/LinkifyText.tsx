// components/LinkifyText.tsx
'use client';

import React from 'react';

const LinkifyText = ({ text }: { text: string }) => {
  // Combined regex for URLs and hashtags
  const combinedRegex = /(https?:\/\/[^\s]+)|(#\w+)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Check if it's a URL or hashtag
    if (match[1]) { // URL
      parts.push(
        <a
          key={lastIndex}
          href={match[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {match[1]}
        </a>
      );
    } else if (match[2]) { // Hashtag
      parts.push(
        <span key={lastIndex} className="text-blue-600">
          {match[2]}
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

export default LinkifyText;