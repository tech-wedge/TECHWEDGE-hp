export const sitePages = [
  {key: "construction", href: "/construction.html", label: "建設業の方へ"},
  {key: "tax", href: "/tax.html", label: "税理士の方へ"},
  {key: "training", href: "/training.html", label: "AI研修"},
  {key: "web", href: "/web.html", label: "HP制作"},
  {key: "cases", href: "/cases.html", label: "導入事例"},
  {key: "columns", href: "/columns.html", label: "コラム"},
  {key: "company", href: "/company.html", label: "運営者"},
]as const;

export const contactPage = { key: "contact", href: "/contact.html" } as const;
export type PageKey = ( typeof sitePages )[number]["key"] | typeof contactPage.key;