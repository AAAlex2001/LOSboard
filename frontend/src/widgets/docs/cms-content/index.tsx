import style from "./style.module.scss";

interface CmsContentProps {
  body: string;
  variant?: "default" | "stacked";
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
      const displayMaxWidth = Math.min(wNum, 400);
      const figure = `<figure class="bannerMockup" style="aspect-ratio: ${wNum} / ${hNum}; max-width: ${displayMaxWidth}px; max-height: 500px; margin-top: 50px; margin-left: auto; margin-right: auto;"><figcaption class="bannerMockupLabel"><span class="bannerMockupSize">${wNum} × ${hNum}</span><span class="bannerMockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
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
      const figure = `<figure class="phoneMockup" style="margin-top: 50px; margin-left: auto; margin-right: auto;"><figcaption class="phoneMockupLabel"><span class="phoneMockupSize">${wNum} × ${hNum}</span><span class="phoneMockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
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
      const noteStyle = "color:rgba(17,41,189,0.5);text-align:center;font-size:16px;line-height:19px;font-weight:400;font-family:Inter;";
      return `<p class="cmsNote" style="${noteStyle}">${escapeAttr(textClean)}</p>`;
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
      const displayMaxWidth = Math.min(wNum, 400);
      const figure = `<figure class="cardMockup" style="aspect-ratio: ${wNum} / ${hNum}; max-width: ${displayMaxWidth}px; max-height: 500px; margin-top: 50px; margin-left: auto; margin-right: auto;"><figcaption class="cardMockupLabel"><span class="cardMockupSize">${wNum} × ${hNum}</span><span class="cardMockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
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

function forceBlockquoteWidth(html: string): string {
  return html;
}

function unwrapHeadingDivs(html: string): string {
  return html.replace(
    /<div[^>]*>\s*(<h[1-4]\b[^>]*>[\s\S]*?<\/h[1-4]>)\s*<\/div>/gi,
    "$1"
  );
}

function wrapParensInHeadings(html: string): string {
  return unwrapHeadingDivs(html).replace(
    /<(h[1-4])\b([^>]*)>([\s\S]*?)<\/h[1-4]>/gi,
    (_match, tag, attrs, content) => {
      const cleanedAttrs = attrs
        .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
        .replace(/\sstyle\s*=\s*'[^']*'/gi, "")
        .replace(/\salign\s*=\s*"[^"]*"/gi, "")
        .replace(/\sclass\s*=\s*"[^"]*"/gi, "")
        .replace(/\sclass\s*=\s*'[^']*'/gi, "");
      const styleAttr = ' style="text-align:left;font-size:16px;line-height:19px;font-weight:600;width:100%;display:block;"';
      let inner = content.replace(/\s*\(([^)]+)\)/g, ' <span class="cmsParen">($1)</span>');
      const wrappedStrongRe = /^\s*<strong\b[^>]*>([\s\S]*)<\/strong>\s*$/i;
      const m = inner.match(wrappedStrongRe);
      if (m) inner = m[1];
      inner = inner.replace(/<br\s*\/?>(?:\s*<br\s*\/?>)*/gi, " ");
      return `<${tag}${cleanedAttrs}${styleAttr}>${inner}</${tag}>`;
    }
  );
}

function preprocess(html: string): string {
  return forceBlockquoteWidth(
    wrapBlockquoteGroups(
      markHighlightedCards(
        wrapMockupRows(
          transformCardMockups(
            transformPhoneMockups(
              transformBannerMockups(
                transformHintMarkers(
                  transformNoteMarkers(
                    wrapParensInHeadings(html)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

export const CmsContent = ({ body, variant = "default" }: CmsContentProps) => {
  let processed = preprocess(body);
  if (variant === "stacked") {
    processed = processed.replace(
      /<blockquote\b([^>]*)>/gi,
      (_m, attrs) => {
        const cleanedAttrs = attrs
          .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
          .replace(/\sstyle\s*=\s*'[^']*'/gi, "");
        return `<blockquote${cleanedAttrs} style="width:100%;max-width:100%;box-sizing:border-box;">`;
      }
    );
  }
  return (
    <article
      className={style.content}
      data-variant={variant}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
};
