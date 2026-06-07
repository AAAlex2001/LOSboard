export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { DocDetailPageView } from "@/src/widgets/doc-detail-page";
import { getContentPage } from "@/src/entities/content";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  if (slug.startsWith("pricing") || slug === "contacts") {
    notFound();
  }
  const page = await getContentPage(slug).catch(() => null);

  if (!page) {
    notFound();
  }

  return <DocDetailPageView title={page.title} body={page.body} />;
}
