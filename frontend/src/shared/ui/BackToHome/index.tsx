import Link from "next/link";
import style from "./style.module.scss";

export function BackToHome() {
  return (
    <Link href="/" className={style.button}>
      Вернуться на главную
    </Link>
  );
}
