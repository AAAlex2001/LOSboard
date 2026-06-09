"use client";

import { useState } from "react";
import PaperclipIcon from "@/src/shared/ui/Icons/PaperclipIcon";
import { Lightbox } from "@/src/shared/ui/Lightbox";
import { useSecureAsset } from "../../model/useSecureAsset";
import type { ChatAttachment } from "../../model/types";
import style from "./style.module.scss";

interface MessageAttachmentViewProps {
  attachment: ChatAttachment;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
};

export const MessageAttachmentView = ({
  attachment,
}: MessageAttachmentViewProps) => {
  const { kind, url, filename, size_bytes, mime_type } = attachment;
  const [docDownloading, setDocDownloading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { src, error } = useSecureAsset(kind === "image" ? url : null);
  const video = useSecureAsset(kind === "video" && lightboxOpen ? url : null);

  if (kind === "image") {
    if (error) return <span className={style.error}>{error}</span>;
    if (!src) return <div className={style.imageSkeleton} />;
    return (
      <>
        <button
          type="button"
          className={style.imageLink}
          onClick={() => setLightboxOpen(true)}
          aria-label={`Открыть ${filename}`}
        >
          <img
            src={src}
            alt={filename}
            className={style.image}
            loading="lazy"
            decoding="async"
          />
        </button>
        {lightboxOpen && (
          <Lightbox
            src={src}
            alt={filename}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  if (kind === "video") {
    return (
      <>
        <button
          type="button"
          className={style.videoBtn}
          onClick={() => setLightboxOpen(true)}
          aria-label={`Открыть ${filename}`}
        >
          <span className={style.playOverlay} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="#FFFFFF" />
            </svg>
          </span>
        </button>
        {lightboxOpen && video.src && (
          <Lightbox
            src={video.src}
            kind="video"
            alt={filename}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  const handleDownload = async () => {
    setDocDownloading(true);
    try {
      const { fetchAttachmentBlob } = await import("../../api/chat.api");
      const blob = await fetchAttachmentBlob(url);
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDocDownloading(false);
    }
  };

  return (
    <button
      type="button"
      className={style.doc}
      onClick={handleDownload}
      disabled={docDownloading}
      title={mime_type}
    >
      <span className={style.docIcon}>
        <PaperclipIcon />
      </span>
      <span className={style.docBody}>
        <span className={style.docName}>{filename}</span>
        <span className={style.docSize}>{formatSize(size_bytes)}</span>
      </span>
    </button>
  );
};
