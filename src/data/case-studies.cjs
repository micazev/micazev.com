/* ------------------------------------------------------------------ */
/*  The case studies on the home page and their detail pages.          */
/*                                                                     */
/*  Order here is the order on the home page. Text may use **bold**    */
/*  and `code`, nothing else (see Rich in src/components/case-study.js).*/
/*                                                                     */
/*  Only the two public repos below may be linked; the rest are        */
/*  private, so their design is described here, never their code.      */
/*                                                                     */
/*  thumb.src null = the labelled neutral placeholder. Swap in a       */
/*  screenshot path (published by the build, like /projects/*.webp)    */
/*  and the placeholder goes away.                                     */
/* ------------------------------------------------------------------ */

const author = "Michelle";

const sharedFoundation = {
  label: "Shared foundation",
  items: ["Stripe", "Google OAuth", "Railway", "Cloudflare"],
  note: "Easy New Home uses WhatsApp magic-link login instead of Google OAuth.",
};

const RAG_REPO = "https://github.com/micazev/rag-property-law-brazil";
const SCRAPERS_REPO =
  "https://github.com/micazev/scrapers-property-actions-brazil";

const caseStudies = [
  {
    slug: "analise-matricula",
    title: "Análise Matrícula",
    hook: "Reads Brazilian property title records with OCR and LLMs. Its property-law RAG layer, being open-sourced, splits statutes by article, uses hybrid retrieval, and answers with citations.",
    tags: ["OCR", "RAG", "multi-LLM", "evals"],
    thumb: {
      src: "/projects/analise-matricula.webp",
      alt: "Análise Matrícula landing page: “Entenda a situação do imóvel”, next to a sample matrícula report.",
      label: "Análise Matrícula",
    },
    summary:
      "A product that reads Brazilian property title records (matrículas) with OCR and LLMs, and lets users ask questions about property law and get answers with citations.",
    links: [
      { label: "rag-property-law-brazil (MIT, public)", href: RAG_REPO },
    ],
    stack: [
      "Next 16, React 19, TypeScript",
      "Postgres with pgvector",
      "S3-compatible storage (Tigris)",
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "A matrícula is the registry record of a property in Brazil: who owns it, what liens and encumbrances sit on it, what has been averbado over the years. It is the document a buyer most needs to understand and the one they are least equipped to read. Scans are inconsistent, and the legal context lives in statutes few people open.",
        ],
      },
      {
        heading: "What it does",
        items: [
          "**Reads the document.** Upload a matrícula and get a structured reading of it.",
          "**Answers legal questions with citations.** A law chat inside the product, behind login, with three modes: Matrícula, Legislação and Suporte.",
        ],
      },
      {
        heading: "OCR: a path that degrades on purpose",
        paragraphs: [
          "Documents go through three steps, cheapest first: the digital text layer when the PDF has one, then LLM OCR, then a Mistral OCR fallback. Each result carries a confidence score, so a weak read is visible instead of silently trusted.",
        ],
      },
      {
        heading: "LLM provider chain",
        paragraphs: [
          "Calls fall back in order: Gemini, then DeepSeek, then GPT, then Claude. A provider outage or quota error changes who answers, not whether the user gets an answer.",
        ],
      },
      {
        heading: "The law RAG",
        items: [
          "**Corpus.** Leis 6.015/1973, 9.514/1997, 8.245/1991, 8.009/1990, 14.711/2023 and the LGPD in full; the CC, CPC, CTN, CF and CDC as article ranges; Provimento CNJ 149/2023; and an in-house matrícula guide. It has not been reviewed by a lawyer.",
          "**Chunking.** One chunk per article, so a citation points at a unit a lawyer would recognise.",
          "**Retrieval.** Exact-article lookup, Portuguese full-text search and pgvector cosine similarity (`gemini-embedding-001`, 768 dimensions), merged with reciprocal rank fusion (k=60). Top 8 go to the model. There is no reranker.",
          "**Refusal.** The answer is refused when similarity is below 0.55, or when a `[n]` citation is missing or points at something that was not retrieved. I would rather it say nothing than sound sure.",
        ],
      },
      {
        heading: "The public part",
        paragraphs: [
          "The article chunker is extracted as an MIT repo, with tests and CI, alongside an eval harness that compares exact, BM25, vector and hybrid retrieval on recall@k, MRR and nDCG.",
        ],
      },
      {
        heading: "Evals, honestly",
        paragraphs: [
          "The only eval running today is a banned-phrase check on 5 synthetic fixtures. The retrieval harness exists, but its question set is not populated yet, so I have no retrieval metrics to report, and I won't quote any. Writing that golden set is the next job.",
        ],
      },
    ],
  },
  {
    slug: "leilao-no-mapa",
    title: "Leilão no Mapa",
    hook: "Daily-refreshed map of Brazilian bank-auction properties: 41k+ listings across all 27 states, with an LLM “Raio-X” risk report.",
    tags: ["scrapers", "ETL", "geocoding", "maps", "LLM"],
    thumb: {
      src: null,
      alt: "Placeholder for a Leilão no Mapa screenshot.",
      label: "Leilão no Mapa",
    },
    summary:
      "Scrapers plus map intelligence: Brazilian bank and auction properties, mostly from Caixa, plotted on a map, with an AI risk report per property.",
    links: [
      { label: "scrapers-property-actions-brazil (public)", href: SCRAPERS_REPO },
    ],
    stack: [
      "Next 16, React 19, Tailwind, Mapbox GL",
      "Auth.js with Google, Stripe",
      "Postgres on Railway, cron ETL services",
      "Python and Playwright scrapers",
      "Gemini, DeepSeek, GPT and Claude with fallback",
    ],
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "A Portuguese-language app for people who want to stop renting. It plots bank-owned and auction properties on a map of Brazil, with filters for price, down payment, state, city and type, saved-search email alerts and a per-property AI report.",
        ],
      },
      {
        heading: "The data today",
        paragraphs: [
          "Public numbers, checked on 13 Nov 2026: 41,404 listings, 22,331 of them active, covering all 27 states and refreshed daily.",
          "Those listings are almost all from Caixa, with a handful from one auctioneer. That is a narrower catalog than I built for, and the next section says why.",
        ],
      },
      {
        heading: "Scrapers, and what broke",
        items: [
          "**The Caixa feed** is downloaded each morning through a headless browser, because the page sits behind bot protection. The reader streams the CSV, detects the header row, and sniffs for a CAPTCHA page instead of parsing it.",
          "**Failure handling.** If a feed has far fewer valid rows than the current active catalog, the run refuses to touch it, so a truncated download can’t wipe the inventory. Listings missing from a valid feed are deactivated, not deleted. Every run, including failed launches, is written to a ledger.",
          "**Deduplication** happens within a run, across sources on a normalised address key (Caixa wins), and in Postgres through upserts that never overwrite first-seen dates.",
          "**The auctioneer fleet is paused.** It has 81 connector files, 6 custom and 75 config-driven, and I paused it on 11 Nov 2026 because of Cloudflare and Radware blocking. Of all those connectors, only GP Leilões still returns rows. I would rather say that than let “many auctioneers” imply coverage it doesn’t have.",
          "**Public spin-out.** The framework and four connectors with verified selectors and parser tests are public, linked below.",
        ],
      },
      {
        heading: "Geocoding follows the licence",
        paragraphs: [
          "Mapbox’s temporary geocoding terms forbid storing results, and the job exists to store coordinates. So I moved stored geocoding to Geoapify, whose terms allow it with attribution, and wrote it up as an ADR. The job paces itself and caps requests per run. It also rejects country-, state- and county-level results: their centroids pass a state bounding-box check while landing hundreds of kilometres from the property.",
          "The ADR records a trade-off I accepted: older rows keep their Mapbox confidence values, so the confidence column now has mixed provenance.",
        ],
      },
      {
        heading: "An atomic cost kill-switch",
        paragraphs: [
          "Before the client mounts Mapbox it must reserve a “map load”. The reservation is a single atomic check-and-increment in Postgres against a monthly cap set just under the free tier. It fails closed after a timeout, and the map only mounts once the visitor asks for it. The bill can’t run away because the database says no.",
        ],
      },
      {
        heading: "Raio-X: an LLM report that can’t grade itself",
        items: [
          "**Versioned prompt.** The model is told to use only the supplied inputs, to treat free text as data and not instructions, and to return JSON only.",
          "**Evidence classes.** Every fact is labelled confirmed, estimated, inferred, conflicting or not found.",
          "**Score and gates in code.** The final score is computed by the system from weighted criteria, not by the model. Seven hard gates have fixed effects in code, for example a current indisponibilidade forces “do not participate”.",
          "**Output.** One of four decisions: advance to due diligence, monitor, do not participate, insufficient data.",
          "**Operations.** Multi-provider fallback with provenance recorded, results reused by input hash and prompt version, timeouts, output validation and rollback on invalid JSON. It is per-user and behind login.",
        ],
      },
      {
        heading: "Gaps",
        items: [
          "No verified user, conversion or revenue numbers, so I don’t quote any.",
          "I haven’t measured the accuracy, latency or cost of Raio-X.",
          "Matrícula analysis is not running in bulk across the catalog.",
        ],
      },
    ],
  },
  {
    slug: "moradiah",
    title: "Moradiah",
    status: "in development",
    hook: "A decision engine for first-time home buyers in Brazil. It compares off-plan (na planta), resale and auction paths on the same terms (entry cost, monthly payment, time to move in, risk), using rent, income and FGTS.",
    tags: ["Next.js", "Postgres", "LLM", "financing rules"],
    thumb: {
      src: null,
      alt: "Placeholder for a Moradiah screenshot.",
      label: "Moradiah",
    },
    summary:
      "A decision engine for first-time home buyers in Brazil. In development: the platform underneath exists, the engine itself is being built.",
    links: [],
    stack: [
      "Next.js 15, React 19, TypeScript, Tailwind",
      "pnpm and Turborepo monorepo",
      "Postgres, Google OAuth, Stripe, Resend",
      "Mapbox, Claude",
      "Railway behind Cloudflare",
    ],
    sections: [
      {
        heading: "Status",
        paragraphs: [
          "In development. Everything under “The idea” is the design I am building towards, not a shipped feature.",
        ],
      },
      {
        heading: "The problem",
        paragraphs: [
          "A first-time buyer in Brazil faces three very different routes: a new build bought na planta, a resale property, or a bank-repossessed one at auction. Each is advertised on different terms, with different hidden costs, so they never get compared on the same footing.",
        ],
      },
      {
        heading: "The idea",
        paragraphs: [
          "The buyer enters rent, income, FGTS balance, savings and city. The engine compares the three paths on entry cost, monthly payment (SFH or MCMV), time to move in and risk, then recommends one. It hands off to Leilão no Mapa to browse auction properties and to Análise Matrícula to read a title record before bidding.",
        ],
      },
      {
        heading: "The hard parts",
        items: [
          "**Normalising hidden costs.** ITBI, registry fees, occupied properties and condominium debt all change what a price really costs, and each path hides a different set.",
          "**Financing rules that are grounded and current.** SFH and MCMV limits and conditions change, so the engine can’t rely on what a model remembers; the rules need a source and a date.",
          "**Showing uncertainty.** A recommendation built on estimates should say how sure it is and what would change it.",
        ],
      },
      {
        heading: "What already exists",
        paragraphs: [
          "The platform it sits on is live: about 22k bank-repossessed listings (Caixa), maps, login, payments and email. CI runs typegen, tsc, vitest and a Next build. Payments are idempotent and there is a quota kill-switch.",
        ],
      },
    ],
  },
  {
    slug: "easy-new-home",
    title: "Easy New Home",
    hook: "A WhatsApp bot that turns a broker’s photos and notes into a shareable listing.",
    tags: ["Twilio", "WhatsApp", "Gemini structured output", "Postgres"],
    thumb: {
      src: null,
      alt: "Placeholder for an Easy New Home screenshot.",
      label: "Easy New Home",
    },
    summary:
      "A WhatsApp bot that lets Brazilian real-estate brokers go from a property visit to a shareable listing page without leaving the chat.",
    links: [],
    stack: [
      "React 18, React Router, TanStack Query, Tailwind, Vite, Leaflet",
      "Node 22, Express, TypeScript, Twilio SDK, sharp, zod",
      "Gemini through @google/genai",
      "Postgres via Prisma, S3-compatible storage",
      "One Railway service from a multi-stage Dockerfile",
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "In Brazil, real estate runs on WhatsApp. A broker visits a property, takes dozens of photos, types a few notes and forwards it all to clients. The client gets a wall of unordered images with no price summary and nothing to pass on cleanly. Portals exist, but publishing to them is slow form-filling on a laptop, and brokers live on their phones.",
          "I designed around one constraint: the broker should never have to leave the chat to produce something useful.",
        ],
      },
      {
        heading: "What it does",
        items: [
          "**Capture in chat.** The broker texts `new`, sends photos, a location pin, an owner contact card and notes, then texts `done`.",
          "**Generate a listing.** A one-page, mobile-first listing: photo gallery, price card, highlights, an illustrative floor plan, distances to nearby places, a broker card and a WhatsApp button. One link instead of dozens of photos.",
          "**Manage from the phone.** Commands such as `editar`, `publicar`, `link`, `perfil` and `painel`, in Portuguese with English aliases.",
          "**Curate for clients.** A mobile dashboard to edit listings and build per-client collection links.",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "One Railway service serves the API, the Twilio webhook and the React app. For a solo build at this stage, a single deployable was the right call.",
          "The flow: broker on WhatsApp, to Twilio, to a signed webhook that fails closed. Messages are serialised per broker, media is normalised and stored, and on `done` Gemini returns structured output that is validated before it is saved. Follow-ups go out through the Twilio REST API.",
        ],
      },
      {
        heading: "Decisions and trade-offs",
        items: [
          "**Albums are a race condition.** Twenty photos arrive as twenty simultaneous webhooks. A per-user Postgres advisory lock gives ordering without a queue or Redis. The cost is per-user throughput, which doesn’t matter at a broker’s message volume.",
          "**`done` often arrives before the photos.** The webhook reserves a placeholder row before downloading each photo, so `done` can see what is pending, and generation waits up to 60 seconds for it.",
          "**Media is normalised once.** Photos are deduplicated by content hash, resized to at most 2048px and stored privately, served through presigned URLs.",
          "**Generation survives restarts.** Pending generations are persisted, so a deploy mid-generation doesn’t drop a listing.",
          "**Accepted debt:** no tests and no CI. I chose speed and real-world feedback over coverage, and it is first on the list below.",
        ],
      },
      {
        heading: "The AI layer",
        paragraphs: [
          "I treated the model as an untrusted parser, not an author. Gemini returns structured output; the JSON schema is generated from the same zod schema that validates the response before anything is saved, so the prompt contract and the database can’t drift apart.",
        ],
        items: [
          "**Extracts** title, price, fees, area, rooms, address, description, features, photo captions and order.",
          "**Guardrails.** It must not invent numbers: a missing price stays missing. Filler phrases are banned and private notes must not leak into public copy.",
          "**Broker wins.** AI output never overwrites a value the broker has set.",
        ],
      },
      {
        heading: "Security and privacy",
        items: [
          "**Fail-closed webhook.** Every request’s signature is checked against the real public URL, rebuilt behind the proxy. A missing token returns 503 and a bad signature 403.",
          "**WhatsApp magic-link login.** Texting `painel` returns a single-use link valid for 15 minutes, opening a 30-day session. Links go only to verified senders, so the WhatsApp number is the identity, and tokens are stored hashed. This replaces Google OAuth and there is no Stripe here.",
          "**Private by default.** Pins, owner contacts and private notes stay out of the public API; clients see the neighbourhood and distances.",
        ],
      },
      {
        heading: "Status and what is next",
        paragraphs: [
          "Live but early. Known gaps, in my order of priority:",
        ],
        items: [
          "Twilio sandbox only; not yet an approved production sender.",
          "No message templates or 24-hour-window logic, so follow-ups are plain text.",
          "No delivery-status callbacks, and no STOP/opt-out handling.",
          "No privacy policy, LGPD page or retention job. For a product that stores owners’ contacts and property locations, that is a prerequisite.",
          "No tests or CI. First targets: the album and lock path, the `done`-before-photos race, signature validation and the zod contract.",
          "No payments.",
        ],
      },
      {
        heading: "Metrics I plan to track",
        paragraphs: [
          "I have no usage numbers to report. These are what I plan to track:",
        ],
        items: [
          "Time from `done` to a ready link.",
          "How often brokers edit AI-filled fields.",
        ],
      },
    ],
  },
];

const findCaseStudy = (slug) =>
  caseStudies.find((study) => study.slug === slug);

module.exports = { author, sharedFoundation, caseStudies, findCaseStudy };
