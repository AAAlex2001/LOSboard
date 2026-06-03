const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("Не задана переменная окружения NEXT_PUBLIC_API_BASE_URL");
}

export const config = {
  API_BASE_URL,
};
