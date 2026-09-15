import * as React from "react";
import { graphql } from "gatsby";
import {
  formatDate,
  useNotesLang,
  NotesShell,
  NoteBackRow,
} from "../components/notes";

const NotePage = ({ data }) => {
  const [lang, setLanguage] = useNotesLang();
  const { html, frontmatter } = data.markdownRemark;
  const title = lang === "pt" ? frontmatter.titlePt : frontmatter.titleEn;

  return (
    <NotesShell lang={lang}>
      <article className="note-article reveal">
        <NoteBackRow lang={lang} setLanguage={setLanguage} />

        <header className="note-header">
          <h1 className="note-title">{title}</h1>
          <time className="note-date" dateTime={frontmatter.date}>
            {formatDate(frontmatter.date, lang)}
          </time>
        </header>

        <div
          className="note-body"
          dangerouslySetInnerHTML={{ __html: html }}
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
      frontmatter {
        slug
        date
        titleEn
        titlePt
        originalLang
      }
    }
  }
`;
