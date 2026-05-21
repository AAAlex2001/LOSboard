import style from "./style.module.scss";

interface MessageDayDividerProps {
  label: string;
}

export const MessageDayDivider = ({ label }: MessageDayDividerProps) => {
  return <div className={style.divider}>{label}</div>;
};
