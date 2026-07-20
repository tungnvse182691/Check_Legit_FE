import React from "react";

interface HighlightedTextProps {
  text?: string | null;
  highlight: string;
  className?: string;
  highlightClassName?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlight,
  className = "",
  highlightClassName = "font-extrabold text-black bg-yellow-200/90 rounded-xs px-0.5"
}) => {
  if (!text) return null;
  const query = highlight.trim();
  if (!query) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters in highlight query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </span>
  );
};
