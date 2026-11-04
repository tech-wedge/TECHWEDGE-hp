// node --test tests/ で回す
import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { addLastmod, pageFileFor } from "../src/integrations/sitemap-lastmod.mjs";

const root = process.cwd();
const xml = `<urlset>
  <url>
    <loc>https://tech-wedge.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tech-wedge.com/nai</loc>
    <priority>0.5</priority>
  </url>
</urlset>`;

test("日付がある URL にだけ lastmod を足し、loc と priority は変えない", () => {
  const out = addLastmod(xml, (loc) => (loc.endsWith("/") ? "2026-11-03" : null));
  assert.equal((out.match(/<lastmod>/g) || []).length, 1);
  assert.match(out, /<loc>https:\/\/tech-wedge.com\/<\/loc>\n {4}<lastmod>2026-11-03<\/lastmod>/);
  assert.equal(out.replace(/\n {4}<lastmod>[^<]+<\/lastmod>/g, ""), xml);
});

test("URL から頁のファイルを引く（トップは index・無い頁は null）", () => {
  assert.equal(pageFileFor(root, "https://tech-wedge.com/"), join(root, "src", "pages", "index.astro"));
  assert.equal(pageFileFor(root, "https://tech-wedge.com/construction"), join(root, "src", "pages", "construction.astro"));
  assert.equal(pageFileFor(root, "https://tech-wedge.com/nai-page"), null);
});
