/**
 * Возвращает только цифры из строки.
 */
export function cleanPhone(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Нормализует номер к 11 цифрам, начинающимся с 7 (российский формат).
 * "8" в начале заменяется на "7". Если нет ведущей 7/8 — добавляется 7.
 */
export function normalizePhone(value: string): string {
  let digits = cleanPhone(value);
  if (!digits) return "";

  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  } else if (!digits.startsWith("7")) {
    digits = "7" + digits;
  }

  return digits.slice(0, 11);
}

/**
 * Применяет маску для отображения: +7 (XXX) XXX-XX-XX
 */
export function formatPhone(value: string): string {
  const digits = normalizePhone(value);
  if (!digits) return "";

  const country = digits[0];
  const area = digits.slice(1, 4);
  const part1 = digits.slice(4, 7);
  const part2 = digits.slice(7, 9);
  const part3 = digits.slice(9, 11);

  let result = "+" + country;
  if (digits.length > 1) result += " (" + area;
  if (digits.length >= 4) result += ")";
  if (digits.length > 4) result += " " + part1;
  if (digits.length > 7) result += "-" + part2;
  if (digits.length > 9) result += "-" + part3;

  return result;
}

/**
 * Проверяет, что номер содержит ровно 11 цифр.
 */
export function isValidPhone(value: string): boolean {
  return cleanPhone(value).length === 11;
}
