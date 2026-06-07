import { config } from "@/src/shared/config/config";

const apiOrigin = (): string => {
  try {
    return new URL(config.API_BASE_URL).origin;
  } catch {
    return "";
  }
};

export const resolveAssetUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiOrigin()}${path}`;
};
