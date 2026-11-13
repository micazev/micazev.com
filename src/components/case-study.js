import * as React from "react";

// **bold** and `code` are the only marks the case-study copy uses.
const MARKS = /\*\*(.+?)\*\*|`(.+?)`/g;

export const Rich = ({ text }) => {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(MARKS)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, bold, code] = match;
    parts.push(
      bold ? <strong key={match.index}>{bold}</strong> : <code key={match.index}>{code}</code>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

// The screenshot, or a labelled neutral box until there is one.
export const Thumb = ({ thumb, eager = false }) =>
  thumb.src ? (
    <img
      className="case-thumb"
      src={thumb.src}
      alt={thumb.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  ) : (
    <div className="case-thumb case-thumb-placeholder" role="img" aria-label={thumb.alt}>
      <span aria-hidden="true">{thumb.label}</span>
    </div>
  );

export const Tags = ({ tags }) => (
  <ul className="case-tags" aria-label="Tags">
    {tags.map((tag) => (
      <li key={tag} className="case-tag">
        {tag}
      </li>
    ))}
  </ul>
);
