"use client";

import { useEffect } from "react";

type CodeLanguage = "html" | "javascript" | "typescript" | "json";
type TokenType =
  | "plain"
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "property"
  | "function"
  | "operator"
  | "punctuation"
  | "tag"
  | "attr-name"
  | "attr-value";

type CodeToken = {
  type: TokenType;
  text: string;
};

const SCRIPT_KEYWORDS = new Set([
  "async",
  "await",
  "const",
  "else",
  "false",
  "fetch",
  "function",
  "if",
  "import",
  "from",
  "let",
  "new",
  "null",
  "return",
  "true",
  "var",
]);

const JSON_KEYWORDS = new Set(["true", "false", "null"]);

const toPlain = (text: string): CodeToken => ({ type: "plain", text });

function tokenizeScriptLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const rest = line.slice(cursor);

    const comment = /^\/\/.*/.exec(rest);
    if (comment) {
      tokens.push({ type: "comment", text: comment[0] });
      break;
    }

    const stringLiteral = /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/.exec(rest);
    if (stringLiteral) {
      tokens.push({ type: "string", text: stringLiteral[0] });
      cursor += stringLiteral[0].length;
      continue;
    }

    const property = /^[A-Za-z_$][\w$]*(?=\s*:)/.exec(rest);
    if (property) {
      tokens.push({ type: "property", text: property[0] });
      cursor += property[0].length;
      continue;
    }

    const functionCall = /^[A-Za-z_$][\w$]*(?=\s*\()/.exec(rest);
    if (functionCall) {
      const value = functionCall[0];
      tokens.push({
        type: SCRIPT_KEYWORDS.has(value) ? "keyword" : "function",
        text: value,
      });
      cursor += value.length;
      continue;
    }

    const identifier = /^[A-Za-z_$][\w$]*/.exec(rest);
    if (identifier) {
      const value = identifier[0];
      tokens.push({
        type: SCRIPT_KEYWORDS.has(value) ? "keyword" : "plain",
        text: value,
      });
      cursor += value.length;
      continue;
    }

    const numberToken = /^\d+(?:\.\d+)?/.exec(rest);
    if (numberToken) {
      tokens.push({ type: "number", text: numberToken[0] });
      cursor += numberToken[0].length;
      continue;
    }

    const operator = /^===|^!==|^==|^!=|^<=|^>=|^=>|^[=+\-*/%<>!&|?:]/.exec(rest);
    if (operator) {
      tokens.push({ type: "operator", text: operator[0] });
      cursor += operator[0].length;
      continue;
    }

    const punctuation = /^[()[\]{}.,;]/.exec(rest);
    if (punctuation) {
      tokens.push({ type: "punctuation", text: punctuation[0] });
      cursor += punctuation[0].length;
      continue;
    }

    const whitespace = /^\s+/.exec(rest);
    if (whitespace) {
      tokens.push(toPlain(whitespace[0]));
      cursor += whitespace[0].length;
      continue;
    }

    tokens.push(toPlain(rest[0]));
    cursor += 1;
  }

  return tokens;
}

function tokenizeJsonLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const rest = line.slice(cursor);

    const propertyString = /^"(?:\\.|[^"\\])*"(?=\s*:)/.exec(rest);
    if (propertyString) {
      tokens.push({ type: "property", text: propertyString[0] });
      cursor += propertyString[0].length;
      continue;
    }

    const stringLiteral = /^"(?:\\.|[^"\\])*"/.exec(rest);
    if (stringLiteral) {
      tokens.push({ type: "string", text: stringLiteral[0] });
      cursor += stringLiteral[0].length;
      continue;
    }

    const keyword = /^(true|false|null)\b/.exec(rest);
    if (keyword) {
      tokens.push({
        type: JSON_KEYWORDS.has(keyword[1]) ? "keyword" : "plain",
        text: keyword[0],
      });
      cursor += keyword[0].length;
      continue;
    }

    const numberToken = /^-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?/.exec(rest);
    if (numberToken) {
      tokens.push({ type: "number", text: numberToken[0] });
      cursor += numberToken[0].length;
      continue;
    }

    const punctuation = /^[()[\]{}.,:]/.exec(rest);
    if (punctuation) {
      tokens.push({ type: "punctuation", text: punctuation[0] });
      cursor += punctuation[0].length;
      continue;
    }

    const whitespace = /^\s+/.exec(rest);
    if (whitespace) {
      tokens.push(toPlain(whitespace[0]));
      cursor += whitespace[0].length;
      continue;
    }

    tokens.push(toPlain(rest[0]));
    cursor += 1;
  }

  return tokens;
}

function tokenizeHtmlLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const rest = line.slice(cursor);

    const comment = /^<!--.*-->/.exec(rest);
    if (comment) {
      tokens.push({ type: "comment", text: comment[0] });
      cursor += comment[0].length;
      continue;
    }

    const tag = /^<\/?[A-Za-z][\w-]*/.exec(rest);
    if (tag) {
      tokens.push({ type: "tag", text: tag[0] });
      cursor += tag[0].length;
      continue;
    }

    const tagClose = /^\/?>/.exec(rest);
    if (tagClose) {
      tokens.push({ type: "punctuation", text: tagClose[0] });
      cursor += tagClose[0].length;
      continue;
    }

    const attrName = /^\s+[A-Za-z_:][\w:.-]*/.exec(rest);
    if (attrName) {
      const leading = attrName[0].match(/^\s+/)?.[0] ?? "";
      if (leading) tokens.push(toPlain(leading));
      tokens.push({
        type: "attr-name",
        text: attrName[0].slice(leading.length),
      });
      cursor += attrName[0].length;
      continue;
    }

    const operator = /^=/.exec(rest);
    if (operator) {
      tokens.push({ type: "operator", text: operator[0] });
      cursor += operator[0].length;
      continue;
    }

    const attrValue = /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/.exec(rest);
    if (attrValue) {
      tokens.push({ type: "attr-value", text: attrValue[0] });
      cursor += attrValue[0].length;
      continue;
    }

    tokens.push(toPlain(rest[0]));
    cursor += 1;
  }

  return tokens;
}

function tokenizeLine(line: string, language: CodeLanguage): CodeToken[] {
  if (language === "html") return tokenizeHtmlLine(line);
  if (language === "json") return tokenizeJsonLine(line);
  return tokenizeScriptLine(line);
}

function CodeBlock({ language, code }: { language: CodeLanguage; code: string }) {
  const lines = code.trim().split("\n");

  return (
    <div className="code-block-frame">
      <div className="code-block__language">{language}</div>
      <pre className={`code-block code-block--${language}`}>
        <code>
          {lines.map((line, lineIndex) => (
            <span className="code-block__line" key={`${language}-${lineIndex}`}>
              {tokenizeLine(line, language).map((token, tokenIndex) => (
                <span
                  className={`code-block__token code-block__token--${token.type}`}
                  key={`${language}-${lineIndex}-${tokenIndex}`}
                >
                  {token.text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      ".section[id], .section__subtitle[id], .section__sub-subtitle[id]"
    );
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".side-nav a[href^='#']");

    const setActiveNav = (id: string | null) => {
      navLinks.forEach((link) => {
        link.classList.remove("active", "active-parent");
      });

      if (!id) return;
      const activeLink = document.querySelector<HTMLAnchorElement>(`.side-nav a[href="#${id}"]`);
      if (!activeLink) return;

      activeLink.classList.add("active");
      const parentId = activeLink.dataset.parent;
      if (!parentId) return;

      const parentLink = document.querySelector<HTMLAnchorElement>(`.side-nav a[href="#${parentId}"]`);
      parentLink?.classList.add("active-parent");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveNav(entry.target.getAttribute("id"));
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="cds--header" role="banner">
        <a className="cds--header__name" href="/" aria-label="HotelMap">
          <img src="/site-assets/hotelmap-logo.svg" alt="HotelMap" style={{ height: 11 }} />
        </a>
        <span className="cds--header__dept">Design Engineering</span>
        <nav className="cds--header__nav" aria-label="Primary navigation">
          <a className="active" href="/">
            Overview
          </a>
        </nav>
      </header>

      <section className="hero" role="banner">
        <div className="hero__grid-overlay" aria-hidden="true" />
        <div className="cds--grid">
          <div className="hero__inner">
            <div className="hero__eyebrow">Project Documentation / Privacy-First Measurement</div>
            <h1 className="hero__title">Hotel Capture Measurement Plan</h1>
            <p className="hero__subtitle">
              Implementation blueprint for measuring addressable market and hotel capture with
              minimal personal data. Scope covers registration, attribution, analytics, and
              governance controls.
            </p>
          </div>
          <div className="hero__meta">
            <div className="hero__meta-item">
              <span className="hero__meta-label">Version</span>
              <span className="hero__meta-value">1.0</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label">Date</span>
              <span className="hero__meta-value">12 February 2026</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label">Author</span>
              <span className="hero__meta-value">magee @ HotelMap</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label">Department</span>
              <span className="hero__meta-value">Design Engineering</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-layout">
        <aside className="side-nav" id="sideNav" role="navigation" aria-label="Document sections">
          <div className="side-nav__heading">Contents</div>
          <a className="side-nav__title" href="#overview">
            Project Overview
          </a>
          <a className="side-nav__title" href="#step0">
            Step 0: Define “Non-Local” Precisely
          </a>
          <a className="side-nav__title" href="#step1">
            Step 1: Determine Addressable Market at Registration
          </a>
          <a className="indent" data-parent="step1" href="#step1-data-collection-options">
            A) Data Collection Options
          </a>
          <a className="indent" data-parent="step1" href="#step1-derivation-kpi-outputs">
            B) Derivation
          </a>
          <a className="indent" data-parent="step1" href="#step1-kpi-outputs">
            C) KPI Outputs
          </a>
          <a className="indent" data-parent="step1" href="#step1-kpi-breakdowns">
            D) Breakdowns
          </a>
          <a className="side-nav__title" href="#step2">
            Step 2: Connect Registration to Hotel Outcome
          </a>
          <a className="side-nav__title" href="#step3">
            Step 3: Website Measurement (View -&gt; Register -&gt; Book)
          </a>
          <a className="side-nav__title" href="#step4">
            Step 4: Data Model and Separation
          </a>
          <a className="side-nav__title" href="#step5">
            Step 5: Governance Deliverables
          </a>
          <a className="side-nav__title" href="#step6">
            Step 6: Technical Feasibility Blueprint
          </a>
          <a className="side-nav__title" href="#sequence">
            Suggested Implementation Sequence
          </a>
        </aside>

        <main className="main-content" role="main">
          <section className="section" id="overview">
            <div className="section__eyebrow">Project Plan</div>
            <h2 className="section__title section__title--lead">Project Overview</h2>
            <p>
              Purpose: quantify addressable demand (attendees with 3+ hour travel or explicit
              accommodation need) and calculate hotel capture rate, while minimizing collection and
              retention of personal data.
            </p>
            <p>
              Core design principle is derived-first analytics: convert inputs to minimal signals,
              keep row-level data briefly, and retain aggregated reporting for long-term analysis.
            </p>

            <div className="cds--callout cds--callout--info">
              <div className="cds--callout__title">Guiding Principles</div>
              <p>
                Data minimization, strict separation of operations and analytics, early aggregation,
                and avoiding tracking where possible.
              </p>
            </div>

            <div className="tile-grid">
              <div className="cds--tile">
                <div className="cds--tile__label">Primary KPI</div>
                <div className="cds--tile__value--small">Capture Rate</div>
                <div className="cds--tile__detail">hotel_capture_count / addressable_market_count</div>
              </div>
              <div className="cds--tile">
                <div className="cds--tile__label">Signal Model</div>
                <div className="cds--tile__value--small">Derived-Only</div>
                <div className="cds--tile__detail">Store band + flag, avoid raw location in analytics</div>
              </div>
              <div className="cds--tile">
                <div className="cds--tile__label">Row-Level Retention</div>
                <div className="cds--tile__value--small">30-90 days</div>
                <div className="cds--tile__detail">Then aggregate-only retention</div>
              </div>
              <div className="cds--tile">
                <div className="cds--tile__label">Small-Count Control</div>
                <div className="cds--tile__value--small">Suppression</div>
                <div className="cds--tile__detail">Merge or hide groups below threshold</div>
              </div>
            </div>
          </section>

          <section className="section" id="step0">
            <h2 className="section__title">Step 0: Define “Non-Local” Precisely</h2>
            <p>
              Make the 3+ hour rule defensible and consistent across events by fixing travel mode,
              origin definition, and output shape.
            </p>
            <div className="cds--callout cds--callout--success">
              <div className="cds--callout__title">Recommended Output Fields</div>
              <p>
                <code>travel_time_band</code> (0-1h, 1-3h, 3-6h, 6h+, unknown) and
                <code> is_addressable_for_hotel</code>.
              </p>
            </div>

            <div className="cds--structured-list">
              <div className="cds--structured-list__item">
                <div className="cds--structured-list__icon">1</div>
                <div>
                  <div className="cds--structured-list__title">Travel mode baseline</div>
                  <div className="cds--structured-list__desc">
                    Car (default), public transport, or best available.
                  </div>
                </div>
              </div>
              <div className="cds--structured-list__item">
                <div className="cds--structured-list__icon">2</div>
                <div>
                  <div className="cds--structured-list__title">Origin definition</div>
                  <div className="cds--structured-list__desc">
                    Home/work, nearest major town, or attendee stated origin.
                  </div>
                </div>
              </div>
              <div className="cds--structured-list__item">
                <div className="cds--structured-list__icon">3</div>
                <div>
                  <div className="cds--structured-list__title">Banded over binary</div>
                  <div className="cds--structured-list__desc">
                    Reduces false precision and re-identification risk.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="step1">
            <h2 className="section__title">Step 1: Determine Addressable Market at Registration</h2>
            <h3 className="section__subtitle" id="step1-data-collection-options">
              1A) Data Collection Options
            </h3>
            <div className="cds--data-table-wrapper">
              <table className="cds--data-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>What You Collect</th>
                    <th>Trade-Off</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ask directly</td>
                    <td>Need accommodation? Journey 3+ hours? (Yes/No/Not sure)</td>
                    <td>Most privacy-preserving, but self-report bias.</td>
                    <td>Primary</td>
                  </tr>
                  <tr>
                    <td>Coarse origin + derive</td>
                    <td>ZIP/postcode or city+country, converted immediately to travel band.</td>
                    <td>More consistent metric; stricter retention controls required.</td>
                    <td>Secondary</td>
                  </tr>
                  <tr>
                    <td>IP fallback</td>
                    <td>Only when fields skipped; truncate/discard IP quickly.</td>
                    <td>Higher GDPR/ePrivacy sensitivity.</td>
                    <td>Fallback only</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="section__subtitle" id="step1-derivation-kpi-outputs">
              B) Derivation
            </h3>
            <p>
              Analytics should store only derived fields: travel band, addressable flag, outcome,
              event_id, ticket_type, timestamp.
            </p>
            <h3 className="section__subtitle" id="step1-kpi-outputs">
              C) KPI Outputs
            </h3>
            <p>
              KPI outputs: <code>addressable_market_count</code>, <code>hotel_capture_count</code>,
              and <code>capture_rate</code>.
            </p>
            <h3 className="section__subtitle" id="step1-kpi-breakdowns">
              D) Breakdowns
            </h3>
            <p>
              Report those KPIs with band, ticket, and timing breakdowns.
            </p>
          </section>

          <section className="section" id="step2">
            <h2 className="section__title">Step 2: Connect Registration to Hotel Outcome</h2>
            <div className="cds--data-table-wrapper">
              <table className="cds--data-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Strength</th>
                    <th>Watch-Outs</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Direct add-on at checkout</td>
                    <td>Strong attribution, least tracking overhead.</td>
                    <td>Operational integration and inventory availability.</td>
                    <td className="text-positive">Highest</td>
                  </tr>
                  <tr>
                    <td>Unique booking link per registration</td>
                    <td>Low tracking and works post-checkout.</td>
                    <td>Prevent link sharing and exposed identifiers.</td>
                    <td>High</td>
                  </tr>
                  <tr>
                    <td>Post-registration email flow</td>
                    <td>Potential conversion uplift.</td>
                    <td>Lawful basis and unsubscribe handling.</td>
                    <td>Only if needed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="section" id="step3">
            <h2 className="section__title">Step 3: Website Measurement (View -&gt; Register -&gt; Book)</h2>
            <p>
              Recommended model is first-party, server-side event measurement with cohort reporting.
              Keep core KPI independent of non-essential cookies.
            </p>
            <div className="recommendation">
              <div className="recommendation__label">Recommended</div>
              <div className="recommendation__title">First-Party Event-Level Analytics</div>
              <p>
                Avoid third-party pixels by default. Gate optional/non-essential measurement behind
                consent where required.
              </p>
            </div>
          </section>

          <section className="section" id="step4">
            <h2 className="section__title">Step 4: Data Model and Separation</h2>
            <p>
              Keep clear purpose boundaries: operations PII stays in ticketing systems; analytics
              holds minimal derived records only.
            </p>
            <div className="cds--data-table-wrapper">
              <table className="cds--data-table">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Key Fields</th>
                    <th>Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>operations.registrations</td>
                    <td>registration_id, event_id, contact, payment, operational notes</td>
                    <td>Business/legal need</td>
                  </tr>
                  <tr>
                    <td>analytics.registration_signals</td>
                    <td>anon_user_key, event_id, travel band, addressable flag, timestamp</td>
                    <td>30-90 days row-level</td>
                  </tr>
                  <tr>
                    <td>analytics.hotel_outcomes</td>
                    <td>anon key or registration_id, booked_flag, booking_timestamp</td>
                    <td>30-90 days row-level</td>
                  </tr>
                  <tr>
                    <td>reporting.event_kpis</td>
                    <td>event-level counts, capture rate, band/ticket breakdowns</td>
                    <td>2-3 years aggregated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="section" id="step5">
            <h2 className="section__title">Step 5: Governance Deliverables</h2>
            <div className="cds--structured-list">
              <div className="cds--structured-list__item">
                <div className="cds--structured-list__icon">A</div>
                <div>
                  <div className="cds--structured-list__title">LIA</div>
                  <div className="cds--structured-list__desc">
                    Document purpose, necessity, balancing safeguards, and opt-out posture.
                  </div>
                </div>
              </div>
              <div className="cds--structured-list__item">
                <div className="cds--structured-list__icon">B</div>
                <div>
                  <div className="cds--structured-list__title">DPIA triggers</div>
                  <div className="cds--structured-list__desc">
                    Triggered more likely by systematic monitoring, extensive profiling, or risky
                    dataset combinations.
                  </div>
                </div>
              </div>
              <div className="cds--structured-list__item">
                <div className="cds--structured-list__icon">C</div>
                <div>
                  <div className="cds--structured-list__title">Vendor controls</div>
                  <div className="cds--structured-list__desc">
                    DPAs, logging defaults, subprocessors, transfer locations, and retention jobs.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="step6">
            <h2 className="section__title">Step 6: Technical Feasibility Blueprint</h2>
            <p>
              This plan is technically feasible if identity handoff, event contracts, and consent
              gates are explicit. Use first-party server-side event collection and avoid dependence
              on third-party cookies.
            </p>

            <h3 className="section__subtitle">6A) Event Script on Organizer Site</h3>
            <p>
              Embed a lightweight JavaScript loader on organizer pages. It should send page and
              funnel events to HotelMap using <code>navigator.sendBeacon</code> with
              <code> fetch</code> fallback.
            </p>
            <CodeBlock
              language="html"
              code={`<script
  async
  src="https://cdn.hotelmap.com/hm/v1.js"
  data-hm-event-id="ev_123"
  data-hm-endpoint="https://api.hotelmap.com/collect"
></script>`}
            />
            <CodeBlock
              language="javascript"
              code={`(() => {
  const s = document.currentScript;
  const eventId = s?.dataset.hmEventId;
  const endpoint = s?.dataset.hmEndpoint;
  const anonId = localStorage.hm_anon_id || (localStorage.hm_anon_id = crypto.randomUUID());

  function track(name, props = {}) {
    const body = JSON.stringify({ name, eventId, anonId, ts: Date.now(), props });
    if (navigator.sendBeacon) navigator.sendBeacon(endpoint, body);
    else fetch(endpoint, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "content-type": "application/json" }
    });
  }

  window.hotelmap = { track };
  track("page_view");
})();`}
            />

            <h3 className="section__subtitle">6B) Registration to Booking Identity Handoff</h3>
            <p>
              Use a signed short-lived token from registration to booking portal. Do not expose raw
              personal data in URLs or client-side storage.
            </p>
            <CodeBlock
              language="typescript"
              code={`import { SignJWT } from "jose";

const bookingToken = await new SignJWT({
  reg_ref: "hashed_registration_reference",
  event_id: "ev_123"
})
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("48h")
  .sign(secret);`}
            />

            <h3 className="section__subtitle">6C) Server Event Contract and Filtering</h3>
            <p>
              Keep a strict schema for <code>view</code>, <code>register</code>, and
              <code> book</code> events. Core KPI should count only users that are registered and
              addressable.
            </p>
            <CodeBlock
              language="json"
              code={`{
  "event_name": "portal_view",
  "event_id": "ev_123",
  "anon_id": "uuid",
  "registration_status": "registered",
  "is_addressable_for_hotel": true,
  "travel_time_band": "3-6h",
  "ticket_type": "delegate",
  "idempotency_key": "uuid",
  "ts": "2026-02-12T10:00:00.000Z"
}`}
            />

            <h3 className="section__subtitle">6D) Recommended Libraries and Services</h3>
            <p>
              Runtime/data: <code>zod</code> for payload validation, <code>jose</code> for signed
              tokens, <code>pino</code> for structured logs, and <code>Prisma</code> or
              <code> Drizzle</code> with Postgres for storage.
            </p>
            <p>
              Reliability: queue and retries with <code>BullMQ</code> and Redis for resilient
              ingestion.
            </p>
            <p>
              Distance derivation: server-side travel-time lookup via a routing API (for example
              Mapbox or Google Routes), then store only <code>travel_time_band</code> and
              <code> is_addressable_for_hotel</code> in analytics.
            </p>

            <div className="cds--callout cds--callout--error">
              <div className="cds--callout__title">Core Feasibility Constraint</div>
              <p>
                Do not design attribution around third-party cookies. Use first-party identifiers
                and signed server handoff to maintain continuity across registration and booking.
              </p>
            </div>
          </section>

          <section className="section" id="sequence">
            <h2 className="section__title">Suggested Implementation Sequence</h2>
            <p>1. Add registration questions + derived fields.</p>
            <p>2. Implement attribution via add-on or unique links.</p>
            <p>3. Build KPI dashboard for addressable market and capture.</p>
            <p>4. Add first-party server-side funnel events.</p>
            <p>5. Implement signed registration-to-booking token handoff.</p>
            <p>6. Add personalization only after governance review.</p>
          </section>
        </main>
      </div>

      <footer className="page-footer" role="contentinfo">
        <div className="cds--grid">
          <div className="footer__col">
            <div className="footer__heading">Document</div>
            <div className="footer__text">Privacy-First Project Map v1.0</div>
            <div className="footer__text">12 February 2026</div>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Author</div>
            <div className="footer__text">magee @ HotelMap</div>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Classification</div>
            <div className="footer__text">Internal</div>
            <div className="footer__text">Privacy-first analytics design</div>
          </div>
          <div className="footer__col">
            <div className="footer__heading">HotelMap</div>
            <div className="footer__text">2026 HotelMap Ltd</div>
          </div>
        </div>
      </footer>
    </>
  );
}
