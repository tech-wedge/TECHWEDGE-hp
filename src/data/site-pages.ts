// ヘッダー・フッターに並べるページ。順番がそのまま表示順になる。
// href は拡張子なしで統一（canonical・sitemap.xml と同じ形）
export const sitePages = [
  { key: "construction", href: "/construction", label: "建設業の方へ" },
  { key: "tax", href: "/tax", label: "税理士の方へ" },
  { key: "training", href: "/training", label: "AI研修" },
  { key: "web", href: "/web", label: "HP制作" },
  { key: "cases", href: "/cases", label: "導入事例" },
  { key: "columns", href: "/columns", label: "コラム" },
  { key: "company", href: "/company", label: "運営者" },
] as const;

export const contactPage = { key: "contact", href: "/contact" } as const;
export const privacyPage = { key: "privacy", href: "/privacy" } as const;

export type PageKey =
  | (typeof sitePages)[number]["key"]
  | typeof contactPage.key
  | typeof privacyPage.key;
