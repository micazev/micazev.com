import * as React from "react";
import { graphql, Link } from "gatsby";

import { Socials, ArrowUpRight, ChevronRight } from "../components/icons";
import { NoteTags, techTags, useNotesLang, copy } from "../components/notes";
import { groupTranslations, noteLang } from "../components/note-html.cjs";
import content from "../../content/site/tech.json";

/* ------------------------------------------------------------------ */
/*  All copy lives in content/site/tech.json, edited in the CMS at     */
/*  /admin under "Site copy". Leave the markup here alone.             */
/* ------------------------------------------------------------------ */

const displayHost = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const LocalTime = ({ timeZone, abbr }) => {
  const [now, setNow] = React.useState(null);

  React.useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const tick = () => setNow(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <p className="clock" aria-label={`Current time in Ho Chi Minh City`}>
      {now ? `${now} ${abbr}` : " "}
    </p>
  );
};

const TechPage = ({ data }) => {
  // No language toggle on this page; it follows whatever /notes was left on.
  const [lang] = useNotesLang();

  const posts = groupTranslations(data.allMarkdownRemark.nodes).filter((post) =>
    post.tags.some((tag) => techTags.includes(tag)),
  );

  return (
    <div className="tech-page">
      <h1 className="notes-title reveal">tech</h1>

      <section className="bio reveal" style={{ animationDelay: "60ms" }}>
        {content.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <div className="actions reveal" style={{ animationDelay: "120ms" }}>
        <a className="email-button" href={`mailto:${content.email}`}>
          Send an email
          <ChevronRight />
        </a>
        <span className="status">
          <span className="status-dot" aria-hidden="true" />
          {content.availability}
        </span>
      </div>

      <section className="section reveal" style={{ animationDelay: "180ms" }}>
        <h2 className="section-label">Current projects</h2>
        <div className="entries">
          {content.projects.map((project) => (
            <article className="project" key={project.name}>
              <div className="entry-row">
                <h3 className="entry-company">{project.name}</h3>
                <a
                  className="project-url"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {displayHost(project.href)}
                  <ArrowUpRight />
                </a>
              </div>
              {project.socials ? (
                <Socials
                  items={project.socials}
                  size={14}
                  label={`${project.name} social media`}
                />
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <details className="past-work reveal" style={{ animationDelay: "240ms" }}>
        <summary>
          Past work
          <ChevronRight />
        </summary>
        <div className="entries">
          {content.experience.map((job) => (
            <article className="entry" key={job.company}>
              <div className="entry-row">
                <h3 className="entry-company">{job.company}</h3>
                <span className="entry-years">{job.years}</span>
              </div>
              <p className="entry-desc">{job.description}</p>
            </article>
          ))}
        </div>
      </details>

      {posts.length > 0 ? (
        <section className="notes-section reveal" style={{ animationDelay: "300ms" }}>
          <h2 className="notes-section-label">Technical posts</h2>
          <ul className="notes-list">
            {posts.map((post) => {
              const { slug, tags, titles } = post;

              // Same resolution /notes uses, so the title you click is the
              // title and language you land on.
              const shown = noteLang(post.langs, lang);
              return (
                <li className="notes-item" key={slug}>
                  <Link
                    className="notes-item-title"
                    to={`/notes/${slug}/`}
                    lang={copy[shown].htmlLang}
                  >
                    {titles[shown]}
                  </Link>
                  <NoteTags tags={tags} lang={lang} className="notes-item-tags" />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <LocalTime timeZone={content.timeZone} abbr={content.timeZoneAbbr} />

      <aside className="page-quote reveal" style={{ animationDelay: "360ms" }}>
        <blockquote className="quote">
          <p>“{content.quote.text}”</p>
          <p className="quote-attribution">
            — {content.quote.author}, <cite>{content.quote.source}</cite>
          </p>
        </blockquote>
      </aside>
    </div>
  );
};

export default TechPage;

export const Head = () => (
  <>
    <title>tech — Michelle Azevedo</title>
    <meta
      name="description"
      content="Current projects, past work and technical posts by Michelle Azevedo."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);

export const query = graphql`
  query TechNotes {
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
          tags
        }
      }
    }
  }
`;
