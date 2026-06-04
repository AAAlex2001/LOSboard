import { config } from "@/src/shared/config/config";

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

async function readErrorDetail(
  response: Response,
  fallback: string
): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData.detail;
  return typeof detail === "string" ? detail : fallback;
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
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить атрибуты"));
  }
  return response.json();
}
