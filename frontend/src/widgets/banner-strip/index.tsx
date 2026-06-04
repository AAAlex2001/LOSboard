"use client";

import { useEffect, useState } from "react";
import { getActiveBanners, type Banner } from "@/src/entities/banner";
import { resolveAssetUrl } from "@/src/entities/advertisement";
import style from "./style.module.scss";

export const BannerStrip = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getActiveBanners({ signal: controller.signal })
      .then(setBanners)
      .catch(() => setBanners([]));
    return () => controller.abort();
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className={style.strip}>
      {banners.map((banner) => {
        const img = resolveAssetUrl(banner.image_url) ?? banner.image_url;
        const content = (
          <>
            <img
              src={img}
              alt={banner.title}
              className={style.image}
              loading="lazy"
            />
            {(banner.title || banner.description) && (
              <div className={style.overlay}>
                {banner.title && (
                  <span className={style.title}>{banner.title}</span>
                )}
                {banner.description && (
                  <span className={style.description}>{banner.description}</span>
                )}
              </div>
            )}
          </>
        );

        return banner.link_url ? (
          <a
            key={banner.id}
            href={banner.link_url}
            className={style.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          <div key={banner.id} className={style.card}>
            {content}
          </div>
        );
      })}
    </div>
  );
};
