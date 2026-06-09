/**
 * Форматирует цену в рублях: разделители разрядов по ru-RU + знак ₽.
 */
export const formatPrice = (price: number): string =>
  `${price.toLocaleString("ru-RU")} ₽`;
