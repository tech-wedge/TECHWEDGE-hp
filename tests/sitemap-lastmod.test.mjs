// node --test tests/ で回す
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import sitemapLastmod, { addLastmod, pageFileFor } from "../src/integrations/sitemap-lastmod.mjs";

const SITEMAP = `<urlset>
  <url>
    <loc>https://tech-wedge.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tech-wedge.com/tax</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://tech-wedge.com/nai</loc>
    <priority>0.5</priority>
  </url>
</urlset>`;

const logger = () => {
  const lines = [];
  return { lines, info: (m) => lines.push(m), warn: (m) => lines.push(`警告:${m}`) };
};

function git(cwd, args, date) {
  const env = { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date };
  return execFileSync("git", args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function put(root, path, text) {
  mkdirSync(join(root, path, ".."), { recursive: true });
  writeFileSync(join(root, path), text);
}

// トップ＝共有の部品を import・税理士＝頁だけ。日を変えて3回 commit した作業場
function makeRepo() {
  const root = mkdtempSync(join(tmpdir(), "sitemap-lastmod-"));
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "t@example.com"]);
  git(root, ["config", "user.name", "t"]);
  put(root, "src/pages/index.astro", `---\nimport Band from "../components/Band.astro";\nimport { x } from "../data/top";\n---\n`);
  put(root, "src/components/Band.astro", "a");
  put(root, "src/data/top.ts", "export const x = 1;");
  // 税理士はディレクトリを import する（配下の変更は拾わない仕様）
  put(root, "src/pages/tax.astro", `---\nimport "../data/shared";\n---\n`);
  put(root, "src/data/shared/x.ts", "1");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "1"], "2026-10-01T12:00:00+09:00");
  put(root, "src/pages/tax.astro", `---\nimport "../data/shared";\n---\nb`);
  git(root, ["commit", "-qam", "2"], "2026-10-10T12:00:00+09:00");
  put(root, "src/components/Band.astro", "c");
  put(root, "src/data/shared/x.ts", "2");
  git(root, ["commit", "-qam", "3"], "2026-10-20T12:00:00+09:00");
  return root;
}

function runHook(root) {
  const dist = mkdtempSync(join(tmpdir(), "sitemap-dist-"));
  writeFileSync(join(dist, "sitemap.xml"), SITEMAP);
  const log = logger();
  sitemapLastmod({ root }).hooks["astro:build:done"]({ dir: pathToFileURL(dist + "/"), logger: log });
  return { xml: readFileSync(join(dist, "sitemap.xml"), "utf8"), log: log.lines };
}

const dateOf = (xml, path) => (xml.match(new RegExp(`<loc>https://tech-wedge.com${path}</loc>\\n {4}<lastmod>([^<]+)</lastmod>`)) || [])[1] ?? null;

test("頁ごとに日が違う：共有の部品の commit はそれを import する頁だけに効く", () => {
  const { xml } = runHook(makeRepo());
  assert.equal(dateOf(xml, "/"), "2026-10-20");
  assert.equal(dateOf(xml, "/tax"), "2026-10-10");
  assert.equal(dateOf(xml, "/nai"), null);
});

test("浅い clone で取り直せない時は1件も付けず、sitemap は元のまま", () => {
  const src = makeRepo();
  const shallow = mkdtempSync(join(tmpdir(), "sitemap-shallow-"));
  execFileSync("git", ["clone", "-q", "--depth", "1", pathToFileURL(src).href, shallow]);
  execFileSync("git", ["remote", "set-url", "origin", join(tmpdir(), "nai-remote")], { cwd: shallow });
  const { xml, log } = runHook(shallow);
  assert.equal(xml, SITEMAP);
  assert.ok(log.some((l) => l.startsWith("警告:")));
});

test("git の無い場所でもビルドを止めず、sitemap は元のまま", () => {
  const notRepo = mkdtempSync(join(tmpdir(), "sitemap-norepo-"));
  put(notRepo, "src/pages/index.astro", "---\n---\n");
  const { xml, log } = runHook(notRepo);
  assert.equal(xml, SITEMAP);
  assert.ok(log.some((l) => l.startsWith("警告:")));
});

test("addLastmod は日がある URL にだけ足し、ほかは変えない", () => {
  const out = addLastmod(SITEMAP, (loc) => (loc.endsWith("/") ? "2026-11-03" : null));
  assert.equal((out.match(/<lastmod>/g) || []).length, 1);
  assert.equal(out.replace(/\n {4}<lastmod>[^<]+<\/lastmod>/g, ""), SITEMAP);
});

test("URL から頁のファイルを引く（無い頁は null）", () => {
  const root = makeRepo();
  assert.equal(pageFileFor(root, "https://tech-wedge.com/"), join(root, "src", "pages", "index.astro"));
  assert.equal(pageFileFor(root, "https://tech-wedge.com/nai"), null);
});
