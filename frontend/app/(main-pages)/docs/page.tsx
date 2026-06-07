export const dynamic = "force-dynamic";

import { DocsPageView } from "@/src/widgets/docs-page";
import { listContentPages } from "@/src/entities/content";

export default async function DocsPage() {
  const items = (await listContentPages().catch(() => [])).filter(
    (item) => !item.slug.startsWith("pricing") && item.slug !== "contacts",
  );

  return <DocsPageView items={items} />;
}
