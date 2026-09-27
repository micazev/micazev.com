import * as React from "react";
import { graphql } from "gatsby";
import {
  LangToggle,
  useNotesLang,
  NotesShell,
  copy,
} from "../components/notes";
import { groupTranslations, noteLang } from "../components/note-html.cjs";

// A standalone page written in the CMS (content/pages/<slug>.<lang>.md),
// served at /<slug>/. Same reading column and language rules as a note.
const Page = ({ data }) => {
  const [lang, setLanguage] = useNotesLang();
  const [page] = groupTranslations(data.allMarkdownRemark.nodes);
  const shown = noteLang(page.langs, lang);

  return (
    <NotesShell lang={lang}>
      <article className="note-article reveal">
        {page.langs.length > 1 ? (
          <div className="notes-title-row page-title-row">
            <LangToggle lang={lang} setLanguage={setLanguage} />
          </div>
        ) : null}

        <header className="note-header">
          <h1 className="note-title" lang={copy[shown].htmlLang}>
            {page.titles[shown]}
          </h1>
        </header>

        <div
          className="note-body"
          lang={copy[shown].htmlLang}
          dangerouslySetInnerHTML={{ __html: page.html[shown] }}
        />
      </article>
    </NotesShell>
  );
};

export default Page;

export const Head = ({ data }) => {
  const [page] = groupTranslations(data.allMarkdownRemark.nodes);
  return (
    <>
      <title>{page.titles.en || page.titles.pt} — Michelle Azevedo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export const query = graphql`
  query PageBySlug($slug: String!) {
    allMarkdownRemark(
      filter: { fields: { slug: { eq: $slug }, collection: { eq: "pages" } } }
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
        }
      }
    }
  }
`;
