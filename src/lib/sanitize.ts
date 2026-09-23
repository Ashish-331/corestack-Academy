import sanitizeHtml from "sanitize-html";

/**
 * Server-side sanitiser for lesson HTML.
 *
 * The original repo stripped `on*` attributes with a regex before calling
 * `dangerouslySetInnerHTML`. That is a pattern match, not a sanitiser — it only
 * holds while every byte of HTML is developer-authored. This app stores lesson
 * bodies in Postgres where admins can edit them, so the HTML is washed through
 * sanitize-html (htmlparser2 based) before it is ever rendered.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "blockquote", "pre", "code",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u", "s", "sup", "sub", "mark", "small", "kbd", "abbr",
    "span", "div", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "col", "colgroup",
    "a", "img",
    "details", "summary",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    code: ["class"],
    pre: ["class"],
    span: ["class"],
    div: ["class"],
    p: ["class", "id"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    details: ["open", "class"],
    summary: ["class"],
    "*": ["id"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" },
    }),
  },
  exclusiveFilter: (frame) =>
    // Strip authoring-time quiz chrome: quizzes render through the typed
    // <Quiz /> component and persist through the API instead.
    frame.tag === "div" &&
    typeof frame.attribs?.class === "string" &&
    /quiz-(section|q|opt|explain|options|title)/.test(frame.attribs.class),
};

export function sanitizeLessonHtml(html: string): string {
  return sanitizeHtml(html ?? "", OPTIONS);
}

/** Notes are plain text rendered as text; this only escapes HTML entities. */
export function escapeHtml(text: string): string {
  return (text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
