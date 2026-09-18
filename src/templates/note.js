import * as React from "react";
import { graphql } from "gatsby";
import {
  NoteTags,
  useNotesLang,
  NotesShell,
  NoteBackRow,
  copy,
} from "../components/notes";
import { htmlForLang, noteLang } from "../components/note-html.cjs";

const NotePage = ({ data }) => {
  const [lang, setLanguage] = useNotesLang();
  const { html, frontmatter, langs } = data.markdownRemark;

  // Untranslated notes show their title in the language they are written in,
  // so the heading never promises a translation the body cannot deliver.
  const shown = noteLang(langs, lang);
  const title = shown === "pt" ? frontmatter.titlePt : frontmatter.titleEn;
  const body = htmlForLang(html, shown);

  return (
    <NotesShell lang={lang}>
      <article className="note-article reveal">
        <NoteBackRow lang={lang} setLanguage={setLanguage} />

        <header className="note-header">
          <h1 className="note-title" lang={copy[shown].htmlLang}>
            {title}
          </h1>
          <NoteTags
            tags={frontmatter.tags}
            lang={lang}
            className="note-tags"
          />
        </header>

        <div
          className="note-body"
          lang={copy[shown].htmlLang}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
    </NotesShell>
  );
};

export default NotePage;

export const Head = ({ data }) => {
  const { titleEn } = data.markdownRemark.frontmatter;
  return (
    <>
      <title>{titleEn} — Michelle Azevedo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export const query = graphql`
  query NoteById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      langs
      frontmatter {
        slug
        tags
        titleEn
        titlePt
        originalLang
      }
    }
  }
`;
