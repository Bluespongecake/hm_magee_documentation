import { notFound } from "next/navigation";
import { projects, documents, getDocument } from "../../../content/index.generated";

type Props = { params: Promise<{ project: string; document: string }> };

export async function generateStaticParams() {
  const params: { project: string; document: string }[] = [];
  for (const project of projects) {
    const docs = documents[project] ?? [];
    for (const doc of docs) {
      params.push({ project, document: doc });
    }
  }
  return params;
}

export default async function DocumentPage({ params }: Props) {
  const { project, document } = await params;

  if (!projects.includes(project) || !documents[project]?.includes(document)) {
    notFound();
  }

  const Content = await getDocument(project, document);
  if (!Content) notFound();

  return <Content />;
}
