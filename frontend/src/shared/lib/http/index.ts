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

export async function apiJson<T>(
  response: Response,
  fallbackError: string
): Promise<T> {
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, fallbackError));
  }
  return (await response.json()) as T;
}
