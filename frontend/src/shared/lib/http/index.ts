export async function readErrorDetail(
  response: Response,
  fallback: string
): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData.detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join("; ");
  }
  return typeof detail === "string" ? detail : fallback;
}
