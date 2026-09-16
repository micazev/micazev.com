import * as React from "react";
import { graphql, Link } from "gatsby";
import {
  NoteTags,
  useNotesLang,
  NotesShell,
  NotesIndexHeader,
  copy,
} from "../components/notes";

const NotesPage = ({ data }) => {
  const [lang, setLanguage] = useNotesLang();
  const t = copy[lang];
  const posts = data.allMarkdownRemark.nodes;

  return (
    <NotesShell lang={lang}>
      <NotesIndexHeader lang={lang} setLanguage={setLanguage} />

      <section
        className="notes-section reveal"
        style={{ animationDelay: "80ms" }}
      >
        <h2 className="notes-section-label">{t.section}</h2>
        <ul className="notes-list">
          {posts.map((post) => {
            const { slug, tags, titleEn, titlePt } = post.frontmatter;
            const title = lang === "pt" ? titlePt : titleEn;
            return (
              <li className="notes-item" key={slug}>
                <Link className="notes-item-title" to={`/notes/${slug}/`}>
                  {title}
                </Link>
                <NoteTags
                  tags={tags}
                  lang={lang}
                  className="notes-item-tags"
                />
              </li>
            );
          })}
        </ul>
      </section>
    </NotesShell>
  );
};

export default NotesPage;

export const Head = () => (
  <>
    <title>notes — Michelle Azevedo</title>
    <meta
      name="description"
      content="Notes by Michelle Azevedo — yoga, travel, tools, and older writing."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);

export const query = graphql`
  query NotesIndex {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        frontmatter {
          slug
          tags
          titleEn
          titlePt
        }
      }
    }
  }
`;
