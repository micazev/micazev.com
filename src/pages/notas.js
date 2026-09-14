import * as React from "react";
import data from "../data/posts.json";

const copy = {
  en: {
    title: "notas",
    blurb:
      "Notes on yoga, travel, tools, and whatever else I'm figuring out — older Medium writing, collected here.",
    section: "Past notes",
    htmlLang: "en",
  },
  pt: {
    title: "notas",
    blurb:
      "Notas sobre yoga, viagem, ferramentas e o que mais estiver na cabeça — textos antigos do Medium, reunidos aqui.",
    section: "Notas anteriores",
    htmlLang: "pt-BR",
  },
};

const formatDate = (iso, lang) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const NotasPage = () => {
  const [lang, setLang] = React.useState("en");

  React.useEffect(() => {
    const saved = window.localStorage.getItem("notas-lang");
    if (saved === "en" || saved === "pt") setLang(saved);
  }, []);

  const setLanguage = (next) => {
    setLang(next);
    window.localStorage.setItem("notas-lang", next);
  };

  const t = copy[lang];

  return (
    <main className="notas-page" lang={t.htmlLang}>
      <div className="notas-topbar">
        <a className="notas-home" href="/">
          Michelle Azevedo
        </a>
        <div className="notas-lang" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === "en" ? "is-active" : undefined}
            onClick={() => setLanguage("en")}
            aria-pressed={lang === "en"}
          >
            en
          </button>
          <span className="notas-lang-sep" aria-hidden="true">
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
      </div>

      <header className="notas-header reveal">
        <h1 className="notas-title">{t.title}</h1>
        <p className="notas-blurb">{t.blurb}</p>
      </header>

      <section className="notas-section reveal" style={{ animationDelay: "80ms" }}>
        <h2 className="notas-section-label">{t.section}</h2>
        <ul className="notas-list">
          {data.posts.map((post) => (
            <li className="notas-item" key={post.slug}>
              <span className="notas-item-title">{post.title[lang]}</span>
              <time className="notas-item-date" dateTime={post.date}>
                {formatDate(post.date, lang)}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default NotasPage;

export const Head = () => (
  <>
    <title>notas — Michelle Azevedo</title>
    <meta
      name="description"
      content="Notes by Michelle Azevedo — yoga, travel, tools, and older Medium writing."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);
