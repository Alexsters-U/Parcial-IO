"use client";

import katex from "katex";
import { useMemo } from "react";

type Part = { math: boolean; value: string };

function parseParts(text: string): Part[] {
  const parts: Part[] = [];
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ math: false, value: text.slice(lastIndex, match.index) });
    }
    parts.push({ math: true, value: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ math: false, value: text.slice(lastIndex) });
  }
  return parts;
}

export function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = useMemo(() => parseParts(text), [text]);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.math ? (
          <span
            key={index}
            className="inline-block align-middle"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.value, {
                throwOnError: false,
                displayMode: false,
                output: "htmlAndMathml",
                trust: false,
              }),
            }}
          />
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
}
