import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoryRedirect({ params }: PageProps) {
  const { slug } = await params;
  const [categorySlug, subcategorySlug] = slug;
  const search = new URLSearchParams();
  if (categorySlug) search.set("cat", categorySlug);
  if (subcategorySlug) search.set("sub", subcategorySlug);
  const qs = search.toString();
  redirect(qs ? `/?${qs}` : "/");
}
