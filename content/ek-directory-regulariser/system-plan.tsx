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
  StructuredList,
  TileGrid,
  type DocumentMetaEntry,
  type DocumentNavItem,
  type FooterColumnData,
  type StructuredListItem,
} from "../../app/components/document-template";

const navItems: DocumentNavItem[] = [
  { id: "problem", label: "The Problem" },
  { id: "approach", label: "The Approach" },
  { id: "prototype", label: "The Prototype" },
];

const heroMeta: DocumentMetaEntry[] = [
  { label: "Date", value: "27 February 2026" },
  { label: "Author", value: "Max" },
  { label: "Status", value: "Prototype" },
];

const footerColumns: FooterColumnData[] = [
  { heading: "Document", lines: ["EK Directory Regulariser", "27 February 2026"] },
  { heading: "Author", lines: ["Max"] },
  { heading: "Ekorn", lines: ["2026"] },
];

const approachSteps: StructuredListItem[] = [
  {
    icon: "1",
    title: "Index the directory",
    description:
      "AI agents crawl every file, extract text from PDFs, spreadsheets, and Word documents, then summarise each one and build a knowledge graph mapping the relationships between files, clients, and data categories.",
  },
  {
    icon: "2",
    title: "Answer questions",
    description:
      "Ask a natural-language question — \"What has John Smith invested?\" — and the system navigates the graph to find the right files, extracts the data, and returns a sourced answer.",
  },
  {
    icon: "3",
    title: "Build client profiles",
    description:
      "For every discovered client, automatically pull together a structured dossier — personal details, KYC, financials, accounts, adviser relationship — from every document that mentions them.",
  },
];

export default function DocumentContent() {
  return (
    <DocumentPage>
      <DocumentHeader
        department="Ekorn"
        logoAlt="HotelMap"
        logoSrc="/site-assets/hotelmap-logo.svg"
        navLinks={[{ href: "/", label: "Home" }]}
      />

      <DocumentHero
        eyebrow="Ekorn / IFA Roll-Up"
        title="EK Directory Regulariser"
        subtitle="AI-powered extraction of client information from IFA document directories."
        meta={heroMeta}
      />

      <DocumentLayout sideNav={<DocumentSideNav items={navItems} />}>
        <DocumentMain>
          {/* ── The Problem ── */}
          <DocumentSection id="problem" title="The Problem" titleVariant="lead" eyebrow="Context">
            <p>
              When Ekorn acquires an IFA, the client data arrives as a directory of documents —
              PDFs, spreadsheets, Word files — structured differently by every firm. Building a
              complete picture of each client means someone manually opening dozens of files,
              finding the right sheets and tables, and copying data into a master record. It takes
              days and is prone to error.
            </p>
            <p>
              An earlier attempt at a spreadsheet regulariser showed the pain was real but hit a
              ceiling: the data lives across too many file types and structures to solve at the
              spreadsheet level alone. This project takes a different approach.
            </p>

            <TileGrid>
              <MetricTile label="Time" value="Days per acquisition" detail="Manual document trawling" size="small" />
              <MetricTile label="Files" value="PDFs · Excel · Word" detail="Inconsistent structures across firms" size="small" />
              <MetricTile label="Risk" value="Human error" detail="Missed files, transcription mistakes" size="small" />
            </TileGrid>
          </DocumentSection>

          {/* ── The Approach ── */}
          <DocumentSection id="approach" title="The Approach">
            <p>
              Instead of forcing heterogeneous documents into a single schema, treat the entire
              directory as a knowledge problem. Use AI agents to read everything, understand what
              each file contains, and answer questions or build client profiles on demand.
            </p>

            <StructuredList items={approachSteps} />

            <Callout title="Human role" variant="info">
              The system does the extraction. Humans review and confirm — especially where it
              flags conflicts (e.g. two documents reporting different dates of birth for the
              same client).
            </Callout>
          </DocumentSection>

          {/* ── The Prototype ── */}
          <DocumentSection id="prototype" title="The Prototype">
            <p>
              A working prototype with a Next.js frontend and a Python backend powered by
              Anthropic&apos;s Claude API. Point it at a folder, trigger ingestion from the
              browser, then browse clients and their extracted profiles.
            </p>

            <DocumentSectionSubtitle>System overview</DocumentSectionSubtitle>
            <p>
              Under the hood, two phases of agents do the work. Phase 1 runs once per directory
              and builds the index; Phase 2 runs per question or per client profile.
            </p>
            <CodeBlock
              language="typescript"
              code={`┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: INGESTION & INDEXING                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  Crawler  ──▶  Extractors  ──▶  Summariser  ──▶  Graph Builder           │
│              (PDF/Excel/Word)    (Claude)                                │
│       │              │                │                │                 │
│       ▼              ▼                ▼                ▼                 │
│  File inventory   Raw text      File & folder    Knowledge graph          │
│                   + tables       summaries       (persisted)             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: QUERY & RETRIEVAL                                              │
├─────────────────────────────────────────────────────────────────────────┤
│  Query Router  ──▶  Navigator  ──▶  Extractor  ──▶  Aggregator             │
│                       (graph)       (Claude)                             │
│       │                  │              │              │                  │
│       ▼                  ▼              ▼              ▼                  │
│  Structured intent   Candidate    Field values    Client report          │
│                      file paths   + confidence    + conflicts             │
├─────────────────────────────────────────────────────────────────────────┤
│  PROFILE BUILDER:  Discover clients → Extract full profile → Merge       │
│                    with conflict detection → Structured dossier           │
└─────────────────────────────────────────────────────────────────────────┘`}
            />

            <DataTable
              headers={["Feature", "What it does"]}
              rows={[
                ["Pipeline runner", "Trigger ingestion and profile building from the browser with real-time progress streaming"],
                ["Client profiles", "Browse discovered clients and view structured dossiers — personal, KYC, financial, accounts"],
                ["Document browser", "See every indexed file and its AI-generated summary"],
                ["Knowledge graph", "Visual map of relationships between files, clients, and data categories"],
                ["Conflict detection", "Flags disagreements across sources for human review"],
              ]}
            />

            <DataTable
              headers={["Component", "Technology"]}
              rows={[
                ["AI", "Anthropic Claude API"],
                ["Document extraction", "pdfplumber, pandas, python-docx"],
                ["Knowledge graph", "networkx"],
                ["Frontend", "Next.js, React, TypeScript"],
                ["Backend", "Python, asyncio"],
              ]}
            />

            <Callout title="Privacy" variant="success">
              All documents stay on-premises. Only extracted text snippets are sent to the Claude
              API — never raw files.
            </Callout>
          </DocumentSection>
        </DocumentMain>
      </DocumentLayout>

      <DocumentFooter columns={footerColumns} />
    </DocumentPage>
  );
}
