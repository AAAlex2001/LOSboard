import style from "./style.module.scss";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

export const UserAvatar = ({
  src = "/profile.png",
  alt = "Avatar",
  size = 50,
}: UserAvatarProps) => {
  return (
    <div
      className={style.avatar}
      style={{ width: size, height: size, borderRadius: size }}
    >
      <img src={src} alt={alt} className={style.image} />
    </div>
  );
};
