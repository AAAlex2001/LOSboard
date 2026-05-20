"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@/src/shared/ui/Typography";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { EditFieldModal } from "@/src/shared/ui/EditFieldModal";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { cleanPhone, formatPhone, isValidPhone } from "@/src/shared/lib/phone";
import {
  UserAvatar,
  UserInfoRow,
  updateAccount,
  type UpdateAccountPayload,
} from "@/src/entities/user";
import type { User } from "@/src/entities/user";
import style from "./style.module.scss";

type FieldKey = "name" | "email" | "phone_number" | null;

interface ProfileDetailsProps {
  user: User;
  onUserUpdated?: (user: User) => void;
}

const FIELD_CONFIG: Record<
  Exclude<FieldKey, null>,
  {
    titleEdit: string;
    titleAdd: string;
    subtitle: string;
    placeholder: string;
    inputType: "text" | "email" | "tel";
  }
> = {
  name: {
    titleEdit: "Изменить имя",
    titleAdd: "Изменить имя",
    subtitle: "Отображается в профиле",
    placeholder: "Имя",
    inputType: "text",
  },
  email: {
    titleEdit: "Изменить почту",
    titleAdd: "Изменить почту",
    subtitle: "Отправим код для подтверждения",
    placeholder: "Электронная почта",
    inputType: "email",
  },
  phone_number: {
    titleEdit: "Изменить номер телефона",
    titleAdd: "Добавить номер телефона",
    subtitle: "Для связи с продавцом/покупателем",
    placeholder: "Номер телефона",
    inputType: "tel",
  },
};

export const ProfileDetails = ({ user, onUserUpdated }: ProfileDetailsProps) => {
  const router = useRouter();
  const [activeField, setActiveField] = useState<FieldKey>(null);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (!loading) setActiveField(null);
  };

  const handleSubmit = async (value: string) => {
    if (!activeField) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const payload: UpdateAccountPayload = { [activeField]: trimmed };
      const updated = await updateAccount(payload);
      onUserUpdated?.(updated);
      setActiveField(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentValue = activeField ? user[activeField] || "" : "";
  const config = activeField ? FIELD_CONFIG[activeField] : null;
  const isAdding = activeField === "phone_number" && !user.phone_number;
  const modalTitle = config
    ? isAdding
      ? config.titleAdd
      : config.titleEdit
    : "";

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
            onAction={() => setActiveField("name")}
          />
          <UserInfoRow
            label="Электронная почта"
            value={user.email}
            actionText="Изменить"
            onAction={() => setActiveField("email")}
          />
          <UserInfoRow
            label="Номер телефона"
            value={user.phone_number ? formatPhone(user.phone_number) : undefined}
            placeholder="Введите номер телефона для связи с продавцом/покупателем"
            actionText={user.phone_number ? "Изменить" : "Добавить"}
            onAction={() => setActiveField("phone_number")}
            noBorder
          />
        </div>
      </section>

      {config && (
        <EditFieldModal
          open={activeField !== null}
          onClose={closeModal}
          onSubmit={handleSubmit}
          title={modalTitle}
          subtitle={config.subtitle}
          placeholder={config.placeholder}
          inputType={config.inputType}
          initialValue={String(currentValue)}
          loading={loading}
          submitText={isAdding ? "Добавить" : "Сохранить"}
          formatValue={activeField === "phone_number" ? formatPhone : undefined}
          prepareSubmit={
            activeField === "phone_number" ? cleanPhone : undefined
          }
          validate={
            activeField === "phone_number" ? isValidPhone : undefined
          }
        />
      )}
    </>
  );
};
