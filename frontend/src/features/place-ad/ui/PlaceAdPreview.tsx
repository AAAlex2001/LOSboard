"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/src/shared/ui/Loader";
import { Button } from "@/src/shared/ui/Button";
import { Lightbox } from "@/src/shared/ui/Lightbox";
import { resolveAssetUrl } from "@/src/shared/lib/asset-url";
import type { PlaceAdState } from "../model/types";
import type { Category, Subcategory } from "@/src/entities/category";
import style from "./PlaceAdForm.module.scss";

interface PlaceAdPreviewProps {
  state: PlaceAdState;
  category: Category | null;
  subcategory: Subcategory | null;
  onBack: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

const formatPrice = (price: string) => {
  const n = Number(price);
  if (!n) return "";
  return `${n.toLocaleString("ru-RU")} ₽`;
};

export const PlaceAdPreview = ({
  state,
  category,
  subcategory,
  onBack,
  onSubmit,
  submitLabel = "Разместить объявление",
}: PlaceAdPreviewProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const blobUrls = state.files.map((file) => URL.createObjectURL(file));
    const existing = state.existingPhotoUrls.map(
      (url) => resolveAssetUrl(url) ?? url
    );
    Promise.resolve().then(() => setPreviewUrls([...existing, ...blobUrls]));
    return () => blobUrls.forEach(URL.revokeObjectURL);
  }, [state.files, state.existingPhotoUrls]);

  return (
    <div className={style.form}>
      <section className={style.category}>
        <div className={style.labelRow}>
          <span className={style.label}>Категория</span>
        </div>
        <div className={style.categoryValue}>
          {category && <span className={style.valueText}>{category.name}</span>}
          {category && subcategory && <span className={style.dot} />}
          {subcategory && (
            <span className={style.valueText}>{subcategory.name}</span>
          )}
        </div>
      </section>

      <section className={style.name}>
        <div className={style.labelRow}>
          <span className={style.label}>Название</span>
        </div>
        <div className={style.previewField}>
          <span className={style.valueText}>{state.title}</span>
        </div>
      </section>

      <section className={style.price}>
        <div className={style.labelRow}>
          <span className={style.label}>Цена</span>
        </div>
        <div className={style.previewField}>
          <span className={style.valueText}>{formatPrice(state.price)}</span>
        </div>
      </section>

      {state.isUrgent && (
        <section className={style.urgent}>
          <div className={style.labelRow}>
            <span className={style.label}>Срочные</span>
          </div>
          <div className={style.previewField}>
            <span className={style.urgentPreviewBadge}>Срочное объявление</span>
          </div>
        </section>
      )}

      {state.description.trim().length > 0 && (
        <section className={style.description}>
          <div className={style.labelRow}>
            <span className={style.label}>Описание товара</span>
          </div>
          <div className={style.previewDescription}>
            <p className={style.valueText}>{state.description}</p>
          </div>
        </section>
      )}

      {previewUrls.length > 0 && (
        <section className={style.images}>
          <div className={style.imagesLabelRow}>
            <span className={style.label}>Фотографии</span>
          </div>
          <div className={style.previewPhotos}>
            {previewUrls.map((url, index) => (
              <button
                key={url}
                type="button"
                className={style.previewPhoto}
                style={{ backgroundImage: `url(${url})` }}
                onClick={() => setLightboxUrl(url)}
                aria-label={`Открыть фото ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {state.contactPhone.trim().length > 0 && (
        <section className={style.price}>
          <div className={style.labelRow}>
            <span className={style.label}>Контактный телефон</span>
          </div>
          <div className={style.previewField}>
            <span className={style.valueText}>{state.contactPhone}</span>
          </div>
        </section>
      )}

      {state.address.trim().length > 0 && <section className={style.location}>
        <div className={style.labelRow}>
          <span className={style.label}>Местоположение</span>
        </div>
        <div className={style.previewField}>
          <span className={style.valueText}>{state.address}</span>
        </div>
      </section>}

      <div className={style.previewButtons}>
        <Button
          type="button"
          variant="outlined"
          color="blue"
          onClick={onBack}
          disabled={state.submitting}
        >
          Назад
        </Button>
        <Button
          type="button"
          variant="filled"
          color="blue"
          onClick={onSubmit}
          disabled={state.submitting}
        >
          {state.submitting ? <Loader /> : submitLabel}
        </Button>
      </div>

      {state.error && <p className={style.error}>{state.error}</p>}

      {lightboxUrl && (
        <Lightbox src={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}
    </div>
  );
};
