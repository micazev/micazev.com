import * as React from "react";

import { Socials, ArrowUpRight } from "../components/icons";
import content from "../../content/site/projects.json";

/* ------------------------------------------------------------------ */
/*  Projects come from content/projects ("Projects" in the CMS) via    */
/*  gatsby-node.js, grouped by their placement; past work lives in     */
/*  content/site/projects.json ("Site copy" -> "/projects page"). A    */
/*  section with nothing in it is left out.                            */
/* ------------------------------------------------------------------ */

const displayHost = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const CASE_LABELS = {
  problem: "problem",
  built: "what I built",
  decisions: "technical decisions",
  result: "result",
};

const ProjectUrl = ({ href }) =>
  href ? (
    <a className="product-url" href={href} target="_blank" rel="noreferrer">
      {displayHost(href)}
      <ArrowUpRight />
    </a>
  ) : null;

const Screenshot = ({ project, className }) =>
  project.imageUrl ? (
    <img
      className={className}
      src={project.imageUrl}
      alt={project.imageAlt}
      loading="lazy"
      decoding="async"
    />
  ) : null;

const Featured = ({ project }) => (
  <article className="featured">
    <div className="featured-head">
      <h3 className="product-name">
        {project.name}
        {project.client ? <span className="client-badge">client work</span> : null}
      </h3>
      <ProjectUrl href={project.href} />
    </div>
    {project.summary ? <p className="product-summary">{project.summary}</p> : null}
    <Screenshot project={project} className="product-image" />
    {project.case.length > 0 ? (
      <dl className="case">
        {project.case.map(({ key, text }) => (
          <div className="case-block" key={key}>
            <dt>{CASE_LABELS[key]}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    ) : null}
    {project.socials.length > 0 ? (
      <Socials items={project.socials} size={14} label={`${project.name} social media`} />
    ) : null}
  </article>
);

const Exploration = ({ project }) => (
  <article className="exploration">
    <Screenshot project={project} className="exploration-image" />
    <div className="featured-head">
      <h3 className="product-name">{project.name}</h3>
      <ProjectUrl href={project.href} />
    </div>
    {project.summary ? <p className="product-summary">{project.summary}</p> : null}
  </article>
);

const Building = ({ project }) => (
  <li className="home-row">
    <span className="home-row-title">
      {project.href ? (
        <a href={project.href} target="_blank" rel="noreferrer">
          {project.name}
        </a>
      ) : (
        project.name
      )}
    </span>
    {project.summary ? <span className="building-summary">{project.summary}</span> : null}
  </li>
);

const Section = ({ label, delay, children }) => (
  <section className="home-section reveal" style={{ animationDelay: `${delay}ms` }}>
    <h2 className="home-label">{label}</h2>
    {children}
  </section>
);

const ProjectsPage = ({ pageContext }) => {
  const projects = pageContext.projects || [];
  const placed = (placement) => projects.filter((p) => p.placement === placement);
  const featured = placed("featured");
  const explorations = placed("exploration");
  const building = placed("building");
  const experience = content.experience || [];

  return (
    <div className="home-page projects-page">
      <h1 className="sr-only">Projects</h1>

      {featured.length > 0 ? (
        <Section label="projects" delay={0}>
          <div className="featured-list">
            {featured.map((project) => (
              <Featured project={project} key={project.slug} />
            ))}
          </div>
        </Section>
      ) : null}

      {explorations.length > 0 ? (
        <Section label="explorations" delay={60}>
          <div className="explorations-grid">
            {explorations.map((project) => (
              <Exploration project={project} key={project.slug} />
            ))}
          </div>
        </Section>
      ) : null}

      {building.length > 0 ? (
        <Section label="in progress" delay={120}>
          <ul className="home-list">
            {building.map((project) => (
              <Building project={project} key={project.slug} />
            ))}
          </ul>
        </Section>
      ) : null}

      {experience.length > 0 ? (
        <Section label="experience" delay={180}>
          <div className="entries">
            {experience.map((job) => (
              <article className="entry" key={job.company}>
                <div className="entry-row">
                  <h3 className="entry-company">{job.company}</h3>
                  <span className="entry-years">{job.years}</span>
                </div>
                <p className="entry-desc">{job.description}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
};

export default ProjectsPage;

export const Head = () => (
  <>
    <title>projects — Michelle Azevedo</title>
    <meta
      name="description"
      content="Projects, explorations and past work by Michelle Azevedo."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);
