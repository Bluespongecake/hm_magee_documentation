/**
 * Document content file.
 *
 * RULES (see AGENTS.md):
 * - Only import from ../../app/components/document-template
 * - Only use predefined components and design-token-based classes (e.g. text-positive, text-negative)
 * - No component definitions, inline styles, or raw color/layout values
 * - This file is composition only: data + one default export
 */

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
} from "../../app/components/document-template";

const navItems: DocumentNavItem[] = [
  { id: "overview", label: "Project Overview" },
  { id: "step0", label: "Step 0: Travel Time as Primary Metric" },
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
    title: "Travel time is the primary derived metric",
    description:
      "Compute travel_time_minutes from attendee origin to the full event address as the canonical output. Store this figure, not a boolean.",
  },
  {
    icon: "2",
    title: '"Non-local / addressable" is a secondary interpretation',
    description:
      "Apply a configurable threshold to travel_time_minutes to derive is_addressable_for_hotel. Thresholds differ by region (e.g. US ≥ 5h, UK/EU ≥ 3h); record which was applied at derivation time.",
  },
  {
    icon: "3",
    title: "Banded over binary",
    description:
      "Expose travel_time_band (0–1h, 1–3h, 3–5h, 5h+, unknown) for reporting. Reduces false precision and re-identification risk while preserving segmentation flexibility.",
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

export default function DocumentContent() {
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
                detail="Store travel time + band + flag, avoid raw location in analytics"
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

          <DocumentSection id="step0" title="Step 0: Travel Time as Primary Metric">
            <p>
              The primary derived metric is <code>travel_time_minutes</code> from attendee origin
              to the full event address. "Non-local" and "addressable for hotel" are secondary,
              configurable interpretations of that travel time — a threshold applied per region
              (e.g. US ≥ 5h, UK/EU ≥ 3h). Storing only a boolean makes cross-event and
              cross-country comparisons hard and masks the impact of threshold changes over time.
            </p>

            <Callout title="Why we store travel time (not just a flag)" variant="info">
              <>
                <p>
                  <strong>Stable comparisons.</strong> Travel time bands allow consistent
                  cross-event and cross-country analysis; a single boolean flag cannot.
                </p>
                <p>
                  <strong>Future-proof thresholds.</strong> If the US threshold changes from 5h to
                  4h, historical reporting stays valid because the underlying travel time is stored.
                </p>
                <p>
                  <strong>Richer segmentation.</strong> Bands (0–1h, 1–3h, 3–5h, 5h+) unlock
                  demand-distance curves and venue-comparison reports that a binary flag cannot
                  support.
                </p>
              </>
            </Callout>

            <Callout title="Recommended Output Fields" variant="success">
              <>
                <code>travel_time_minutes</code> (primary), <code>travel_time_band</code>{" "}
                (0–1h, 1–3h, 3–5h, 5h+, unknown), and{" "}
                <code>is_addressable_for_hotel</code> (derived from travel time + threshold config).
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
              Derive early, store minimal. Compute <code>travel_time_minutes</code> as soon as
              origin data is available — at registration submission, booking checkout, or server
              ingestion. Immediately derive <code>travel_time_band</code> and{" "}
              <code>is_addressable_for_hotel</code> from the result. Do not persist raw origin
              inputs (IP address, full postal address) in analytics tables once these travel-time
              fields are derived. Record the threshold and calculation version so the boolean is
              always reproducible from stored travel time and threshold config.
            </p>

            <DataTable
              headers={["Field", "Type", "Notes"]}
              rows={[
                [
                  "travel_time_minutes",
                  "integer (nullable)",
                  "Primary derived metric. Null if origin unavailable.",
                ],
                ["travel_time_band", "enum", "0–1h | 1–3h | 3–5h | 5h+ | unknown"],
                [
                  "is_addressable_for_hotel",
                  "boolean",
                  "Derived: travel_time_minutes ≥ threshold_minutes_applied.",
                ],
                [
                  "threshold_minutes_applied",
                  "integer",
                  "Threshold used at derivation time (e.g. 300 for US 5h, 180 for UK/EU 3h).",
                ],
                [
                  "travel_calc_version",
                  "string",
                  "Version of routing or heuristic method used (e.g. v1.2). Required for reproducibility.",
                ],
                ["origin_source", "enum", "registration_form | ip_fallback | stated | unknown"],
                ["origin_confidence", "enum", "high | medium | low"],
              ]}
            />

            <DocumentSectionSubtitle id="step1-kpi-outputs">C) KPI Outputs</DocumentSectionSubtitle>
            <p>
              Primary KPI outputs: <code>addressable_market_count</code>,{" "}
              <code>hotel_capture_count</code>, and <code>capture_rate</code>. Additionally report
              the distribution of attendees by <code>travel_time_band</code> to surface demand
              patterns and avoid relying on a single brittle "% non-local" figure. Addressable
              market counts should be calculated by applying the configured threshold to stored
              travel time, not from a stored boolean alone.
            </p>

            <DocumentSectionSubtitle id="step1-kpi-breakdowns">D) Breakdowns</DocumentSectionSubtitle>
            <p>
              Report KPIs broken down by <code>travel_time_band</code> (stacked bar or table),
              ticket type, and event timing. Include <code>origin_source</code> and{" "}
              <code>origin_confidence</code> as secondary dimensions to show data-quality context
              alongside the distribution.
            </p>
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
                  "anon_user_key, event_id, travel_time_minutes, travel_time_band, is_addressable_for_hotel, threshold_minutes_applied, travel_calc_version, origin_source, origin_confidence, ticket_type, timestamp",
                  "30-90 days row-level",
                ],
                [
                  "analytics.hotel_outcomes",
                  "anon key or registration_id, booked_flag, booking_timestamp",
                  "30-90 days row-level",
                ],
                [
                  "reporting.event_kpis",
                  "event-level counts, capture rate, travel_time_band distribution, band/ticket breakdowns",
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
  "travel_time_minutes": 210,
  "travel_time_band": "3-5h",
  "is_addressable_for_hotel": true,
  "threshold_minutes_applied": 180,
  "travel_calc_version": "v1.2",
  "origin_source": "registration_form",
  "origin_confidence": "high",
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
              Travel-time derivation: compute <code>travel_time_minutes</code> server-side at
              ingestion using a routing API (e.g. Mapbox Matrix API or Google Routes) as the
              canonical method, with a straight-line heuristic fallback (haversine + regional speed
              factor) when the API is unavailable. Record the method used in{" "}
              <code>travel_calc_version</code> so future routing changes do not invalidate
              historical comparisons. Store only the derived fields in analytics — never the raw
              coordinates or postal codes used for the lookup.
            </p>

            <Callout title="Core Feasibility Constraint" variant="error">
              Do not design attribution around third-party cookies. Use first-party identifiers and
              signed server handoff to maintain continuity across registration and booking.
            </Callout>
          </DocumentSection>

          <DocumentSection id="sequence" title="Suggested Implementation Sequence">
            <p>1. Add registration questions + derived fields (direct-ask and coarse origin).</p>
            <p>
              2. <strong>Implement travel-time derivation pipeline.</strong> At ingestion (registration
              and booking events), call the routing API, derive <code>travel_time_minutes</code>,{" "}
              <code>travel_time_band</code>, and <code>is_addressable_for_hotel</code>, and persist
              these fields with <code>threshold_minutes_applied</code> and{" "}
              <code>travel_calc_version</code>. All downstream reporting builds on these stored
              values.
            </p>
            <p>3. Implement attribution via add-on or unique links.</p>
            <p>4. Build KPI dashboard: addressable market, capture rate, and travel-time band distribution.</p>
            <p>5. Add first-party server-side funnel events.</p>
            <p>6. Implement signed registration-to-booking token handoff.</p>
            <p>7. Add personalization only after governance review.</p>
          </DocumentSection>
        </DocumentMain>
      </DocumentLayout>

      <DocumentFooter columns={footerColumns} />
    </DocumentPage>
  );
}
