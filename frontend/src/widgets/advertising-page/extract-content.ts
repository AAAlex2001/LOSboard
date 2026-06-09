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

export interface AccordionSection {
  title: string;
  body: string;
}

export function splitAccordionByH1(html: string): AccordionSection[] {
  if (!html.trim()) return [];
  const sections: AccordionSection[] = [];
  const regex = /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi;
  const matches: { title: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    matches.push({
      title: stripHtmlTags(m[1]),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  for (let i = 0; i < matches.length; i++) {
    const bodyStart = matches[i].end;
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].start : html.length;
    const body = html.slice(bodyStart, bodyEnd).trim();
    if (matches[i].title.trim() && body) {
      sections.push({ title: matches[i].title.trim(), body });
    }
  }
  return sections;
}
