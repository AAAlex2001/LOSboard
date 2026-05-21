import type { ChatMessage } from "../model/types";

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

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export interface MessageDayGroup {
  key: string;
  label: string;
  messages: ChatMessage[];
}

/** Группирует сообщения по дню в порядке возрастания времени. */
export function groupMessagesByDay(messages: ChatMessage[]): MessageDayGroup[] {
  const groups: MessageDayGroup[] = [];
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = todayStart - 86400000;

  for (const message of messages) {
    const date = new Date(message.created_at);
    if (Number.isNaN(date.getTime())) continue;

    const dayStart = startOfDay(date);
    const key = String(dayStart);

    let label: string;
    if (dayStart === todayStart) {
      label = "Сегодня";
    } else if (dayStart === yesterdayStart) {
      label = "Вчера";
    } else {
      const sameYear = date.getFullYear() === now.getFullYear();
      label = sameYear
        ? `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]}`
        : `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
    }

    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.messages.push(message);
    } else {
      groups.push({ key, label, messages: [message] });
    }
  }

  return groups;
}
