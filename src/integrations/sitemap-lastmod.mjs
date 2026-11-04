// ビルドの後に dist/sitemap.xml の各 URL へ <lastmod> を付ける。
// 日付は「その頁のファイル」と「頁が直接 import している src の中のファイル」の、git の最後の commit の日。
// git の履歴が浅い（shallow）か git が使えない時は、全頁が同じ日になって嘘の日付になるので、何も付けずに終える。
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

// "/" → src/pages/index.astro、"/construction" → src/pages/construction.astro
export function pageFileFor(root, loc) {
  const path = new URL(loc).pathname.replace(/\/$/, "");
  const name = path === "" ? "index" : path.slice(1);
  const file = join(root, "src", "pages", `${name}.astro`);
  return existsSync(file) ? file : null;
}

// 頁が直接 import している相対パスのファイル（src の中だけ）
export function directImports(root, file) {
  const src = readFileSync(file, "utf8");
  const out = [];
  for (const m of src.matchAll(/^\s*import\s+(?:[^"']*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/gm)) {
    let p = resolve(dirname(file), m[1]);
    for (const ext of ["", ".ts", ".js", ".mjs", ".astro"]) {
      if (existsSync(p + ext)) { p = p + ext; break; }
    }
    if (existsSync(p) && p.startsWith(join(root, "src"))) out.push(p);
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

export default function sitemapLastmod() {
  return {
    name: "sitemap-lastmod",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const root = process.cwd();
        const out = join(fileURLToPath(dir), "sitemap.xml");
        if (!existsSync(out)) return;
        try {
          if (git(root, ["rev-parse", "--is-shallow-repository"]) !== "false") {
            logger.warn("git の履歴が浅いので lastmod を付けない");
            return;
          }
        } catch {
          logger.warn("git が使えないので lastmod を付けない");
          return;
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
      },
    },
  };
}
