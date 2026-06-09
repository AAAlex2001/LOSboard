export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ContactsPageView } from "@/src/widgets/contacts-page";
import { getContentPage } from "@/src/entities/content";

export default async function ContactsPage() {
  const [main, data, hours] = await Promise.all([
    getContentPage("contacts").catch(() => null),
    getContentPage("contacts-data").catch(() => null),
    getContentPage("contacts-hours").catch(() => null),
  ]);
  if (!main) {
    notFound();
  }

  return (
    <ContactsPageView
      title={main.title}
      intro={main.body}
      dataBlock={data?.body ?? ""}
      hoursBlock={hours?.body ?? ""}
    />
  );
}
