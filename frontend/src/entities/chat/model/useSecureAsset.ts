"use client";

import { useEffect, useState } from "react";
import { fetchAttachmentBlob } from "../api/chat.api";

export function useSecureAsset(url: string | null | undefined) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    let createdUrl: string | null = null;

    fetchAttachmentBlob(url)
      .then((blob) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setSrc(createdUrl);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [url]);

  return { src, error };
}
