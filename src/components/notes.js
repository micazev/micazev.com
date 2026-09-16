import * as React from "react";
import { Link } from "gatsby";

export const copy = {
  en: {
    title: "notes",
    blurb: "Notes on yoga, travel, tools, and whatever else I'm figuring out.",
    section: "Past notes",
    htmlLang: "en",
    back: "All notes",
  },
  pt: {
    title: "notes",
    blurb:
      "Notas sobre yoga, viagem, ferramentas e o que mais estiver na cabeça.",
    section: "Notas anteriores",
    htmlLang: "pt-BR",
    back: "Todas as notas",
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

export const useNotesLang = () => {
  const [lang, setLang] = React.useState("en");

  React.useEffect(() => {
    const saved =
      window.localStorage.getItem("notes-lang") ||
      window.localStorage.getItem("notas-lang");
    if (saved === "en" || saved === "pt") setLang(saved);
  }, []);

  const setLanguage = (next) => {
    setLang(next);
    window.localStorage.setItem("notes-lang", next);
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
  <main className="notes-page" lang={copy[lang].htmlLang}>
    <a className="notes-home" href="/">
      Michelle Azevedo
    </a>
    {children}
  </main>
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

export const NoteBackRow = ({ lang, setLanguage }) => {
  const t = copy[lang];
  return (
    <div className="notes-title-row">
      <Link className="note-back" to="/notes/">
        ← {t.back}
      </Link>
      <LangToggle lang={lang} setLanguage={setLanguage} />
    </div>
  );
};
