import * as React from "react";
import { graphql, Link } from "gatsby";

import { Socials, ArrowUpRight, ChevronRight } from "../components/icons";
import { NoteTags, techTags, useNotesLang, copy } from "../components/notes";
import { noteLang } from "../components/note-html.cjs";

/* ------------------------------------------------------------------ */
/*  All copy lives here — edit this object, leave the markup alone.    */
/* ------------------------------------------------------------------ */

const content = {
  bio: [
    "Hey! I'm Michelle, a product software engineer who loves turning people's ideas into real life products.",
  ],
  email: "ola@micazev.com",
  availability: "Available for September",
  projects: [
    {
      name: "Moradiah",
      href: "https://moradiah.com",
      socials: [
        { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/moradiahapp/" },
        { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@moradiah.app" },
        { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/moradiah.app/" },
        { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@moradiahapp" },
      ],
    },
    {
      name: "Análise Matrícula",
      href: "https://analisematricula.com",
    },
  ],
  experience: [
    {
      company: "MP Consultoria Contábil",
      years: "2022 - 2024",
      description:
        "Built a containerized Python framework automating tax declarations across Brazilian municipalities, and led the 3-person effort that retrieved millions of Nescafé fiscal notes in days, replacing weeks of work for a 20-person team.",
    },
    {
      company: "Evope",
      years: "2022 - 2023",
      description:
        "Ported a Windows C++ workplace-analytics platform to native macOS in Swift and Objective-C, encrypted local-first storage, real-time sync, and the full Apple signing and notarization pipeline.",
    },
    {
      company: "WEX",
      years: "2021 - 2022",
      description:
        "Built the UiPath bots behind WEX Health's claims auto-approval pipeline, automating three claim queues across OnBase and the Health Cloud admin portal.",
    },
    {
      company: "Wildlife Studios",
      years: "2021 - 2022",
      description:
        "Built Python and Selenium automation for Oracle Cloud's GRC module, with four bots running across SIT, UAT, and production environments.",
    },
    {
      company: "Xcelis",
      years: "2020 - 2022",
      description:
        "Mapped and automated logistics and retail operations for ArcelorMittal, C&A, and VTEX. From process discovery to bots and automated reporting.",
    },
    {
      company: "Deloitte",
      years: "2019 - 2020",
      description:
        "Built OCR-driven bots parsing high-volume tax documents into structured data; earned the UiPath Advanced Developer certification.",
    },
  ],
  timeZone: "Asia/Ho_Chi_Minh",
  timeZoneAbbr: "ICT",
  quote: {
    text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    author: "Alan Turing",
    source: "Computing machinery and intelligence",
  },
};
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

  const posts = data.allMarkdownRemark.nodes.filter((post) =>
    (post.frontmatter.tags || []).some((tag) => techTags.includes(tag)),
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
              const { slug, tags, titleEn, titlePt } = post.frontmatter;

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
                    {shown === "pt" ? titlePt : titleEn}
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
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        langs
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
