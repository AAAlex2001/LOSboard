"use client";

import { useEffect, useState } from "react";
import { getAdvertisement } from "@/src/entities/advertisement";

interface UseAdvertisementContactPhoneOptions {
  advertisementId: number;
  userId?: number;
  initialPhone?: string | null;
}

export function useAdvertisementContactPhone({
  advertisementId,
  userId,
  initialPhone,
}: UseAdvertisementContactPhoneOptions): string {
  const [phone, setPhone] = useState(initialPhone ?? "");

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    getAdvertisement(advertisementId, { signal: controller.signal })
      .then((advertisement) => {
        if (!controller.signal.aborted) {
          setPhone(advertisement.seller_phone ?? "");
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [advertisementId, initialPhone, userId]);

  return userId ? phone : "";
}
