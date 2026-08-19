import * as React from "react";

/* ------------------------------------------------------------------ */
/*  All copy lives here — edit this object, leave the markup alone.    */
/* ------------------------------------------------------------------ */

const content = {
  name: "Michelle Azevedo",
  role: "Product Engineer",
  bio: [
    "I'm Michelle, a product designer based in Ho Chi Minh City, Vietnam. I design digital interfaces that solve challenges and amplify user experiences, turning strategic goals into reality.",
    "I experiment with tools like v0 to prototype swiftly, focusing on clean, impactful solutions that balance creativity and functionality.",
  ],
  email: "ola@micazev.com",
  availability: "Available for September",
  experience: [
    {
      company: "TechNova",
      years: "2023 - present",
      description:
        "Leading UX design for cutting-edge AI-powered productivity tools.",
    },
    {
      company: "QuantumLeap",
      years: "2021 - 2023",
      description:
        "Spearheaded the design of quantum computing visualization interfaces, bridging complex data with intuitive user experiences.",
    },
    {
      company: "EcoSphere",
      years: "2019 - 2021",
      description:
        "Designed sustainable product packaging and digital experiences for eco-friendly consumer goods.",
    },
  ],
  links: [
    { label: "Email", href: "mailto:ola@micazev.com" },
    { label: "Twitter", href: "https://twitter.com/micazev" },
    { label: "Dribbble", href: "https://dribbble.com/micazev" },
    { label: "GitHub", href: "https://github.com/micazev" },
  ],
  timeZone: "Asia/Ho_Chi_Minh",
  timeZoneAbbr: "ICT",
};

/* ------------------------------------------------------------------ */

const ArrowUpRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

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

const IndexPage = () => (
  <main className="page">
    <header className="reveal">
      <h1 className="name">{content.name}</h1>
      <p className="role">{content.role}</p>
    </header>

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
      <h2 className="section-label">Experience</h2>
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
    </section>

    <section className="section reveal" style={{ animationDelay: "240ms" }}>
      <h2 className="section-label">Let's get in touch</h2>
      <nav className="links" aria-label="External links">
        {content.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            {link.label}
            <ArrowUpRight />
          </a>
        ))}
      </nav>
    </section>

    <footer className="reveal" style={{ animationDelay: "300ms" }}>
      <LocalTime timeZone={content.timeZone} abbr={content.timeZoneAbbr} />
    </footer>
  </main>
);

export default IndexPage;

export const Head = () => (
  <>
    <title>Michelle Azevedo</title>
    <meta
      name="description"
      content="Michelle Azevedo — product designer based in Ho Chi Minh City, Vietnam."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);
