import * as React from "react";

/* ------------------------------------------------------------------ */
/*  All copy lives here — edit this object, leave the markup alone.    */
/* ------------------------------------------------------------------ */

const content = {
  name: "Michelle Azevedo",
  role: "Product Software Engineer",
  bio: [
    "Hey! I'm Michelle, a product software engineer who loves turning people's ideas into real life products.",
    "Almost a decade in, from enterprise to startups to solo builds, I've done the whole arc: process discovery, architecture, code, deployment. These days I'm putting all of it into simple products people actually use.",
    "Lately I'm also having fun with a different problem: designing good environments where AI can ship better, reliable code — AI in the loop or AI first."
  ],
  bioExtended: [
    "Still here? Nice. So, right now I'm building Moradiah, a proptech helping Brazilian families go from renting to owning: property search, legal checks, and financing in one place. It's a deeply human product: lawyers and real estate agents find their next clients through Moradiah, and families find professionals they can trust.",
    "Before that, I spent six years split between automation — OCR pipelines turning millions of fiscal documents into structured data in days instead of weeks — and building little softwares, like a workplace-analytics platform I ported to native macOS, or a containerized Python framework that accounting firms ran across dozens of Brazilian municipalities."
  ],
  email: "ola@micazev.com",
  availability: "Available for September",
  socials: [
    { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@micazev" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/micazev/" },
    { label: "Pinterest", icon: "pinterest", href: "https://br.pinterest.com/micazev/" },
    { label: "Substack", icon: "substack", href: "https://substack.com/@micazev" },
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/micazev/" },
    { label: "Letterboxd", icon: "letterboxd", href: "https://letterboxd.com/micazev/films/" },
    { label: "Goodreads", icon: "goodreads", href: "https://www.goodreads.com/micazev" },
    { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@micaazev" },
  ],
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

const ICONS = {
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  pinterest:
    "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  substack:
    "M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  letterboxd:
    "M8.224 14.352a4.447 4.447 0 0 1-3.775 2.092C1.992 16.444 0 14.454 0 12s1.992-4.444 4.45-4.444c1.592 0 2.988.836 3.774 2.092-.427.682-.673 1.488-.673 2.352s.246 1.67.673 2.352zM15.101 12c0-.864.247-1.67.674-2.352-.786-1.256-2.183-2.092-3.775-2.092s-2.989.836-3.775 2.092c.427.682.674 1.488.674 2.352s-.247 1.67-.674 2.352c.786 1.256 2.183 2.092 3.775 2.092s2.989-.836 3.775-2.092A4.42 4.42 0 0 1 15.1 12zm4.45-4.444a4.447 4.447 0 0 0-3.775 2.092c.427.682.673 1.488.673 2.352s-.246 1.67-.673 2.352a4.447 4.447 0 0 0 3.775 2.092C22.008 16.444 24 14.454 24 12s-1.992-4.444-4.45-4.444z",
  goodreads:
    "M11.43 23.995c-3.608-.208-6.274-2.077-6.448-5.078.695.007 1.375-.013 2.07-.006.224 1.342 1.065 2.43 2.683 3.026 1.583.496 3.737.46 5.082-.174 1.351-.636 2.145-1.822 2.503-3.577.212-1.042.236-1.734.231-2.92l-.005-1.631h-.059c-1.245 2.564-3.315 3.53-5.59 3.475-5.74-.054-7.68-4.534-7.528-8.606.01-5.241 3.22-8.537 7.557-8.495 2.354-.14 4.605 1.362 5.554 3.37l.059.002.002-2.918 2.099.004-.002 15.717c-.193 7.04-4.376 7.89-8.209 7.811zm6.1-15.633c-.096-3.26-1.601-6.62-5.503-6.645-3.954-.017-5.625 3.592-5.604 6.85-.013 3.439 1.643 6.305 4.703 6.762 4.532.591 6.551-3.411 6.404-6.967z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

const Icon = ({ name, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d={ICONS[name]} />
  </svg>
);

const Socials = ({ items, size = 16, label }) => (
  <nav className="socials" aria-label={label}>
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        target="_blank"
        rel="noreferrer"
        aria-label={item.label}
        title={item.label}
      >
        <Icon name={item.icon} size={size} />
      </a>
    ))}
  </nav>
);

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

const IndexPage = () => (
  <main className="page">
    <header className="reveal">
      <h1 className="name">{content.name}</h1>
      <Socials items={content.socials} label="Social media" />
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

    <section className="bio reveal" style={{ animationDelay: "240ms" }}>
      {content.bioExtended.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>

    <details className="past-work reveal" style={{ animationDelay: "280ms" }}>
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

    <LocalTime timeZone={content.timeZone} abbr={content.timeZoneAbbr} />

    <footer className="footer reveal" style={{ animationDelay: "320ms" }}>
      <blockquote className="quote">
        <p>“{content.quote.text}”</p>
        <p className="quote-attribution">
          — {content.quote.author}, <cite>{content.quote.source}</cite>
        </p>
      </blockquote>
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
