"use client";

import { useRouter } from "next/navigation";
import Typography from "@/src/shared/ui/Typography";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { formatPhone } from "@/src/shared/lib/phone";
import { UserAvatar, UserInfoRow, type User } from "@/src/entities/user";
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
  const router = useRouter();
  const editor = useEditProfileField({ user, onUpdated: onUserUpdated });

  return (
    <>
      <section className={style.profile}>
        <div className={style.breadcrumbs}>
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Личный кабинет" },
            ]}
          />
        </div>

        <div className={style.header}>
          <button
            type="button"
            className={style.back}
            onClick={() => router.back()}
            aria-label="Назад"
          >
            <ArrowLeftIcon />
          </button>

          <div className={style.title}>
            <Typography variant="h1">Личный профиль</Typography>
          </div>

          <UserAvatar size={50} />
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
