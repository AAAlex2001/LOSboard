"use client";

import { useRef, useState } from "react";
import PaperclipIcon from "@/src/shared/ui/Icons/PaperclipIcon";
import style from "./style.module.scss";

interface PhotoUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxCount?: number;
  maxSizeMb?: number;
  hint?: string;
}

export const PhotoUpload = ({
  files,
  onChange,
  maxCount = 10,
  maxSizeMb = 25,
  hint = "Первое фото будет главным, выберите наиболее удачное. До 10 фото (JPG, PNG; до 25 МБ)",
}: PhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (incoming: FileList | File[]) => {
    const maxBytes = maxSizeMb * 1024 * 1024;
    const filtered = Array.from(incoming).filter((f) => f.size <= maxBytes);
    const merged = [...files, ...filtered].slice(0, maxCount);
    onChange(merged);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className={style.wrap}>
      <div
        className={`${style.dropzone} ${dragOver ? style.dropzoneActive : ""}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <span className={style.dropzoneText}>
          Перетащите сюда фото, видео или нажмите «Прикрепить файл»
        </span>

        <span className={style.attachBtn}>
          <PaperclipIcon />
          Прикрепить файл
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handleFileSelect}
          className={style.fileInput}
        />
      </div>

      {files.length > 0 && (
        <div className={style.previewList}>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={style.preview}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={style.previewImg}
              />
              <button
                type="button"
                className={style.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                aria-label="Удалить"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <span className={style.hint}>{hint}</span>
    </div>
  );
};
