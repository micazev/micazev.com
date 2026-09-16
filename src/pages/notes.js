import * as React from "react";
import { graphql, Link, navigate } from "gatsby";
import {
  NoteTags,
  NoteFilter,
  tagLabels,
  useNotesLang,
  NotesShell,
  NotesIndexHeader,
  copy,
} from "../components/notes";

const NotesPage = ({ data }) => {
  const [lang, setLanguage] = useNotesLang();
  const t = copy[lang];
  const posts = data.allMarkdownRemark.nodes;

  // Vocabulary order, minus any tag no note actually uses.
  const tags = React.useMemo(() => {
    const present = new Set();
    posts.forEach((post) =>
      (post.frontmatter.tags || []).forEach((tag) => present.add(tag)),
    );
    return Object.keys(tagLabels).filter((tag) => present.has(tag));
  }, [posts]);

  // Starts unfiltered so the first render matches the static HTML.
  const [activeTag, setActiveTag] = React.useState(null);

  // Gatsby does not re-render this page for a query-string-only navigation,
  // so the URL alone cannot drive the filter. Deep links and reloads are read
  // on mount, back/forward arrive as popstate, and a click sets state itself.
  React.useEffect(() => {
    const sync = () => {
      const param = new URLSearchParams(window.location.search).get("tag");
      setActiveTag(param && tags.includes(param) ? param : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [tags]);

  const selectTag = (tag) => {
    setActiveTag(tag);
    navigate(tag ? `/notes/?tag=${encodeURIComponent(tag)}` : "/notes/");
  };

  const visible = activeTag
    ? posts.filter((post) => (post.frontmatter.tags || []).includes(activeTag))
    : posts;

  return (
    <NotesShell lang={lang}>
      <NotesIndexHeader lang={lang} setLanguage={setLanguage} />

      <NoteFilter
        tags={tags}
        active={activeTag}
        lang={lang}
        onSelect={selectTag}
      />

      <section
        className="notes-section reveal"
        style={{ animationDelay: "80ms" }}
      >
        <h2 className="notes-section-label">
          {t.section}
          {activeTag ? ` · ${visible.length}` : ""}
        </h2>
        <ul className="notes-list">
          {visible.map((post) => {
            const { slug, tags: postTags, titleEn, titlePt } =
              post.frontmatter;
            const title = lang === "pt" ? titlePt : titleEn;
            return (
              <li className="notes-item" key={slug}>
                <Link className="notes-item-title" to={`/notes/${slug}/`}>
                  {title}
                </Link>
                <NoteTags
                  tags={postTags}
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
