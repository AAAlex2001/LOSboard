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

export interface SiteSettings {
  brand_title: string;
  brand_subtitle: string;
  about_title: string;
  about_text: string;
  socials_title: string;
  telegram_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  copyright_line: string;
  ad_age_label: string;
  ad_site_label: string;
  ad_placeholder_text: string;
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

export async function getSiteSettings(
  options: { signal?: AbortSignal } = {}
): Promise<SiteSettings | null> {
  const response = await fetch(`${config.API_BASE_URL}/content/site-settings`, {
    method: "GET",
    signal: options.signal,
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      await readErrorDetail(response, "Не удалось загрузить настройки сайта")
    );
  }
  return response.json();
}
