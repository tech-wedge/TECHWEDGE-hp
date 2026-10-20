// scripts/add-gtm.mjs
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const GTM_ID = "GTM-NRNZJF4D";
const DRY_RUN = process.argv.includes("--dry-run");
const ROOT = process.cwd();
const IGNORE_DIRS = new Set(["node_modules", ".git", "scripts"]);

const HEAD_SNIPPET = `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;

const BODY_SNIPPET = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        files.push(...(await findHtmlFiles(fullPath)));
      }
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function insertAfter(html, regex, snippet) {
  const match = html.match(regex);
  if (!match) return null;
  const index = match.index + match[0].length;
  return html.slice(0, index) + snippet + html.slice(index);
}

async function main() {
  if (GTM_ID === "GTM-XXXXXXX") {
    console.error("❌ GTM_ID を書き換えてから実行してな");
    process.exit(1);
  }

  const files = await findHtmlFiles(ROOT);
  const result = { updated: [], skipped: [], failed: [] };

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    let html = await readFile(file, "utf8");

    // すでに入ってたら二重挿入しない
    if (html.includes("googletagmanager.com/gtm.js")) {
      result.skipped.push(rel);
      continue;
    }

    // <head> 内：<meta charset> があればその直後、なければ <head> の直後
    const afterCharset = insertAfter(html, /<meta\s+charset[^>]*>/i, HEAD_SNIPPET);
    const withHead = afterCharset ?? insertAfter(html, /<head[^>]*>/i, HEAD_SNIPPET);
    if (!withHead) {
      result.failed.push(`${rel}（<head> が見つからない）`);
      continue;
    }

    // <body> の開始タグ直後
    const withBody = insertAfter(withHead, /<body[^>]*>/i, BODY_SNIPPET);
    if (!withBody) {
      result.failed.push(`${rel}（<body> が見つからない）`);
      continue;
    }

    if (!DRY_RUN) await writeFile(file, withBody, "utf8");
    result.updated.push(rel);
  }

  console.log(`\n${DRY_RUN ? "🔍 [お試し実行] " : ""}対象HTML: ${files.length}件`);
  console.log(`✅ 挿入${DRY_RUN ? "予定" : "済み"}: ${result.updated.length}件`);
  result.updated.forEach((f) => console.log(`   - ${f}`));
  console.log(`⏭  既に入っててスキップ: ${result.skipped.length}件`);
  result.skipped.forEach((f) => console.log(`   - ${f}`));
  console.log(`⚠️  失敗: ${result.failed.length}件`);
  result.failed.forEach((f) => console.log(`   - ${f}`));
}

main();