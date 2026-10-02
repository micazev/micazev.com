import * as React from "react";
import { Link } from "gatsby";

export const copy = {
  en: {
    title: "notes",
    blurb: "Notes on whatever I'm figuring out.",
    section: "Past notes",
    htmlLang: "en",
    back: "All notes",
    all: "all",
    filterLabel: "Filter notes by tag",
    untranslated: "This note is only in Portuguese for now.",
  },
  pt: {
    title: "notes",
    blurb: "Notas sobre o que estiver na cabeça.",
    section: "Notas anteriores",
    htmlLang: "pt-BR",
    back: "Todas as notas",
    all: "todas",
    filterLabel: "Filtrar notas por tag",
    untranslated: "Esta nota ainda só está em inglês.",
  },
};

export const tagLabels = {
  yoga: { en: "yoga", pt: "yoga" },
  meditation: { en: "meditation", pt: "meditação" },
  ai: { en: "ai", pt: "ia" },
  tools: { en: "tools", pt: "ferramentas" },
  travel: { en: "travel", pt: "viagem" },
  habits: { en: "habits", pt: "hábitos" },
  health: { en: "health", pt: "saúde" },
  books: { en: "books", pt: "livros" },
  society: { en: "society", pt: "sociedade" },
};

export const NoteFilter = ({ tags, active, lang, onSelect }) => {
  const t = copy[lang];
  return (
    <nav
      className="notes-filter reveal"
      style={{ animationDelay: "60ms" }}
      aria-label={t.filterLabel}
    >
      <button
        type="button"
        className={active ? "notes-filter-tag" : "notes-filter-tag is-active"}
        aria-pressed={!active}
        onClick={() => onSelect(null)}
      >
        {t.all}
      </button>
      {tags.map((tag) => {
        const isActive = tag === active;
        return (
          <button
            key={tag}
            type="button"
            className={
              isActive ? "notes-filter-tag is-active" : "notes-filter-tag"
            }
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? null : tag)}
          >
            {(tagLabels[tag] && tagLabels[tag][lang]) || tag}
          </button>
        );
      })}
    </nav>
  );
};

export const NoteTags = ({ tags, lang, className }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className={className}>
      {tags.map((tag) => (
        <li className="note-tag" key={tag}>
          {(tagLabels[tag] && tagLabels[tag][lang]) || tag}
        </li>
      ))}
    </ul>
  );
};

const isLang = (value) => value === "en" || value === "pt";

// The language lives in the URL (?lang=pt) so a link always opens the
// version it was copied from; the last choice is remembered for links that
// don't carry one. replaceState keeps any other parameter (?tag=) intact.
const writeLangToUrl = (lang) => {
  const url = new URL(window.location.href);
  if (url.searchParams.get("lang") === lang) return;
  url.searchParams.set("lang", lang);
  window.history.replaceState(window.history.state, "", url);
};

// Adds ?lang= to an internal link, so the next page opens in the same
// language.
export const withLang = (path, lang) => {
  const [base, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("lang", lang);
  return `${base}?${params}`;
};

// Pages without a language toggle pass { inUrl: false }: they still follow
// the reader's language but leave their own URL alone.
export const useNotesLang = ({ inUrl = true } = {}) => {
  // Starts in English so the first render matches the static HTML.
  const [lang, setLang] = React.useState("en");

  React.useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const saved =
      window.localStorage.getItem("notes-lang") ||
      window.localStorage.getItem("notas-lang");
    const initial = isLang(fromUrl) ? fromUrl : isLang(saved) ? saved : "en";
    setLang(initial);
    if (isLang(fromUrl)) window.localStorage.setItem("notes-lang", fromUrl);
    if (inUrl) writeLangToUrl(initial);
  }, [inUrl]);

  const setLanguage = (next) => {
    setLang(next);
    window.localStorage.setItem("notes-lang", next);
    if (inUrl) writeLangToUrl(next);
  };

  return [lang, setLanguage, copy[lang]];
};

export const LangToggle = ({ lang, setLanguage }) => (
  <div className="notes-lang" role="group" aria-label="Language">
    <button
      type="button"
      className={lang === "en" ? "is-active" : undefined}
      onClick={() => setLanguage("en")}
      aria-pressed={lang === "en"}
    >
      en
    </button>
    <span className="notes-lang-sep" aria-hidden="true">
      |
    </span>
    <button
      type="button"
      className={lang === "pt" ? "is-active" : undefined}
      onClick={() => setLanguage("pt")}
      aria-pressed={lang === "pt"}
    >
      pt
    </button>
  </div>
);

export const NotesShell = ({ lang, children }) => (
  <div className="notes-page" lang={copy[lang].htmlLang}>
    {children}
  </div>
);

export const NotesIndexHeader = ({ lang, setLanguage }) => {
  const t = copy[lang];
  return (
    <header className="notes-header reveal">
      <div className="notes-title-row">
        <h1 className="notes-title">{t.title}</h1>
        <LangToggle lang={lang} setLanguage={setLanguage} />
      </div>
      <p className="notes-blurb">{t.blurb}</p>
    </header>
  );
};

// A note links back to the page that lists it: /notes/, /tech/ or /yoga/.
export const NoteBackRow = ({ lang, setLanguage, section = "notes" }) => {
  const t = copy[lang];
  return (
    <div className="notes-title-row">
      <Link className="note-back" to={withLang(`/${section}/`, lang)}>
        ← {section === "notes" ? t.back : section}
      </Link>
      <LangToggle lang={lang} setLanguage={setLanguage} />
    </div>
  );
};
