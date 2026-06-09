"use client";

import { useEffect, useState } from "react";
import type { Category } from "./types";
import { getCategories } from "../api/category.api";

let cache: Category[] | null = null;
let pending: Promise<Category[]> | null = null;
const subscribers = new Set<(data: Category[]) => void>();

function loadCategories(): Promise<Category[]> {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;
  pending = getCategories().then((data) => {
    cache = data;
    pending = null;
    subscribers.forEach((cb) => cb(data));
    return data;
  });
  return pending;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    const onUpdate = (data: Category[]) => {
      if (!cancelled) {
        setCategories(data);
        setLoading(false);
      }
    };
    subscribers.add(onUpdate);
    loadCategories()
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      subscribers.delete(onUpdate);
    };
  }, []);

  return { categories, loading, error };
}
