"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createComplaint,
  type ComplaintReason,
} from "@/src/entities/advertisement";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";
import { Modal } from "@/src/shared/ui/Modal";
import { Button } from "@/src/shared/ui/Button";
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
    setOpen(true);
    setError(null);
    setDone(false);
    setReason("spam");
    setComment("");
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
        <div className={style.modal}>
          {done ? (
            <>
              <h3 className={style.title}>Жалоба отправлена</h3>
              <p className={style.text}>
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
              <h3 className={style.title}>Пожаловаться на объявление</h3>

              <label className={style.label}>Причина</label>
              <div className={style.reasons}>
                {REASONS.map((r) => (
                  <label key={r.value} className={style.reasonItem}>
                    <input
                      type="radio"
                      name="complaint-reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>

              <label className={style.label} htmlFor="complaint-comment">
                Комментарий (необязательно)
              </label>
              <textarea
                id="complaint-comment"
                className={style.textarea}
                rows={4}
                maxLength={1000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите проблему"
              />

              {error && <div className={style.error}>{error}</div>}

              <div className={style.actions}>
                <Button
                  type="button"
                  variant="outline"
                  color="blue"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  variant="filled"
                  color="blue"
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
