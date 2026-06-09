"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/src/entities/category";
import {
  createAdvertisement,
  deleteAdvertisement,
  getAdvertisement,
  updateAdvertisement,
  uploadAdvertisementImage,
} from "@/src/entities/advertisement";
import { getAttributes, type Attribute } from "@/src/entities/attribute";
import { initialPlaceAdState, placeAdReducer } from "./placeAdReducer";

interface UsePlaceAdOptions {
  advertisementId?: number;
}

export function usePlaceAd({ advertisementId }: UsePlaceAdOptions = {}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(placeAdReducer, initialPlaceAdState);
  const { categories } = useCategories();
  const isEditing = advertisementId != null;
  const [loadingAd, setLoadingAd] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!advertisementId) return;
    const controller = new AbortController();

    getAdvertisement(advertisementId, { signal: controller.signal })
      .then((ad) => {
        if (controller.signal.aborted) return;
        const attributeValues: Record<number, string> = {};
        for (const av of ad.attributes ?? []) {
          attributeValues[av.attribute_id] = av.value;
        }
        dispatch({
          type: "PREFILL",
          payload: {
            categoryId: ad.category_id,
            subcategoryId: ad.subcategory_id,
            title: ad.title,
            price: String(ad.price),
            description: ad.description ?? "",
            isUrgent: ad.is_urgent,
            address: ad.location,
            photoUrls: ad.photo_urls,
            attributeValues,
          },
        });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoadingAd(false);
      });

    return () => controller.abort();
  }, [advertisementId]);

  const selectedCategory =
    state.categoryId !== null
      ? categories.find((c) => c.id === state.categoryId) ?? null
      : null;

  const selectedSubcategory =
    state.subcategoryId !== null && selectedCategory
      ? selectedCategory.subcategories.find((s) => s.id === state.subcategoryId) ?? null
      : null;

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (!selectedCategory) {
      Promise.resolve().then(() => {
        if (controller.signal.aborted) return;
        setAttributes([]);
        setAttributesLoading(false);
      });
      return () => controller.abort();
    }
    const category = selectedCategory;
    const subcategory = selectedSubcategory;
    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return;
        setAttributesLoading(true);
        return getAttributes({
          categoryId: category.id,
          subcategoryId: subcategory?.id,
          signal: controller.signal,
        });
      })
      .then((list) => {
        if (controller.signal.aborted || !list) return;
        setAttributes(list);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setAttributes([]);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setAttributesLoading(false);
      });
    return () => controller.abort();
  }, [selectedCategory?.id, selectedSubcategory?.id]);

  const attributesValid = attributes.every(
    (a) =>
      !a.is_required || (state.attributeValues[a.id]?.trim() ?? "").length > 0,
  );

  const isValid =
    selectedCategory !== null &&
    selectedSubcategory !== null &&
    state.title.trim().length > 0 &&
    Number(state.price) > 0 &&
    state.address.trim().length > 0 &&
    !attributesLoading &&
    attributesValid;

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const subcategoryOptions =
    selectedCategory?.subcategories.map((s) => ({
      value: s.id,
      label: s.name,
    })) ?? [];

  const goToPreview = () => {
    if (!isValid) return;
    dispatch({ type: "GO_TO_PREVIEW" });
  };

  const goToEdit = () => dispatch({ type: "GO_TO_EDIT" });

  const submit = async () => {
    if (!isValid || state.submitting) return;
    if (!selectedCategory || !selectedSubcategory) return;

    dispatch({ type: "SUBMIT_START" });

    try {
      const uploadedUrls =
        state.files.length > 0
          ? await Promise.all(
              state.files.map((file) => uploadAdvertisementImage(file))
            )
          : [];
      const photoUrls = [...state.existingPhotoUrls, ...uploadedUrls];

      const attributesPayload = Object.entries(state.attributeValues)
        .filter(([, value]) => value.trim().length > 0)
        .map(([attributeId, value]) => ({
          attribute_id: Number(attributeId),
          value: value.trim(),
        }));

      if (isEditing && advertisementId) {
        await updateAdvertisement(advertisementId, {
          title: state.title.trim(),
          description: state.description.trim() || null,
          price: Number(state.price),
          category_id: selectedCategory.id,
          subcategory_id: selectedSubcategory.id,
          location: state.address.trim(),
          photo_urls: photoUrls,
          is_urgent: state.isUrgent,
          attributes: attributesPayload,
        });
        dispatch({ type: "SUBMIT_SUCCESS" });
        router.push("/my-ads");
      } else {
        await createAdvertisement({
          title: state.title.trim(),
          description: state.description.trim() || undefined,
          price: Number(state.price),
          category_id: selectedCategory.id,
          subcategory_id: selectedSubcategory.id,
          location: state.address.trim(),
          photo_urls: photoUrls,
          is_active: true,
          is_urgent: state.isUrgent,
          attributes: attributesPayload,
        });
        dispatch({ type: "SUBMIT_SUCCESS" });
        router.push("/my-ads");
      }
    } catch (err) {
      dispatch({
        type: "SUBMIT_FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const remove = async () => {
    if (!isEditing || !advertisementId) return;
    if (state.submitting) return;

    dispatch({ type: "SUBMIT_START" });
    try {
      await deleteAdvertisement(advertisementId);
      dispatch({ type: "SUBMIT_SUCCESS" });
      router.push("/my-ads");
    } catch (err) {
      dispatch({
        type: "SUBMIT_FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const reset = () => dispatch({ type: "RESET" });

  return {
    state,
    dispatch,
    selectedCategory,
    selectedSubcategory,
    isValid,
    categoryOptions,
    subcategoryOptions,
    attributes,
    goToPreview,
    goToEdit,
    submit,
    remove,
    reset,
    isEditing,
    loadingAd,
    loadError,
  };
}
