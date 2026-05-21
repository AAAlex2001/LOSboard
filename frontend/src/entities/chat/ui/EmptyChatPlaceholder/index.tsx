import style from "./style.module.scss";

interface EmptyChatPlaceholderProps {
  label?: string;
}

export const EmptyChatPlaceholder = ({
  label = "Выберите чат для общения",
}: EmptyChatPlaceholderProps) => {
  return (
    <div className={style.wrap} role="status" aria-live="polite">
      <div className={style.illustration} aria-hidden="true">
        <Row tone="light" />
        <Row tone="dark" />
        <Row tone="lilac" />
      </div>
      <p className={style.label}>{label}</p>
    </div>
  );
};

interface RowProps {
  tone: "light" | "dark" | "lilac";
}

const Row = ({ tone }: RowProps) => {
  const toneClass =
    tone === "light"
      ? style.tileLight
      : tone === "dark"
        ? style.tileDark
        : style.tileLilac;
  return (
    <div className={style.row}>
      <div className={`${style.tile} ${toneClass}`} />
      <div className={style.lines}>
        <div className={style.linesTop}>
          <div className={`${style.line} ${style.lineShort}`} />
          <div className={`${style.line} ${style.lineTiny}`} />
        </div>
        <div className={`${style.line} ${style.lineWide}`} />
      </div>
    </div>
  );
};
