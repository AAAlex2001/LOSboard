import { RegisterWidget } from "@/src/widgets/register/RegisterWidget";
import style from "./page.module.scss";

export default function RegisterPage() {
  return (
    <div className={style.container}>
      <RegisterWidget />
    </div>
  );
}
