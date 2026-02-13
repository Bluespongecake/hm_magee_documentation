import {
  Callout,
  CodeBlock,
  DataTable,
  DocumentFooter,
  DocumentHeader,
  DocumentHero,
  DocumentLayout,
  DocumentMain,
  DocumentPage,
  DocumentSection,
  DocumentSectionSubtitle,
  DocumentSideNav,
  MetricTile,
  RecommendationCard,
  StructuredList,
  TileGrid,
  type DocumentMetaEntry,
  type DocumentNavItem,
  type FooterColumnData,
  type StructuredListItem,
} from "./components/document-template";

const navItems: DocumentNavItem[] = [
  { id: "overview", label: "Project Overview" },
  { id: "step0", label: "Step 0: Define “Non-Local” Precisely" },
  { id: "step1", label: "Step 1: Determine Addressable Market at Registration" },
  {
    id: "step1-data-collection-options",
    label: "A) Data Collection Options",
    parentId: "step1",
    variant: "child",
  },
  { id: "step1-derivation-kpi-outputs", label: "B) Derivation", parentId: "step1", variant: "child" },
  { id: "step1-kpi-outputs", label: "C) KPI Outputs", parentId: "step1", variant: "child" },
  { id: "step1-kpi-breakdowns", label: "D) Breakdowns", parentId: "step1", variant: "child" },
  { id: "step2", label: "Step 2: Connect Registration to Hotel Outcome" },
  { id: "step3", label: "Step 3: Website Measurement (View -> Register -> Book)" },
  { id: "step4", label: "Step 4: Data Model and Separation" },
  { id: "step5", label: "Step 5: Governance Deliverables" },
  { id: "step6", label: "Step 6: Technical Feasibility Blueprint" },
  { id: "sequence", label: "Suggested Implementation Sequence" },
];

const heroMeta: DocumentMetaEntry[] = [
  { label: "Version", value: "1.0" },
  { label: "Date", value: "12 February 2026" },
  { label: "Author", value: "magee @ HotelMap" },
  { label: "Department", value: "Design Engineering" },
];

const footerColumns: FooterColumnData[] = [
  {
    heading: "Document",
    lines: ["Privacy-First Project Map v1.0", "12 February 2026"],
  },
  {
    heading: "Author",
    lines: ["magee @ HotelMap"],
  },
  {
    heading: "Classification",
    lines: ["Internal", "Privacy-first analytics design"],
  },
  {
    heading: "HotelMap",
    lines: ["2026 HotelMap Ltd"],
  },
];

const definitionListItems: StructuredListItem[] = [
  {
    icon: "1",
    title: "Travel mode baseline",
    description: "Car (default), public transport, or best available.",
  },
  {
    icon: "2",
    title: "Origin definition",
    description: "Home/work, nearest major town, or attendee stated origin.",
  },
  {
    icon: "3",
    title: "Banded over binary",
    description: "Reduces false precision and re-identification risk.",
  },
];

const governanceListItems: StructuredListItem[] = [
  {
    icon: "A",
    title: "LIA",
    description: "Document purpose, necessity, balancing safeguards, and opt-out posture.",
  },
  {
    icon: "B",
    title: "DPIA triggers",
    description:
      "Triggered more likely by systematic monitoring, extensive profiling, or risky dataset combinations.",
  },
  {
    icon: "C",
    title: "Vendor controls",
    description:
      "DPAs, logging defaults, subprocessors, transfer locations, and retention jobs.",
  },
];

export default function HomePage() {
  return (
    <DocumentPage>
      <DocumentHeader
        department="Design Engineering"
        logoAlt="HotelMap"
        logoSrc="/site-assets/hotelmap-logo.svg"
        navLinks={[{ href: "/", label: "Overview", active: true }]}
      />

      <DocumentHero
        eyebrow="Project Documentation / Privacy-First Measurement"
        title="Hotel Capture Measurement Plan"
        subtitle="Implementation blueprint for measuring addressable market and hotel capture with minimal personal data. Scope covers registration, attribution, analytics, and governance controls."
        meta={heroMeta}
      />

      <DocumentLayout sideNav={<DocumentSideNav items={navItems} />}>
        <DocumentMain>
          <DocumentSection id="overview" title="Project Overview" titleVariant="lead" eyebrow="Project Plan">
            <p>
              Purpose: quantify addressable demand (attendees with 3+ hour travel or explicit
              accommodation need) and calculate hotel capture rate, while minimizing collection and
              retention of personal data.
            </p>
            <p>
              Core design principle is derived-first analytics: convert inputs to minimal signals,
              keep row-level data briefly, and retain aggregated reporting for long-term analysis.
            </p>

            <Callout title="Guiding Principles" variant="info">
              Data minimization, strict separation of operations and analytics, early aggregation,
              and avoiding tracking where possible.
            </Callout>

            <TileGrid>
              <MetricTile
                label="Primary KPI"
                value="Capture Rate"
                detail="hotel_capture_count / addressable_market_count"
                size="small"
              />
              <MetricTile
                label="Signal Model"
                value="Derived-Only"
                detail="Store band + flag, avoid raw location in analytics"
                size="small"
              />
              <MetricTile
                label="Row-Level Retention"
                value="30-90 days"
                detail="Then aggregate-only retention"
                size="small"
              />
              <MetricTile
                label="Small-Count Control"
                value="Suppression"
                detail="Merge or hide groups below threshold"
                size="small"
              />
            </TileGrid>
          </DocumentSection>

          <DocumentSection id="step0" title="Step 0: Define “Non-Local” Precisely">
            <p>
              Make the 3+ hour rule defensible and consistent across events by fixing travel mode,
              origin definition, and output shape.
            </p>

            <Callout title="Recommended Output Fields" variant="success">
              <>
                <code>travel_time_band</code> (0-1h, 1-3h, 3-6h, 6h+, unknown) and
                <code> is_addressable_for_hotel</code>.
              </>
            </Callout>

            <StructuredList items={definitionListItems} />
          </DocumentSection>

          <DocumentSection id="step1" title="Step 1: Determine Addressable Market at Registration">
            <DocumentSectionSubtitle id="step1-data-collection-options">
              1A) Data Collection Options
            </DocumentSectionSubtitle>

            <DataTable
              headers={["Option", "What You Collect", "Trade-Off", "Priority"]}
              rows={[
                [
                  "Ask directly",
                  "Need accommodation? Journey 3+ hours? (Yes/No/Not sure)",
                  "Most privacy-preserving, but self-report bias.",
                  "Primary",
                ],
                [
                  "Coarse origin + derive",
                  "ZIP/postcode or city+country, converted immediately to travel band.",
                  "More consistent metric; stricter retention controls required.",
                  "Secondary",
                ],
                [
                  "IP fallback",
                  "Only when fields skipped; truncate/discard IP quickly.",
                  "Higher GDPR/ePrivacy sensitivity.",
                  "Fallback only",
                ],
              ]}
            />

            <DocumentSectionSubtitle id="step1-derivation-kpi-outputs">B) Derivation</DocumentSectionSubtitle>
            <p>
              Analytics should store only derived fields: travel band, addressable flag, outcome,
              event_id, ticket_type, timestamp.
            </p>

            <DocumentSectionSubtitle id="step1-kpi-outputs">C) KPI Outputs</DocumentSectionSubtitle>
            <p>
              KPI outputs: <code>addressable_market_count</code>, <code>hotel_capture_count</code>,
              and <code>capture_rate</code>.
            </p>

            <DocumentSectionSubtitle id="step1-kpi-breakdowns">D) Breakdowns</DocumentSectionSubtitle>
            <p>Report those KPIs with band, ticket, and timing breakdowns.</p>
          </DocumentSection>

          <DocumentSection id="step2" title="Step 2: Connect Registration to Hotel Outcome">
            <DataTable
              headers={["Option", "Strength", "Watch-Outs", "Priority"]}
              rows={[
                [
                  "Direct add-on at checkout",
                  "Strong attribution, least tracking overhead.",
                  "Operational integration and inventory availability.",
                  <span className="text-positive" key="highest-priority">
                    Highest
                  </span>,
                ],
                [
                  "Unique booking link per registration",
                  "Low tracking and works post-checkout.",
                  "Prevent link sharing and exposed identifiers.",
                  "High",
                ],
                [
                  "Post-registration email flow",
                  "Potential conversion uplift.",
                  "Lawful basis and unsubscribe handling.",
                  "Only if needed",
                ],
              ]}
            />
          </DocumentSection>

          <DocumentSection id="step3" title="Step 3: Website Measurement (View -> Register -> Book)">
            <p>
              Recommended model is first-party, server-side event measurement with cohort reporting.
              Keep core KPI independent of non-essential cookies.
            </p>

            <RecommendationCard title="First-Party Event-Level Analytics" label="Recommended">
              Avoid third-party pixels by default. Gate optional/non-essential measurement behind
              consent where required.
            </RecommendationCard>
          </DocumentSection>

          <DocumentSection id="step4" title="Step 4: Data Model and Separation">
            <p>
              Keep clear purpose boundaries: operations PII stays in ticketing systems; analytics
              holds minimal derived records only.
            </p>

            <DataTable
              headers={["Layer", "Key Fields", "Retention"]}
              rows={[
                [
                  "operations.registrations",
                  "registration_id, event_id, contact, payment, operational notes",
                  "Business/legal need",
                ],
                [
                  "analytics.registration_signals",
                  "anon_user_key, event_id, travel band, addressable flag, timestamp",
                  "30-90 days row-level",
                ],
                [
                  "analytics.hotel_outcomes",
                  "anon key or registration_id, booked_flag, booking_timestamp",
                  "30-90 days row-level",
                ],
                [
                  "reporting.event_kpis",
                  "event-level counts, capture rate, band/ticket breakdowns",
                  "2-3 years aggregated",
                ],
              ]}
            />
          </DocumentSection>

          <DocumentSection id="step5" title="Step 5: Governance Deliverables">
            <StructuredList items={governanceListItems} />
          </DocumentSection>

          <DocumentSection id="step6" title="Step 6: Technical Feasibility Blueprint">
            <p>
              This plan is technically feasible if identity handoff, event contracts, and consent
              gates are explicit. Use first-party server-side event collection and avoid dependence
              on third-party cookies.
            </p>

            <DocumentSectionSubtitle>6A) Event Script on Organizer Site</DocumentSectionSubtitle>
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

            <DocumentSectionSubtitle>6B) Registration to Booking Identity Handoff</DocumentSectionSubtitle>
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

            <DocumentSectionSubtitle>6C) Server Event Contract and Filtering</DocumentSectionSubtitle>
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

            <DocumentSectionSubtitle>6D) Recommended Libraries and Services</DocumentSectionSubtitle>
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

            <Callout title="Core Feasibility Constraint" variant="error">
              Do not design attribution around third-party cookies. Use first-party identifiers and
              signed server handoff to maintain continuity across registration and booking.
            </Callout>
          </DocumentSection>

          <DocumentSection id="sequence" title="Suggested Implementation Sequence">
            <p>1. Add registration questions + derived fields.</p>
            <p>2. Implement attribution via add-on or unique links.</p>
            <p>3. Build KPI dashboard for addressable market and capture.</p>
            <p>4. Add first-party server-side funnel events.</p>
            <p>5. Implement signed registration-to-booking token handoff.</p>
            <p>6. Add personalization only after governance review.</p>
          </DocumentSection>
        </DocumentMain>
      </DocumentLayout>

      <DocumentFooter columns={footerColumns} />
    </DocumentPage>
  );
}
