import style from "./style.module.scss";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export const UnreadBadge = ({ count, className }: UnreadBadgeProps) => {
  if (count <= 0) return null;
  return (
    <span
      className={`${style.badge} ${className ?? ""}`}
      aria-label={`Непрочитанных сообщений: ${count}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};
