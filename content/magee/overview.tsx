/**
 * Document content file.
 *
 * RULES (see AGENTS.md):
 * - Only import from ../../app/components/document-template
 */

import {
  DocumentFooter,
  DocumentHeader,
  DocumentHero,
  DocumentLayout,
  DocumentMain,
  DocumentPage,
  DocumentSection,
  DocumentSideNav,
} from "../../app/components/document-template";

const navItems = [{ id: "overview", label: "Overview" }];

const heroMeta = [
  { label: "Project", value: "Hotel Capture" },
  { label: "Type", value: "Overview" },
];

const footerColumns = [
  { heading: "HotelMap", lines: ["2026 HotelMap Ltd"] },
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
        eyebrow="Hotel Capture"
        title="Project Overview"
        subtitle="Documentation for the Hotel Capture measurement and analytics project."
        meta={heroMeta}
      />

      <DocumentLayout sideNav={<DocumentSideNav items={navItems} />}>
        <DocumentMain>
          <DocumentSection id="overview" title="Overview">
            <p>
              This project contains documentation for the Hotel Capture measurement plan,
              including the implementation blueprint for privacy-first analytics.
            </p>
          </DocumentSection>
        </DocumentMain>
      </DocumentLayout>

      <DocumentFooter columns={footerColumns} />
    </DocumentPage>
  );
}
