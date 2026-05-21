"use client";

import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { Dropdown } from "@/src/shared/ui/Dropdown";
import { Loader } from "@/src/shared/ui/Loader";
import { PhotoUpload } from "@/src/shared/ui/PhotoUpload";
import { AddressAutocomplete } from "@/src/shared/ui/AddressAutocomplete";
import { Map } from "@/src/shared/ui/Map";
import { resolveAssetUrl } from "@/src/entities/advertisement";
import { usePlaceAd } from "../model/usePlaceAd";
import { TITLE_MAX } from "../model/placeAdReducer";
import { PlaceAdPreview } from "./PlaceAdPreview";
import style from "./PlaceAdForm.module.scss";

interface PlaceAdFormProps {
  advertisementId?: number;
}

export const PlaceAdForm = ({ advertisementId }: PlaceAdFormProps = {}) => {
  const {
    state,
    dispatch,
    selectedCategory,
    selectedSubcategory,
    isValid,
    categoryOptions,
    subcategoryOptions,
    goToPreview,
    goToEdit,
    submit,
    remove,
    reset,
    isEditing,
    loadingAd,
    loadError,
  } = usePlaceAd({ advertisementId });

  if (loadingAd) {
    return (
      <div className={style.loadingArea}>
        <Loader />
      </div>
    );
  }
  if (loadError) {
    return <p className={style.error}>{loadError}</p>;
  }

  const handleDelete = () => {
    if (window.confirm("Удалить объявление?")) {
      remove();
    }
  };

  return (
    <>
      {state.step === 2 && (
        <PlaceAdPreview
          state={state}
          category={selectedCategory}
          subcategory={selectedSubcategory}
          onBack={goToEdit}
          onSubmit={submit}
          submitLabel={isEditing ? "Сохранить" : "Разместить объявление"}
        />
      )}
      <form
        className={`${style.form} ${state.step === 2 ? style.formHidden : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          goToPreview();
        }}
        aria-hidden={state.step === 2}
      >
      <section className={style.category}>
        <div className={style.labelRow}>
          <span className={style.label}>Категория</span>
        </div>
        <div className={style.dropdowns}>
          <Dropdown
            options={categoryOptions}
            value={state.categoryId}
            placeholder="Категория"
            onChange={(value) =>
              dispatch({ type: "SET_CATEGORY", payload: Number(value) })
            }
          />
          <Dropdown
            options={subcategoryOptions}
            value={state.subcategoryId}
            placeholder="Подкатегория"
            disabled={!selectedCategory}
            onChange={(value) =>
              dispatch({ type: "SET_SUBCATEGORY", payload: Number(value) })
            }
          />
        </div>
      </section>

      <section className={style.name}>
        <div className={style.labelRow}>
          <span className={style.label}>Название</span>
        </div>
        <div className={style.nameInner}>
          <Input
            variant="form"
            type="text"
            placeholder="Йоркширский терьер щенки"
            value={state.title}
            onChange={(e) =>
              dispatch({ type: "SET_TITLE", payload: e.target.value })
            }
            maxLength={TITLE_MAX}
          />
          <span className={style.hint}>
            Название не должно превышать {TITLE_MAX} символов
          </span>
        </div>
      </section>

      <section className={style.price}>
        <div className={style.labelRow}>
          <span className={style.label}>Цена</span>
        </div>
        <div className={style.field}>
          <Input
            variant="form"
            type="text"
            placeholder="Введите цену"
            value={state.price}
            onChange={(e) =>
              dispatch({ type: "SET_PRICE", payload: e.target.value })
            }
          />
        </div>
      </section>

      <section className={style.description}>
        <div className={style.labelRow}>
          <span className={style.label}>Описание товара</span>
        </div>
        <div className={style.field}>
          <textarea
            className={style.textarea}
            placeholder="Расскажите подробнее о товаре"
            value={state.description}
            onChange={(e) =>
              dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
            }
            rows={3}
          />
        </div>
      </section>

      <section className={style.images}>
        <div className={style.imagesLabelRow}>
          <span className={style.label}>Фотографии</span>
        </div>
        <div className={style.field}>
          <PhotoUpload
            files={state.files}
            onChange={(files) => dispatch({ type: "SET_FILES", payload: files })}
            existingUrls={state.existingPhotoUrls.map(
              (url) => resolveAssetUrl(url) ?? url
            )}
            onRemoveExisting={(displayUrl) => {
              const original = state.existingPhotoUrls.find(
                (url) => (resolveAssetUrl(url) ?? url) === displayUrl
              );
              if (original) {
                dispatch({ type: "REMOVE_EXISTING_PHOTO", payload: original });
              }
            }}
          />
        </div>
      </section>

      <section className={style.location}>
        <div className={style.labelRow}>
          <span className={style.label}>Местоположение</span>
        </div>
        <div className={style.locationInner}>
          <div className={style.locationSublabelRow}>
            <span className={style.sublabel}>
              Укажите реальный адрес сделки{" "}
              <span className={style.sublabelHint}>
                (нажмите на карту чтобы выбрать адрес)
              </span>
            </span>
          </div>
          <AddressAutocomplete
            value={state.address}
            onChange={(value) =>
              dispatch({ type: "SET_ADDRESS", payload: value })
            }
            onSelect={(s) =>
              dispatch({
                type: "SET_LOCATION",
                payload: { address: s.label, latitude: s.lat, longitude: s.lon },
              })
            }
          />
          <Map
            latitude={state.latitude ?? undefined}
            longitude={state.longitude ?? undefined}
            onLocationClick={(loc) =>
              dispatch({
                type: "SET_LOCATION",
                payload: {
                  address: loc.address,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                },
              })
            }
          />
          <div className={style.buttons}>
            {isEditing && (
              <Button
                type="button"
                variant="outlined"
                color="delete"
                onClick={handleDelete}
                disabled={state.submitting}
              >
                Удалить объявление
              </Button>
            )}
            <div className={style.buttonsRight}>
              <Button
                type="button"
                variant="outlined"
                color="blue"
                onClick={reset}
                disabled={state.submitting}
              >
                Очистить
              </Button>
              <Button
                type="submit"
                variant="filled"
                color="blue"
                disabled={!isValid || state.submitting}
              >
                Далее
              </Button>
            </div>
          </div>
        </div>
      </section>

      {state.error && <p className={style.error}>{state.error}</p>}
      </form>
    </>
  );
};
