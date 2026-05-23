const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string, maxLength = 60): string {
  const lower = input.toLowerCase();
  let result = "";
  for (const ch of lower) {
    if (CYRILLIC_TO_LATIN[ch] !== undefined) {
      result += CYRILLIC_TO_LATIN[ch];
    } else if (/[a-z0-9]/.test(ch)) {
      result += ch;
    } else {
      result += "-";
    }
  }
  result = result.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return result.slice(0, maxLength).replace(/-+$/, "");
}

export function buildAdvertisementUrl(id: number | string, title: string): string {
  const slug = slugify(title);
  return slug ? `/advertisements/${id}-${slug}` : `/advertisements/${id}`;
}

export function parseAdvertisementIdFromParam(param: string | undefined): number {
  if (!param) return NaN;
  const match = param.match(/^(\d+)/);
  return match ? Number(match[1]) : NaN;
}
