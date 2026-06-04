import style from "./style.module.scss";

interface CmsContentProps {
  body: string;
}

export const CmsContent = ({ body }: CmsContentProps) => {
  return (
    <article
      className={style.content}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
};
