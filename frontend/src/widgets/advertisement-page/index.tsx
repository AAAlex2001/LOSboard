import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { AdvertisementDetail } from "@/src/widgets/advertisement/advertisement-detail";
import { AdvertisementSidebar } from "@/src/widgets/advertisement/advertisement-sidebar";
import type { Advertisement } from "@/src/entities/advertisement";
import type {
  CategorySummary,
  SubcategorySummary,
} from "@/src/shared/lib/server-api";
import style from "./style.module.scss";

interface AdvertisementPageViewProps {
  advertisement: Advertisement;
  category: CategorySummary | null;
  subcategory: SubcategorySummary | null;
}

export const AdvertisementPageView = ({
  advertisement,
  category,
  subcategory,
}: AdvertisementPageViewProps) => {
  return (
    <main className={style.page}>
      <Header />
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/category/${category.slug}` }]
            : []),
          ...(category && subcategory
            ? [
                {
                  label: subcategory.name,
                  href: `/category/${category.slug}/${subcategory.slug}`,
                },
              ]
            : []),
          { label: advertisement.title },
        ]}
      />
      <div className={style.content}>
        <div className={style.container}>
          <div className={style.card}>
            <div className={style.detailBlock}>
              <AdvertisementDetail
                advertisement={advertisement}
                categoryName={category?.name}
                subcategoryName={subcategory?.name}
              />
            </div>

            <div className={style.sidebarSlot}>
              <AdvertisementSidebar
                advertisementId={advertisement.id}
                price={advertisement.price}
                ownerId={advertisement.owner_id ?? 0}
                sellerPhone={advertisement.seller_phone}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};
