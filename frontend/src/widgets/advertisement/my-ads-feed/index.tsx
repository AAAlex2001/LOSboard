"use client";

import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import { AdCard, type Advertisement } from "@/src/entities/advertisement";
import { useMyAdvertisements } from "@/src/features/advertisement";
import style from "./style.module.scss";

export const MyAdsFeed = () => {
  const router = useRouter();
  const { items, loading, error } = useMyAdvertisements();

  const handleEdit = (ad: Advertisement) => {
    router.push(`/my-ads/${ad.id}/edit`);
  };

  const handleCardClick = (ad: Advertisement) => {
    router.push(`/advertisements/${ad.id}`);
  };

  if (loading) {
    return (
      <div className={style.feedback}>
        <Loader />
      </div>
    );
  }
  if (error) {
    return <p className={style.feedback}>{error}</p>;
  }
  if (items.length === 0) {
    return <p className={style.feedback}>У вас пока нет объявлений</p>;
  }

  return (
    <div className={style.grid}>
      {items.map((ad) => (
        <AdCard
          key={ad.id}
          advertisement={ad}
          onClick={handleCardClick}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};
