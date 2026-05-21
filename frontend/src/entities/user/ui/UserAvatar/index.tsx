"use client";

import { resolveAssetUrl } from "@/src/entities/advertisement";
import style from "./style.module.scss";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
}

export const UserAvatar = ({ src, alt = "Avatar", size = 50 }: UserAvatarProps) => {
  const resolved = src ? resolveAssetUrl(src) ?? src : "/profile.png";
  return (
    <div
      className={style.avatar}
      style={{ width: size, height: size, borderRadius: size }}
    >
      <img src={resolved} alt={alt} className={style.image} />
    </div>
  );
};
