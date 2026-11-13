import * as React from "react";
import { Link } from "gatsby";

import { Rich, Thumb, Tags } from "../components/case-study";
import { ArrowUpRight } from "../components/icons";
import { author, findCaseStudy, sharedFoundation } from "../data/case-studies.cjs";

// One case study, at /case-studies/<slug>/. The copy is in
// src/data/case-studies.cjs; gatsby-node.js creates a page per entry.
const CaseStudy = ({ pageContext }) => {
  const study = findCaseStudy(pageContext.slug);

  return (
    <div className="case-page">
      <article className="reveal">
        <Link className="note-back" to="/#case-studies">
          ← case studies
        </Link>

        <header className="case-header">
          <h1 className="note-title">{study.title}</h1>
          {study.status ? <p className="case-status">{study.status}</p> : null}
          <p className="case-hook">
            <Rich text={study.hook} />
          </p>
          <Tags tags={study.tags} />
        </header>

        <Thumb thumb={study.thumb} eager />

        <div className="case-body">
          {study.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {(section.paragraphs || []).map((text) => (
                <p key={text}>
                  <Rich text={text} />
                </p>
              ))}
              {section.items ? (
                <ul>
                  {section.items.map((text) => (
                    <li key={text}>
                      <Rich text={text} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section>
            <h2>Stack</h2>
            <ul>
              {study.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              {sharedFoundation.label}: {sharedFoundation.items.join(", ")}.{" "}
              {study.slug === "easy-new-home" ? sharedFoundation.note : null}
            </p>
          </section>

          {study.links.length > 0 ? (
            <section>
              <h2>Public code</h2>
              <ul className="case-links">
                {study.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <p className="case-byline">
          {author}
          {" · "}
          Most of my source repos are private, so this describes design decisions and doesn’t
          show code.
        </p>
      </article>
    </div>
  );
};

export default CaseStudy;

export const Head = ({ pageContext }) => {
  const study = findCaseStudy(pageContext.slug);
  return (
    <>
      <title>{study.title} — Michelle Azevedo</title>
      <meta name="description" content={study.summary} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};
