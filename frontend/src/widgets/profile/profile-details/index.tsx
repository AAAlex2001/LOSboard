"use client";

import Typography from "@/src/shared/ui/Typography";
import { formatPhone } from "@/src/shared/lib/phone";
import { UserInfoRow, type User } from "@/src/entities/user";
import { AvatarUploader } from "@/src/features/upload-avatar";
import {
  EditProfileFieldModal,
  useEditProfileField,
} from "@/src/features/edit-profile-field";
import style from "./style.module.scss";

interface ProfileDetailsProps {
  user: User;
  onUserUpdated?: (user: User) => void;
}

export const ProfileDetails = ({ user, onUserUpdated }: ProfileDetailsProps) => {
  const editor = useEditProfileField({ user, onUpdated: onUserUpdated });

  return (
    <>
      <section className={style.profile}>
        <div className={style.header}>
          <div className={style.title}>
            <Typography variant="h1">Личный профиль</Typography>
          </div>

          <AvatarUploader size={50} />
        </div>

        <div className={style.fields}>
          <UserInfoRow
            label="Имя пользователя"
            value={user.name}
            actionText="Редактировать"
            onAction={() => editor.open("name")}
          />
          <UserInfoRow
            label="Электронная почта"
            value={user.email}
            actionText="Изменить"
            onAction={() => editor.open("email")}
          />
          <UserInfoRow
            label="Номер телефона"
            value={user.phone_number ? formatPhone(user.phone_number) : undefined}
            placeholder="Введите номер телефона для связи с продавцом/покупателем"
            actionText={user.phone_number ? "Изменить" : "Добавить"}
            onAction={() => editor.open("phone_number")}
            noBorder
          />
        </div>
      </section>

      <EditProfileFieldModal
        user={user}
        onUpdated={onUserUpdated}
        controller={editor}
      />
    </>
  );
};
