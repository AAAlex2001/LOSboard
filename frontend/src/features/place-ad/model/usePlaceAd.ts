"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/src/entities/category";
import {
  createAdvertisement,
  uploadAdvertisementImage,
} from "@/src/entities/advertisement";
import { initialPlaceAdState, placeAdReducer } from "./placeAdReducer";

export function usePlaceAd() {
  const router = useRouter();
  const [state, dispatch] = useReducer(placeAdReducer, initialPlaceAdState);
  const { categories } = useCategories();

  const selectedCategory =
    state.categoryId !== null
      ? categories.find((c) => c.id === state.categoryId) ?? null
      : null;

  const selectedSubcategory =
    state.subcategoryId !== null && selectedCategory
      ? selectedCategory.subcategories.find((s) => s.id === state.subcategoryId) ?? null
      : null;

  const isValid =
    selectedCategory !== null &&
    selectedSubcategory !== null &&
    state.title.trim().length > 0 &&
    Number(state.price) > 0 &&
    state.address.trim().length > 0;

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
      let photoUrl: string | undefined;
      if (state.files.length > 0) {
        const urls = await Promise.all(
          state.files.map((file) => uploadAdvertisementImage(file))
        );
        photoUrl = urls[0];
      }

      await createAdvertisement({
        title: state.title.trim(),
        description: state.description.trim() || undefined,
        price: Number(state.price),
        category_id: selectedCategory.id,
        subcategory_id: selectedSubcategory.id,
        location: state.address.trim(),
        photo_url: photoUrl,
        is_active: true,
      });
      dispatch({ type: "SUBMIT_SUCCESS" });
      router.push("/profile");
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
    goToPreview,
    goToEdit,
    submit,
    reset,
  };
}
