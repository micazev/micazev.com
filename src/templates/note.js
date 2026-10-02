import * as React from "react";
import { graphql } from "gatsby";
import {
  NoteTags,
  useNotesLang,
  NotesShell,
  NoteBackRow,
  copy,
} from "../components/notes";
import { groupTranslations, noteLang } from "../components/note-html.cjs";

const NotePage = ({ data }) => {
  const [lang, setLanguage] = useNotesLang();
  const [note] = groupTranslations(data.allMarkdownRemark.nodes);

  // Untranslated notes show their title in the language they are written in,
  // so the heading never promises a translation the body cannot deliver.
  const shown = noteLang(note.langs, lang);
  const title = note.titles[shown];
  const body = note.html[shown];

  return (
    <NotesShell lang={lang}>
      <article className="note-article reveal">
        <NoteBackRow lang={lang} setLanguage={setLanguage} section={note.section} />

        <header className="note-header">
          <h1 className="note-title" lang={copy[shown].htmlLang}>
            {title}
          </h1>
          <NoteTags
            tags={note.tags}
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
  const [note] = groupTranslations(data.allMarkdownRemark.nodes);
  return (
    <>
      <title>{note.titles.en || note.titles.pt} — Michelle Azevedo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export const query = graphql`
  query NoteBySlug($slug: String!) {
    allMarkdownRemark(
      filter: { fields: { slug: { eq: $slug }, collection: { eq: "notes" } } }
      sort: { fields: { lang: ASC } }
    ) {
      nodes {
        html
        fields {
          slug
          lang
          hasBody
        }
        frontmatter {
          title
          section
          tags
        }
      }
    }
  }
`;
