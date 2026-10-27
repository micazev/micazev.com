import * as React from "react";
import { graphql, Link } from "gatsby";

import { ArrowUpRight } from "../components/icons";
import { useNotesLang, copy, tagLabels, withLang } from "../components/notes";
import { notesInSection, noteLang } from "../components/note-html.cjs";
import content from "../../content/site/home.json";

/* ------------------------------------------------------------------ */
/*  Bio, availability, the tech posts and the product on show. Copy    */
/*  lives in content/site/home.json ("Site copy" -> "Home page" in the */
/*  CMS); the posts are the notes whose section is Tech; the product   */
/*  is every project placed on "home", handed in by gatsby-node.js.    */
/* ------------------------------------------------------------------ */

const displayHost = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// The bio is one line of text with **bold** and [links](https://…), the
// only two marks it needs, so the CMS field can stay a plain string.
const INLINE = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

const Inline = ({ text }) => {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, bold, label, href] = match;
    parts.push(
      bold ? (
        <strong key={match.index}>{bold}</strong>
      ) : (
        <a key={match.index} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const IndexPage = ({ data, pageContext }) => {
  // No language toggle here; it follows whatever /notes was left on.
  const [lang] = useNotesLang({ inUrl: false });

  const projects = pageContext.projects || [];
  const posts = notesInSection(data.allMarkdownRemark.nodes, "tech");

  return (
    <div className="home-page">
      <h1 className="sr-only">Michelle Azevedo</h1>

      <section className="home-bio reveal">
        <p>
          <Inline text={content.bio} />
        </p>
        {content.availability ? (
          <p className="home-status">
            <span className="status-dot" aria-hidden="true" />
            {content.availability}
          </p>
        ) : null}
      </section>

      {posts.length > 0 ? (
        <section className="home-section reveal" style={{ animationDelay: "60ms" }}>
          <h2 className="home-label">posts</h2>
          <ul className="home-list">
            {posts.map((post) => {
              const { slug, tags, titles } = post;

              // Same resolution /notes uses, so the title you click is the
              // title and language you land on.
              const shown = noteLang(post.langs, lang);
              const tag = tags && tags[0];
              return (
                <li key={slug}>
                  <Link
                    className="home-row"
                    to={withLang(`/notes/${slug}/`, lang)}
                    lang={copy[shown].htmlLang}
                  >
                    <span className="home-row-title">{titles[shown]}</span>
                    {tag ? (
                      <span className="home-row-meta">
                        {(tagLabels[tag] && tagLabels[tag][lang]) || tag}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section className="home-section reveal" style={{ animationDelay: "120ms" }}>
          <h2 className="home-label">products</h2>
          <div className="home-list">
            {projects.map((project) => (
              <article className="product" key={project.slug}>
                <div className="product-row">
                  <h3 className="product-name">{project.name}</h3>
                  {project.summary ? (
                    <p className="product-summary">{project.summary}</p>
                  ) : null}
                  {project.href ? (
                    <a
                      className="product-url"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {displayHost(project.href)}
                      <ArrowUpRight />
                    </a>
                  ) : null}
                </div>
                {project.imageUrl ? (
                  <img
                    className="product-image"
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>Michelle Azevedo</title>
    <meta
      name="description"
      content="Michelle Azevedo — product engineer working on applied AI, based in Ho Chi Minh City. Building Análise Matrícula."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);

export const query = graphql`
  query HomeNotes {
    allMarkdownRemark(
      filter: {
        fields: { collection: { eq: "notes" } }
        frontmatter: { draft: { ne: true } }
      }
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
