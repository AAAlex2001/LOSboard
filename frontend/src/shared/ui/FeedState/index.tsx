import type { ReactNode } from "react";
import { Loader } from "@/src/shared/ui/Loader";
import style from "./style.module.scss";

interface FeedStateProps {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyText: string;
  children: ReactNode;
}

/**
 * Обёртка состояний фида. Приоритет проверок фиксирован: загрузка вытесняет
 * ошибку, ошибка вытесняет пустоту, иначе показывается контент.
 */
export const FeedState = ({
  loading,
  error,
  empty,
  emptyText,
  children,
}: FeedStateProps) => {
  if (loading) {
    return (
      <div className={style.feedback}>
        <Loader />
      </div>
    );
  }
  if (error) {
    return <p className={style.feedback}>{error}</p>;
  }
  if (empty) {
    return <p className={style.feedback}>{emptyText}</p>;
  }
  return <>{children}</>;
};
