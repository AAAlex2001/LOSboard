import DOMPurify from "isomorphic-dompurify";

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

interface MockupTransformerOptions {
  keyword: "BANNER" | "PHONE" | "CARD";
  classPrefix: "banner" | "phone" | "card";
  useAspectRatio: boolean;
}

/** Порождает трансформер mockup-маркера. useAspectRatio добавляет aspect-ratio и фикс max-width/max-height (banner/card); без него используется фикс-ширина из CSS (phone). */
function makeMockupTransformer(opts: MockupTransformerOptions): (html: string) => string {
  const pattern = new RegExp(
    `<p\\b[^>]*>\\s*(?:<br\\s*/?>)?\\s*\\[\\s*${opts.keyword}\\s+(\\d+)\\s*x\\s*(\\d+)\\s+([^;\\]]+?)(?:\\s*;\\s*([^\\]]+?))?\\s*\\](?:<br\\s*/?>)?\\s*</p>`,
    "gi"
  );
  return (html: string): string =>
    html.replace(pattern, (_match, w, h, name, note) => {
      const wNum = parseInt(w, 10);
      const hNum = parseInt(h, 10);
      const nameClean = name.trim();
      const noteClean = note ? note.trim() : "";
      const baseStyle = "margin-top: 50px; margin-left: auto; margin-right: auto;";
      let figureStyle = baseStyle;
      if (opts.useAspectRatio) {
        const displayMaxWidth = Math.min(wNum, 400);
        figureStyle = `aspect-ratio: ${wNum} / ${hNum}; max-width: ${displayMaxWidth}px; max-height: 500px; ${baseStyle}`;
      }
      const figure = `<figure class="${opts.classPrefix}Mockup" style="${figureStyle}"><figcaption class="${opts.classPrefix}MockupLabel"><span class="${opts.classPrefix}MockupSize">${wNum} × ${hNum}</span><span class="${opts.classPrefix}MockupName">${escapeAttr(nameClean)}</span></figcaption></figure>`;
      if (noteClean) {
        return `${figure}<p class="${opts.classPrefix}MockupNote">${escapeAttr(noteClean)}</p>`;
      }
      return figure;
    });
}

const transformBannerMockups = makeMockupTransformer({
  keyword: "BANNER",
  classPrefix: "banner",
  useAspectRatio: true,
});

const transformPhoneMockups = makeMockupTransformer({
  keyword: "PHONE",
  classPrefix: "phone",
  useAspectRatio: false,
});

const transformCardMockups = makeMockupTransformer({
  keyword: "CARD",
  classPrefix: "card",
  useAspectRatio: true,
});

/** Порождает трансформер текстового маркера (NOTE/HINT) в параграф с заданным классом и необязательным inline-стилем. */
function makeMarkerTransformer(
  keyword: "NOTE" | "HINT",
  className: string,
  extraStyle?: string
): (html: string) => string {
  const pattern = new RegExp(
    `<p\\b[^>]*>\\s*(?:<br\\s*/?>)?\\s*\\[\\s*${keyword}\\s+([^\\]]+?)\\s*\\](?:<br\\s*/?>)?\\s*</p>`,
    "gi"
  );
  return (html: string): string =>
    html.replace(pattern, (_match, text) => {
      const textClean = text.trim();
      const styleAttr = extraStyle ? ` style="${extraStyle}"` : "";
      return `<p class="${className}"${styleAttr}>${escapeAttr(textClean)}</p>`;
    });
}

const transformNoteMarkers = makeMarkerTransformer(
  "NOTE",
  "cmsNote",
  "color:rgba(17,41,189,0.5);text-align:center;font-size:16px;line-height:19px;font-weight:400;font-family:Inter;"
);

const transformHintMarkers = makeMarkerTransformer("HINT", "cmsHint");

function transformInlineSublabels(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*LABEL\s+([^\]]+?)\s*\]\s*<\/p>/gi,
    (_match, label) => `<p class="infoCardLabel">${escapeAttr(label.trim())}</p>`
  );
}

function transformInfoCards(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*\[\s*INFO([!\-]?)\s+([^\]]+?)\s*\]\s*<\/p>([\s\S]*?)<p\b[^>]*>\s*\[\s*\/\s*INFO\s*\]\s*<\/p>/gi,
    (_match, flag, label, inner) => {
      const labelClean = escapeAttr(label.trim());
      let className = "infoCard";
      if (flag === "!") className = "infoCard infoCardHighlighted";
      else if (flag === "-") className = "infoCard infoCardPlain";
      const innerProcessed = transformInlineSublabels(inner);
      return `<div class="${className}"><p class="infoCardLabel">${labelClean}</p><div class="infoCardBody">${innerProcessed}</div></div>`;
    }
  );
}

function wrapInfoCardGroups(html: string): string {
  return html.replace(
    /(<div class="infoCard[^"]*">[\s\S]*?<\/div><\/div>(?:\s*<div class="infoCard[^"]*">[\s\S]*?<\/div><\/div>)+)/g,
    '<div class="infoCardGroup">$1</div>'
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

function unwrapHeadingDivs(html: string): string {
  return html.replace(
    /<div[^>]*>\s*(<h[1-4]\b[^>]*>[\s\S]*?<\/h[1-4]>)\s*<\/div>/gi,
    "$1"
  );
}

function normalizeAdminHtml(html: string): string {
  let out = html;
  out = out.replace(/\sclass\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\sclass\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\sstyle\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\sstyle\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\sdata-list\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/<span\b[^>]*>/gi, "").replace(/<\/span>/gi, "");
  out = out.replace(/<p\b[^>]*>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, "");
  out = out.replace(/<p\b[^>]*>\s*<\/p>/gi, "");
  return out;
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

const ADMIN_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "span",
  ],
  ALLOWED_ATTR: ["href", "target", "rel"],
};

function preprocess(html: string): string {
  return wrapBlockquoteGroups(
    markHighlightedCards(
      wrapMockupRows(
        transformCardMockups(
          transformPhoneMockups(
            transformBannerMockups(
              wrapInfoCardGroups(
                transformInfoCards(
                  transformHintMarkers(
                    transformNoteMarkers(
                      wrapParensInHeadings(
                        normalizeAdminHtml(html)
                      )
                    )
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
  let processed = preprocess(DOMPurify.sanitize(body, ADMIN_SANITIZE_CONFIG));
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
