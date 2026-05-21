"use client";

import { useRef } from "react";
import { Tooltip } from "@/src/shared/ui/Tooltip";
import { UserAvatar, useMeContext } from "@/src/entities/user";
import { useUploadAvatar } from "../model/useUploadAvatar";
import style from "./AvatarUploader.module.scss";

interface AvatarUploaderProps {
  size?: number;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export const AvatarUploader = ({ size = 120 }: AvatarUploaderProps) => {
  const { user } = useMeContext();
  const { state, upload } = useUploadAvatar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => {
    if (state.uploading) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) upload(file);
  };

  return (
    <div className={style.wrap}>
      <Tooltip label="Изменить аватар">
        <button
          type="button"
          className={style.button}
          onClick={handlePick}
          disabled={state.uploading}
          aria-label="Изменить аватар"
          style={{ width: size, height: size, borderRadius: size }}
        >
          <UserAvatar src={user?.avatar_url ?? undefined} size={size} />
          <span className={style.overlay} aria-hidden="true">
            {state.uploading ? "..." : "Изменить"}
          </span>
        </button>
      </Tooltip>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className={style.fileInput}
        onChange={handleChange}
      />
      {state.error && <p className={style.error}>{state.error}</p>}
    </div>
  );
};
