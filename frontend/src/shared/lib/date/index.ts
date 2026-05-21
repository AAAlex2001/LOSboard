const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export const formatPostedAt = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  const time = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

  if (dayDiff === 0) return `Сегодня в ${time}`;
  if (dayDiff === 1) return `Вчера в ${time}`;

  const day = date.getDate();
  const month = MONTHS_GENITIVE[date.getMonth()];
  const sameYear = date.getFullYear() === now.getFullYear();
  return sameYear
    ? `${day} ${month} в ${time}`
    : `${day} ${month} ${date.getFullYear()} в ${time}`;
};
