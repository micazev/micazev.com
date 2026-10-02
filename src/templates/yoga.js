import * as React from "react";
import { graphql, Link } from "gatsby";

import { ChevronRight } from "../components/icons";
import {
  NoteTags,
  LangToggle,
  useNotesLang,
  NotesShell,
  copy as notesCopy,
} from "../components/notes";
import { notesInSection, noteLang } from "../components/note-html.cjs";

/* ------------------------------------------------------------------ */
/*  /yoga: the yoga and meditation notes, and the ebook signup.        */
/*                                                                     */
/*  Copy and the ebook on offer come from content/site/yoga.json and   */
/*  content/ebooks/, edited in the CMS at /admin; gatsby-node reads    */
/*  them into pageContext. The strings below only fill in for a field  */
/*  left empty there.                                                  */
/* ------------------------------------------------------------------ */

const defaults = {
  en: {
    blurb: "Notes on yoga's history, texts and practice.",
    offerLabel: "Free ebook",
    offerCopy: "Leave your email and the PDF is yours.",
    button: "Get the ebook",
    success: "It's yours. The download should start on its own; a copy is on its way to your inbox.",
    // When the email could not go out; not editable, since the CMS text
    // above promises one.
    successNoEmail: "It's yours. The download should start on its own.",
    postsLabel: "Yoga notes",
    emailLabel: "Email",
    placeholder: "you@example.com",
    sending: "Sending…",
    download: "Download the PDF",
    invalid: "That email doesn't look right.",
    failed: "Something went wrong. Try again in a minute.",
    languages: { en: "in English", pt: "in Portuguese" },
  },
  pt: {
    blurb: "Notas sobre a história, os textos e a prática do yoga.",
    offerLabel: "Ebook gratuito",
    offerCopy: "Deixe seu email e o PDF é seu.",
    button: "Quero o ebook",
    success: "Pronto. O download deve começar sozinho; uma cópia está a caminho do seu email.",
    successNoEmail: "Pronto. O download deve começar sozinho.",
    postsLabel: "Notas sobre yoga",
    emailLabel: "Email",
    placeholder: "voce@exemplo.com",
    sending: "Enviando…",
    download: "Baixar o PDF",
    invalid: "Esse email não parece certo.",
    failed: "Algo deu errado. Tente de novo em um minuto.",
    languages: { en: "em inglês", pt: "em português" },
  },
};

// Empty strings from the CMS fall back to the defaults, not to blanks.
const useCopy = (pageCopy, lang) =>
  React.useMemo(() => {
    const fromCms = Object.fromEntries(
      Object.entries(pageCopy[lang] || {}).filter(([, value]) => value),
    );
    return { ...defaults[lang], ...fromCms };
  }, [pageCopy, lang]);

// A programmatic click on a download link. Some browsers (iOS Safari) ignore
// it after an await, which is why the link is also shown on screen.
const startDownload = (href) => {
  const a = document.createElement("a");
  a.href = href;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const EbookOffer = ({ ebook, lang, t }) => {
  const [status, setStatus] = React.useState("idle"); // idle | sending | done | error
  const [error, setError] = React.useState("");
  const [url, setUrl] = React.useState(null);
  const [emailed, setEmailed] = React.useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          website: form.get("website"),
          lang,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error === "invalid_email" ? t.invalid : t.failed);
        setStatus("error");
        return;
      }
      setUrl(body.url);
      setEmailed(Boolean(body.emailed));
      setStatus("done");
      if (body.url) startDownload(body.url);
    } catch {
      setError(t.failed);
      setStatus("error");
    }
  };

  return (
    <section
      className="ebook-offer reveal"
      style={{ animationDelay: "60ms" }}
      aria-labelledby="ebook-title"
    >
      {ebook.coverUrl ? (
        <img
          className="ebook-cover"
          src={ebook.coverUrl}
          alt=""
          width="160"
          height="255"
          decoding="async"
        />
      ) : null}

      <div className="ebook-body">
        <p className="section-label">{t.offerLabel}</p>
        <h2 className="ebook-title" id="ebook-title">
          {ebook.title}
        </h2>
        {ebook.description ? (
          <p className="ebook-desc">{ebook.description}</p>
        ) : null}
        <p className="ebook-meta">
          PDF · {t.languages[ebook.language] || ebook.language}
        </p>

        {status === "done" ? (
          <div className="ebook-done" role="status">
            <p>{emailed ? t.success : t.successNoEmail}</p>
            {url ? (
              <a className="email-button" href={url} download>
                {t.download}
                <ChevronRight />
              </a>
            ) : null}
          </div>
        ) : (
          <form className="ebook-form" onSubmit={onSubmit}>
            <p className="ebook-copy">{t.offerCopy}</p>
            <div className="ebook-fields">
              <label className="sr-only" htmlFor="ebook-email">
                {t.emailLabel}
              </label>
              <input
                className="ebook-input"
                id="ebook-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={t.placeholder}
                required
                aria-invalid={status === "error" ? true : undefined}
                aria-describedby={error ? "ebook-error" : undefined}
              />
              {/* Honeypot, hidden from people and from assistive tech. */}
              <input
                className="ebook-honeypot"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <button
                className="email-button"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? t.sending : t.button}
                <ChevronRight />
              </button>
            </div>
            {error ? (
              <p className="ebook-error" id="ebook-error" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
};

const YogaPage = ({ data, pageContext }) => {
  const [lang, setLanguage] = useNotesLang();
  const t = useCopy(pageContext.copy, lang);

  const posts = React.useMemo(
    () => notesInSection(data.allMarkdownRemark.nodes, "yoga"),
    [data],
  );

  return (
    <NotesShell lang={lang}>
      <header className="notes-header reveal">
        <div className="notes-title-row">
          <h1 className="notes-title">yoga</h1>
          <LangToggle lang={lang} setLanguage={setLanguage} />
        </div>
        <p className="notes-blurb">{t.blurb}</p>
      </header>

      {pageContext.ebook ? (
        <EbookOffer ebook={pageContext.ebook} lang={lang} t={t} />
      ) : null}

      {posts.length > 0 ? (
        <section className="notes-section reveal" style={{ animationDelay: "120ms" }}>
          <h2 className="notes-section-label">{t.postsLabel}</h2>
          <ul className="notes-list">
            {posts.map((post) => {
              // Same resolution /notes uses, so the title you click is the
              // title and language you land on.
              const shown = noteLang(post.langs, lang);
              return (
                <li className="notes-item" key={post.slug}>
                  <Link
                    className="notes-item-title"
                    to={`/notes/${post.slug}/`}
                    lang={notesCopy[shown].htmlLang}
                  >
                    {post.titles[shown]}
                  </Link>
                  <NoteTags tags={post.tags} lang={lang} className="notes-item-tags" />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </NotesShell>
  );
};

export default YogaPage;

export const Head = ({ pageContext }) => (
  <>
    <title>yoga — Michelle Azevedo</title>
    <meta
      name="description"
      content={
        (pageContext.copy.en && pageContext.copy.en.blurb) || defaults.en.blurb
      }
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);

export const query = graphql`
  query YogaNotes {
    allMarkdownRemark(
      filter: { fields: { collection: { eq: "notes" } } }
      sort: [{ frontmatter: { date: DESC } }, { fields: { lang: ASC } }]
    ) {
      nodes {
        fields {
          slug
          lang
          hasBody
        }
        frontmatter {
          title
          date
          section
          tags
        }
      }
    }
  }
`;
