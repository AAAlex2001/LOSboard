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

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function transformBannerMockups(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*BANNER\s+(\d+)\s*x\s*(\d+)\s+([^;\]]+?)(?:\s*;\s*([^\]]+?))?\s*\]\s*<\/p>/gi,
    (_match, w, h, name, note) => {
      const wNum = parseInt(w, 10);
      const hNum = parseInt(h, 10);
      const nameClean = name.trim();
      const noteClean = note ? note.trim() : "";
      const figure = `<figure class="bannerMockup" style="aspect-ratio: ${wNum} / ${hNum}; max-width: ${wNum}px;"><figcaption class="bannerMockupLabel"><span class="bannerMockupSize">${wNum} × ${hNum}</span><span class="bannerMockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
      if (noteClean) {
        return `${figure}<p class="bannerMockupNote">${escapeAttr(noteClean)}</p>`;
      }
      return figure;
    }
  );
}

function transformPhoneMockups(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*PHONE\s+(\d+)\s*x\s*(\d+)\s+([^;\]]+?)(?:\s*;\s*([^\]]+?))?\s*\]\s*<\/p>/gi,
    (_match, w, h, name, note) => {
      const wNum = parseInt(w, 10);
      const hNum = parseInt(h, 10);
      const nameClean = name.trim();
      const noteClean = note ? note.trim() : "";
      const figure = `<figure class="phoneMockup"><figcaption class="phoneMockupLabel"><span class="phoneMockupSize">${wNum} × ${hNum}</span><span class="phoneMockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
      if (noteClean) {
        return `${figure}<p class="phoneMockupNote">${escapeAttr(noteClean)}</p>`;
      }
      return figure;
    }
  );
}

function transformNoteMarkers(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*NOTE\s+([^\]]+?)\s*\]\s*<\/p>/gi,
    (_match, text) => {
      const textClean = text.trim();
      return `<p class="cmsNote">${escapeAttr(textClean)}</p>`;
    }
  );
}

function transformCardMockups(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*CARD\s+(\d+)\s*x\s*(\d+)\s+([^;\]]+?)(?:\s*;\s*([^\]]+?))?\s*\]\s*<\/p>/gi,
    (_match, w, h, name, note) => {
      const wNum = parseInt(w, 10);
      const hNum = parseInt(h, 10);
      const nameClean = name.trim();
      const noteClean = note ? note.trim() : "";
      const figure = `<figure class="cardMockup" style="aspect-ratio: ${wNum} / ${hNum}; max-width: ${wNum}px;"><figcaption class="cardMockupLabel"><span class="cardMockupSize">${wNum} × ${hNum}</span><span class="cardMockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
      if (noteClean) {
        return `${figure}<p class="cardMockupNote">${escapeAttr(noteClean)}</p>`;
      }
      return figure;
    }
  );
}

function transformHintMarkers(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*HINT\s+([^\]]+?)\s*\]\s*<\/p>/gi,
    (_match, text) => {
      const textClean = text.trim();
      return `<p class="cmsHint">${escapeAttr(textClean)}</p>`;
    }
  );
}

function wrapMockupRows(html: string): string {
  return html.replace(
    /(<figure\s+class="(?:bannerMockup|phoneMockup|cardMockup)"[^>]*>[\s\S]*?<\/figure>(?:\s*<figure\s+class="(?:bannerMockup|phoneMockup|cardMockup)"[^>]*>[\s\S]*?<\/figure>)+)/g,
    '<div class="mockupRow">$1</div>'
  );
}

function wrapBlockquoteGroups(html: string): string {
  return html.replace(
    /(<blockquote\b[^>]*>[\s\S]*?<\/blockquote>(?:\s*<blockquote\b[^>]*>[\s\S]*?<\/blockquote>)+)/g,
    "<div>$1</div>"
  );
}

function preprocess(html: string): string {
  return wrapBlockquoteGroups(markHighlightedCards(wrapMockupRows(transformCardMockups(transformPhoneMockups(transformBannerMockups(transformHintMarkers(transformNoteMarkers(html))))))));
}

export const CmsContent = ({ body }: CmsContentProps) => {
  return (
    <article
      className={style.content}
      dangerouslySetInnerHTML={{ __html: preprocess(body) }}
    />
  );
};
