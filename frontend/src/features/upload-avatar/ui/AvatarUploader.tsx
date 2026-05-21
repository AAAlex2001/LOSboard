"use client";

import { useRef, useState } from "react";
import { Tooltip } from "@/src/shared/ui/Tooltip";
import { UserAvatar, uploadAvatar, useMeContext } from "@/src/entities/user";
import style from "./AvatarUploader.module.scss";

interface AvatarUploaderProps {
  size?: number;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export const AvatarUploader = ({ size = 120 }: AvatarUploaderProps) => {
  const { user, setUser } = useMeContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { avatar_url } = await uploadAvatar(file);
      if (user) setUser({ ...user, avatar_url });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={style.wrap}>
      <Tooltip label="Изменить аватар">
        <button
          type="button"
          className={style.button}
          onClick={handlePick}
          disabled={uploading}
          aria-label="Изменить аватар"
          style={{ width: size, height: size, borderRadius: size }}
        >
          <UserAvatar src={user?.avatar_url ?? undefined} size={size} />
          <span className={style.overlay} aria-hidden="true">
            {uploading ? "..." : "Изменить"}
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
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
};
