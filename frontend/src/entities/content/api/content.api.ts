import { config } from "@/src/shared/config/config";

export interface ContentPage {
  slug: string;
  title: string;
  body: string;
  updated_at: string;
}

export interface ContentPageListItem {
  slug: string;
  title: string;
}

export interface FooterLink {
  title: string;
  url: string;
  sort_order: number;
}

export interface FooterResponse {
  links: FooterLink[];
}

async function readErrorDetail(
  response: Response,
  fallback: string
): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData.detail;
  return typeof detail === "string" ? detail : fallback;
}

export async function listContentPages(
  options: { signal?: AbortSignal } = {}
): Promise<ContentPageListItem[]> {
  const response = await fetch(`${config.API_BASE_URL}/content/pages`, {
    method: "GET",
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить страницы"));
  }
  return response.json();
}

export async function getContentPage(
  slug: string,
  options: { signal?: AbortSignal } = {}
): Promise<ContentPage | null> {
  const response = await fetch(`${config.API_BASE_URL}/content/pages/${slug}`, {
    method: "GET",
    signal: options.signal,
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить страницу"));
  }
  return response.json();
}

export async function getFooter(
  options: { signal?: AbortSignal } = {}
): Promise<FooterResponse> {
  const response = await fetch(`${config.API_BASE_URL}/content/footer`, {
    method: "GET",
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить футер"));
  }
  return response.json();
}
