// TechWedge本体サイトのトップページを撮影しチラシ実績枠へ差し替え（2026-08-25・H1タグライン変更反映のため再撮影）
// 2026-09-04: 依存先（../../yasaka-camp-app/node_modules/playwright）が消失し使用不可だったため
//   puppeteer-core（このリポジトリ直下 package.json・npm install済み）＋既存Chromeバイナリに置き換え
import puppeteer from 'puppeteer-core'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })
await page.goto('https://tech-wedge.com/', { waitUntil: 'networkidle0' })
const outPath = path.resolve('assets/results/result_techwedge.png')
await page.screenshot({ path: outPath })
await browser.close()
console.log('撮影完了: ' + outPath)
