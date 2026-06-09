export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ContactsPageView } from "@/src/widgets/contacts-page";
import { getContentPage } from "@/src/entities/content";

export default async function ContactsPage() {
  const page = await getContentPage("contacts").catch(() => null);
  if (!page) {
    notFound();
  }

  return <ContactsPageView title={page.title} body={page.body} />;
}
