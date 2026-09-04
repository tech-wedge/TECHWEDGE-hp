// チラシHTML → A4のPNG/PDF書き出し（08-01の書き出しツールが残っとらんかったので新設）
//   node tools/render_flyer.mjs assets/flyer_all_v2.html exports/techwedge_flyer_all_v3
// ★A4実寸で出す。紙面が溢れとらんかもここで分かる（掟13-6＝実測値で確認する）
// 2026-09-04: 依存先（../../yasaka-camp-app/node_modules/playwright）が消失し使用不可だったため
//   puppeteer-core（このリポジトリ直下 package.json・npm install済み）＋既存Chromeバイナリに置き換え
import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const [src, outBase] = process.argv.slice(2)
if (!src || !outBase) { console.error('usage: node tools/render_flyer.mjs <html> <out-basename>'); process.exit(1) }

const abs = path.resolve(src)
if (!fs.existsSync(abs)) { console.error('no such file: ' + abs); process.exit(1) }

// ★A4は96dpiで 794×1123 CSSpx。ここを2倍(1588)にすると「紙が2倍幅」になって
//   本文が横に流れ、縦がスカスカの別物が出る（2026-08-20に代行が一度やった）
//   高解像度が要るときは deviceScaleFactor で上げる。CSS幅は794のまま触らん
const A4_W = 794, A4_H = 1123
const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: A4_W, height: A4_H, deviceScaleFactor: 2 })
await page.goto('file:///' + abs.replace(/\\/g, '/'), { waitUntil: 'networkidle0' })

// ★A4に収まっとるかを実測（印刷所で刷ってから発覚するのを防ぐ）
// ⚠この紙面は 1588×2246 ＝ A4の2倍解像度で組んである。
//   1倍のA4高さ(1123px)と比べたら必ず「はみ出し1123px」いう嘘の値が出る（2026-08-20に代行が一度やった）
//   → ビューポート高（＝A4の実寸に対応させた高さ）と比べる
const VP_H = A4_H
const fit = await page.evaluate((vp) => {
  const h = document.documentElement.scrollHeight
  return { pageH: h, vp, overflowPx: h - vp }
}, VP_H)
console.log(
  fit.overflowPx > 2
    ? `🚨A4実測: 紙面 ${fit.pageH}px ／ 紙 ${fit.vp}px ／ ★はみ出し ${fit.overflowPx}px（約${(fit.overflowPx / A4_H * 297).toFixed(1)}mm）`
    : `✅A4実測: 紙面 ${fit.pageH}px ／ 紙 ${fit.vp}px ／ 収まっとる（差 ${fit.overflowPx}px）`
)

fs.mkdirSync(path.dirname(path.resolve(outBase)), { recursive: true })
await page.screenshot({ path: outBase + '.png', fullPage: true })
await page.pdf({ path: outBase + '.pdf', format: 'A4', printBackground: true })
await browser.close()
console.log(`書き出し: ${outBase}.png / ${outBase}.pdf`)
