import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DocumentFooter,
  DocumentHeader,
  DocumentHero,
  DocumentLayout,
  DocumentMain,
  DocumentPage,
  DocumentSection,
  DocumentSideNav,
} from "../components/document-template";
import { projects, documents } from "../../content/index.generated";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const footerColumns = [
  { heading: "HotelMap", lines: ["2026 HotelMap Ltd"] },
];

type Props = { params: Promise<{ project: string }> };

export async function generateStaticParams() {
  return projects.map((project) => ({ project }));
}

export default async function ProjectPage({ params }: Props) {
  const { project } = await params;
  if (!projects.includes(project)) notFound();

  const docs = documents[project] ?? [];
  const navItems = docs.map((doc) => ({
    id: doc,
    label: slugToTitle(doc),
    href: `/${project}/${doc}`,
  }));

  return (
    <DocumentPage>
      <DocumentHeader
        department="Design Engineering"
        logoAlt="HotelMap"
        logoSrc="/site-assets/hotelmap-logo.svg"
        navLinks={[
          { href: "/", label: "Projects", active: false },
          { href: `/${project}`, label: slugToTitle(project), active: true },
        ]}
      />

      <DocumentHero
        eyebrow={`Project / ${slugToTitle(project)}`}
        title={slugToTitle(project)}
        subtitle="Documents in this project."
      />

      <DocumentLayout
        sideNav={
          <DocumentSideNav
            heading="Documents"
            items={navItems}
            ariaLabel="Document list"
          />
        }
      >
        <DocumentMain>
          <DocumentSection id="documents" title="Documents" titleVariant="lead">
            <p>Select a document to view its content.</p>
            <ul className="doc-list">
              {docs.map((doc) => (
                <li key={doc}>
                  <Link
                    href={`/${project}/${doc}`}
                    className="doc-list__link"
                  >
                    {slugToTitle(doc)}
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
