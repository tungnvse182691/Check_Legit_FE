import React from "react";

/**
 * Loại bỏ toàn bộ dấu tiếng Việt (bao gồm cả 'đ'/'Đ') để phục vụ so sánh không dấu.
 */
export const removeVietnameseTones = (str: string | undefined | null): string => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

/**
 * Tìm vị trí khớp từ khóa không dấu trên chuỗi không dấu, nhưng cắt substring từ chuỗi GỐC
 * để bảo toàn tuyệt đối dấu tiếng Việt ban đầu.
 */
export const highlightText = (
  originalText: string | undefined | null,
  searchQuery: string,
  highlightClassName = "font-extrabold text-black bg-yellow-200/90 rounded-xs px-0.5"
): React.ReactNode => {
  if (!originalText) return "";
  const query = searchQuery.trim();
  if (!query) return originalText;

  const normText = removeVietnameseTones(originalText).toLowerCase();
  const normQuery = removeVietnameseTones(query).toLowerCase();

  if (!normText.includes(normQuery)) {
    return originalText;
  }

  const queryLen = normQuery.length;
  if (queryLen === 0) return originalText;

  const elements: React.ReactNode[] = [];
  let currentIndex = 0;

  while (currentIndex < originalText.length) {
    const matchIndex = normText.indexOf(normQuery, currentIndex);
    if (matchIndex === -1) {
      elements.push(originalText.substring(currentIndex));
      break;
    }

    if (matchIndex > currentIndex) {
      elements.push(originalText.substring(currentIndex, matchIndex));
    }

    const matchedChunk = originalText.substring(matchIndex, matchIndex + queryLen);
    elements.push(
      <strong key={matchIndex} className={highlightClassName}>
        {matchedChunk}
      </strong>
    );

    currentIndex = matchIndex + queryLen;
  }

  return <>{elements}</>;
};

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
  return <span className={className}>{highlightText(text, highlight, highlightClassName)}</span>;
};
