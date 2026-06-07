import style from "./style.module.scss";

interface NoteLineProps {
  text: string;
}

export const NoteLine = ({ text }: NoteLineProps) => {
  return <p className={style.note}>{text}</p>;
};
