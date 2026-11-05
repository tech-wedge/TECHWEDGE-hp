// ビルドの後に dist/sitemap.xml の各 URL へ <lastmod> を付ける。
// 日付は「その頁のファイル」と「頁が直接 import している src の中のファイル」の、git の最後の commit の日。
// git の履歴が浅い（shallow）時は1回だけ取り直し、取れなければ何も付けない（全頁が同じ日になって嘘の日付になるため）。
// 途中で何が起きてもビルドは止めない：警告を1行出して、sitemap は元のまま残す。
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function isFile(p) {
  return existsSync(p) && statSync(p).isFile();
}

// "/" → src/pages/index.astro、"/construction" → src/pages/construction.astro
export function pageFileFor(root, loc) {
  const path = new URL(loc).pathname.replace(/\/$/, "");
  const name = path === "" ? "index" : path.slice(1);
  const file = join(root, "src", "pages", `${name}.astro`);
  return isFile(file) ? file : null;
}

// 頁が直接 import している相対パスのファイル（src の中だけ）。
// 頁は "../components/X.astro" や "../data/x" の形だけを使っている（2026-11-05 に全頁を数えた）。
// エイリアス（@/…）は使っていないので拾わない。ディレクトリは配下の無関係な変更まで拾うので外す。
export function directImports(root, file) {
  const src = readFileSync(file, "utf8");
  const out = [];
  for (const m of src.matchAll(/^\s*import\s+(?:[^"']*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/gm)) {
    const base = resolve(dirname(file), m[1]);
    const hit = ["", ".ts", ".js", ".mjs", ".astro"].map((ext) => base + ext).find(isFile);
    if (hit && hit.startsWith(join(root, "src"))) out.push(hit);
  }
  return out;
}

// 渡したファイルの中で一番新しい commit の日（YYYY-MM-DD）。どれも commit が無ければ null
export function lastCommitDate(root, files) {
  const out = git(root, ["log", "-1", "--format=%cs", "--", ...files]);
  return out || null;
}

export function addLastmod(xml, dateFor) {
  return xml.replace(/<url>\s*<loc>([^<]+)<\/loc>/g, (whole, loc) => {
    const d = dateFor(loc);
    return d ? `${whole}\n    <lastmod>${d}</lastmod>` : whole;
  });
}

// 履歴が全部あれば true。浅い時は1回だけ取り直す
function fullHistory(root, logger) {
  if (git(root, ["rev-parse", "--is-shallow-repository"]) === "false") return true;
  // Cloudflare Pages は履歴を浅く取ってくる（2026-11-05 の PR のプレビューで lastmod 0）
  try {
    git(root, ["fetch", "--unshallow", "--quiet"]);
  } catch {
    // 取り直せなければ下で false
  }
  if (git(root, ["rev-parse", "--is-shallow-repository"]) !== "false") return false;
  logger.info("浅い履歴を取り直した");
  return true;
}

export function writeLastmod(root, out, logger) {
  if (!existsSync(out)) return 0;
  try {
    if (!fullHistory(root, logger)) {
      logger.warn("git の履歴が浅いので lastmod を付けない");
      return 0;
    }
    const xml = readFileSync(out, "utf8");
    let n = 0;
    const next = addLastmod(xml, (loc) => {
      const page = pageFileFor(root, loc);
      if (!page) return null;
      const d = lastCommitDate(root, [page, ...directImports(root, page)]);
      if (d) n++;
      return d;
    });
    writeFileSync(out, next);
    logger.info(`lastmod を ${n} 件付けた`);
    return n;
  } catch (e) {
    logger.warn(`lastmod を付けられなかった（sitemap は元のまま）: ${String(e.message || e).split("\n")[0]}`);
    return 0;
  }
}

export default function sitemapLastmod({ root = process.cwd() } = {}) {
  return {
    name: "sitemap-lastmod",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        writeLastmod(root, join(fileURLToPath(dir), "sitemap.xml"), logger);
      },
    },
  };
}
