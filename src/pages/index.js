import * as React from "react";

/* ------------------------------------------------------------------ */
/*  All copy lives here — edit this object, leave the markup alone.    */
/* ------------------------------------------------------------------ */

const content = {
  name: "Michelle Azevedo",
  role: "Product Software Engineer",
  bio: [
    "I'm Michelle, a product software engineer building Moradiah, a proptech that helps Brazilian families go from renting to owning: property search, legal checks, and financing in one place. It's a deeply human product too: lawyers and real estate agents find their next clients through Moradiah, and families find professionals they can trust.",
    "Before that, I spent six years split between automation — OCR pipelines turning millions of fiscal documents into structured data in days instead of weeks — and building software, like the workplace-analytics platform I ported to native macOS app.",
    "Process discovery, architecture, code, deployment... I'm putting all of that experience into building simple products that people actually use and environments where AI has no choice but to ship good, reliable code, whether that means AI in the loop or AI first.",
  ],
  email: "ola@micazev.com",
  availability: "Available for September",
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
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/micazev" },
    { label: "Substack", href: "https://www.substack.com/@micazev" },
    { label: "Threads", href: "https://www.threads.com/@micazev" },
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


    <LocalTime timeZone={content.timeZone} abbr={content.timeZoneAbbr} />


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


    <footer className="reveal" style={{ animationDelay: "300ms" }}>
      <p>quote</p>
    </footer>
  </main>
);

export default IndexPage;

export const Head = () => (
  <>
    <title>Michelle Azevedo</title>
    <meta
      name="description"
      content="Michelle Azevedo — product engineer based in Ho Chi Minh City, Vietnam. Building Moradiah, a proptech for first-time homeowners."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);
