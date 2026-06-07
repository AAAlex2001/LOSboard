import style from "./style.module.scss";

interface CmsContentProps {
  body: string;
}

function markHighlightedCards(html: string): string {
  return html.replace(
    /<blockquote\b([^>]*)>([\s\S]*?)<\/blockquote>/g,
    (match, attrs, content) => {
      if (/\+\s*10\s*%/i.test(content)) {
        return `<blockquote${attrs} data-highlighted="true">${content}</blockquote>`;
      }
      return match;
    }
  );
}

function wrapBlockquoteGroups(html: string): string {
  return html.replace(
    /(<blockquote\b[^>]*>[\s\S]*?<\/blockquote>(?:\s*<blockquote\b[^>]*>[\s\S]*?<\/blockquote>)+)/g,
    "<div>$1</div>"
  );
}

function preprocess(html: string): string {
  return wrapBlockquoteGroups(markHighlightedCards(html));
}

export const CmsContent = ({ body }: CmsContentProps) => {
  return (
    <article
      className={style.content}
      dangerouslySetInnerHTML={{ __html: preprocess(body) }}
    />
  );
};
