import Link from "next/link";
import {
  DocumentFooter,
  DocumentHeader,
  DocumentHero,
  DocumentLayout,
  DocumentMain,
  DocumentPage,
  DocumentSection,
  DocumentSideNav,
} from "./components/document-template";
import { projects } from "../content/index.generated";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const navItems = projects.map((project) => ({
  id: project,
  label: slugToTitle(project),
  href: `/${project}`,
}));

const footerColumns = [
  { heading: "HotelMap", lines: ["2026 HotelMap Ltd"] },
];

export default function HomePage() {
  return (
    <DocumentPage>
      <DocumentHeader
        department="Design Engineering"
        logoAlt="HotelMap"
        logoSrc="/site-assets/hotelmap-logo.svg"
        navLinks={[{ href: "/", label: "Projects", active: true }]}
      />

      <DocumentHero
        eyebrow="Documentation"
        title="Projects"
        subtitle="Select a project to view its documents. Structure mirrors the content/ folder layout."
      />

      <DocumentLayout
        sideNav={
          <DocumentSideNav
            heading="Projects"
            items={navItems}
            ariaLabel="Project list"
          />
        }
      >
        <DocumentMain>
          <DocumentSection id="projects" title="Projects" titleVariant="lead">
            <p>
              Documentation is organized by project. Each project contains one or
              more documents.
            </p>
            <ul className="doc-list">
              {projects.map((project) => (
                <li key={project}>
                  <Link href={`/${project}`} className="doc-list__link">
                    {slugToTitle(project)}
                  </Link>
                </li>
              ))}
            </ul>
          </DocumentSection>
        </DocumentMain>
      </DocumentLayout>

      <DocumentFooter columns={footerColumns} />
    </DocumentPage>
  );
}
