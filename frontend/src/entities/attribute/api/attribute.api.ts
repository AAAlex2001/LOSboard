import { config } from "@/src/shared/config/config";
import { apiJson } from "@/src/shared/lib/http";

export type AttributeKind = "text" | "number" | "select" | "boolean";

export interface Attribute {
  id: number;
  name: string;
  key: string;
  kind: AttributeKind;
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
}

export async function getAttributes(
  params: { categoryId?: number; subcategoryId?: number; signal?: AbortSignal }
): Promise<Attribute[]> {
  const search = new URLSearchParams();
  if (params.categoryId != null) search.set("category_id", String(params.categoryId));
  if (params.subcategoryId != null)
    search.set("subcategory_id", String(params.subcategoryId));

  const response = await fetch(
    `${config.API_BASE_URL}/attributes/?${search.toString()}`,
    { method: "GET", signal: params.signal }
  );
  return apiJson<Attribute[]>(response, "Не удалось загрузить атрибуты");
}
