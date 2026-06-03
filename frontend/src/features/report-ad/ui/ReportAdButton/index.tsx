"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createComplaint,
  type ComplaintReason,
} from "@/src/entities/advertisement";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";
import { Modal } from "@/src/shared/ui/Modal";
import { Dropdown } from "@/src/shared/ui/Dropdown";
import { Button } from "@/src/shared/ui/Button";
import { Textarea } from "@/src/shared/ui/Textarea";
import style from "./style.module.scss";

interface ReportAdButtonProps {
  advertisementId: number;
  className?: string;
}

const REASONS: { value: ComplaintReason; label: string }[] = [
  { value: "spam", label: "Спам" },
  { value: "wrong_category", label: "Неверная категория" },
  { value: "forbidden", label: "Запрещённый товар" },
  { value: "fraud", label: "Мошенничество" },
  { value: "offensive", label: "Оскорбительный контент" },
  { value: "other", label: "Другое" },
];

export const ReportAdButton = ({
  advertisementId,
  className,
}: ReportAdButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ComplaintReason>("spam");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleOpen = () => {
    if (!isAuthenticated()) {
      router.push("/register");
      return;
    }
    setReason("spam");
    setComment("");
    setError(null);
    setDone(false);
    setOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await createComplaint(advertisementId, {
        reason,
        comment: comment.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить жалобу");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className ?? style.reportBtn}
        onClick={handleOpen}
      >
        Пожаловаться
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={style.card}>
          {done ? (
            <>
              <h2 className={style.title}>Жалоба отправлена</h2>
              <p className={style.subtitle}>
                Спасибо. Модераторы проверят объявление в ближайшее время.
              </p>
              <Button
                type="button"
                variant="filled"
                color="blue"
                fullWidth
                onClick={() => setOpen(false)}
              >
                Закрыть
              </Button>
            </>
          ) : (
            <>
              <h2 className={style.title}>Пожаловаться на объявление</h2>
              <p className={style.subtitle}>
                Выберите причину — модераторы проверят объявление
              </p>

              <Dropdown
                options={REASONS}
                value={reason}
                onChange={(v) => setReason(v as ComplaintReason)}
              />

              <Textarea
                variant="filled"
                rows={4}
                maxLength={1000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий (необязательно)"
              />

              {error && <div className={style.error}>{error}</div>}

              <div className={style.buttons}>
                <Button
                  type="button"
                  variant="outlined"
                  color="gray"
                  fullWidth
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  variant="filled"
                  color="blue"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Отправляем…" : "Отправить"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
