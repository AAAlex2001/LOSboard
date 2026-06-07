export const ADVERTISING_ACCORDION_SLUGS: ReadonlyArray<string> = [
  "pricing-tech-board",
  "pricing-tech-social",
  "pricing-tech-mobile",
  "pricing-tech-tour",
];

export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractLeadingParagraphs(
  html: string,
  count: number,
): { paragraphs: string[]; rest: string } {
  const paragraphs: string[] = [];
  let rest = html;
  for (let i = 0; i < count; i++) {
    const match = rest.match(/^\s*<p\b[^>]*>([\s\S]*?)<\/p>\s*/i);
    if (!match) break;
    const text = stripHtmlTags(match[1]);
    if (!text) {
      rest = rest.slice(match[0].length);
      continue;
    }
    paragraphs.push(text);
    rest = rest.slice(match[0].length);
  }
  return { paragraphs, rest };
}

export function splitByHr(html: string): [string, string] {
  const match = html.match(/<hr\b[^>]*\/?>/i);
  if (!match) return [html, ""];
  const idx = html.indexOf(match[0]);
  return [
    html.slice(0, idx).trim(),
    html.slice(idx + match[0].length).trim(),
  ];
}
