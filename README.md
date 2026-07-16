# TechWedge HP

3人のAI自動化チーム（悠太・かげ・三富）のコーポレートサイト。静的HTML＋最小JS・フレームワークなし。

> **設計の正本**: vault `業務効率化PJ/HP設計_TechWedge_2026-07.md`（コンセプト・確定事項・サイトマップ台帳・残作業の実行書）。**コードを触る前に必ず正本§1（確定事項）と§11（実行書）を読むこと。**

## 起動

- そのままブラウザで `index.html` を開けば動く（ビルド不要）
- サーバー経由: `.claude/launch.json` の `techlore-hp`（port 3008）／手動なら `npx serve -p 3008 .`

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | トップ（ハブ）。業種入り口2枚 |
| `construction.html` | 建設業LP（主力・DM営業の着地先）。15業務マップ |
| `tax.html` | 税理士LP（先行パートナー募集構成） |
| `training.html` | AI研修LP（助成金・レーザー階段） |
| `contact.html` | 無料相談（Formspree接続済み） |
| `company.html` | 運営者情報 |
| `privacy.html` | プライバシーポリシー（noindex） |
| `404.html` | 断線演出 |
| `robots.txt` | 検索エンジンからの発見を抑制中（Disallow: /）。公開解禁時に削除 or 内容変更 |
| `assets/tokens.css` | **デザイントークン（色・書体・easing）。カラー変更はここ1枚** |
| `assets/base.css` | 共有コンポーネント全部 |
| `assets/site.js` | ブランド名定数・モーション（出現/カウンタ/慣性基準線/磁気CTA） |
| `assets/ogp.png` | OGP画像（1200×630px） |
| `assets/favicon.svg` / `favicon-32.png` / `apple-touch-icon.png` | favicon一式（基準線モチーフ） |

## 編集ルール（壊すと悠太チェックで差し戻しになるやつ）

1. **組織名の変更**: `assets/site.js` 冒頭の `BRAND_HEAD` / `BRAND_TAIL` / `BRAND_PROVISIONAL` だけ。HTMLに直書きしない
2. **カラー変更**: `tokens.css` のみ。緑(#2EA043)は「CTA・実測数字・基準線」限定＝装飾に使わない。純黒(#000)禁止
3. **⚠ 助成金の表現は変更禁止級**: 「対象となる場合があります」「要件・審査あり」「支給を保証するものではありません」「適用時の目安」をセットで維持。**断定表現（「国が出します」「必ず戻る」等）は景表法リスクで悠太NG済み**（2026-07-06裁定）
4. **確定コピー**: タグライン「現場を動かす人に、テクノロジーを。」／「自動化できないものは『できない』と言います」は変更禁止
5. **数字は一次ソースから**: 実測値（90%・3.5h→20分・400件）の出典は vault `業務効率化PJ/建設業向け/営業資料/領収書仕分け_BeforeAfter.md`。新しい数字を足すときは必ず出典確認。**ダミー数字・盛り禁止**
6. **禁止コピー**: 詩的表現・楽屋裏説明・想像のFAQ・競合実名・営業戦略の内部図解

## 新ページの追加レシピ

1. `company.html` をコピーしてリネーム（最小構成のため雛形に最適）
2. `<title>`・`<meta description>`・ヒーロー・本文セクションを書き換え（セクションは `sec-head` の連番を維持）
3. ナビの `class="now"` を自ページに付け替え、**全ページのnav/footerに新ページへのリンクを追加**
4. 追加してよいページは正本§7の台帳にあるものだけ。**解禁トリガーが満ちてないページは作らない**
5. 公開前に正本§11のQAチェックを通す

## デプロイ（完了・正本§11参照）

Cloudflare Pages。GitHub非公開リポジトリ `baaaayu8888/techlore-hp` → Pages自動デプロイ → カスタムドメイン `tech-wedge.com` 接続済み。git pushで自動反映。

## ✅ 検索エンジン公開解禁済み（2026-07-16 悠太のGOスイッチで実行）

2026-07-10〜07-16は修正継続中のため`robots.txt`（Disallow: /）＋全ページnoindexで意図的に検索エンジンから隠していたが、**悠太の明示指示（「解禁していいよ」）を受けて2026-07-16に解禁実行済み**（commit `de87088`）。

- `robots.txt`を`Allow: /`＋`Sitemap:`行に変更、本番反映確認済み
- 全6ページ（index/construction/tax/training/contact/company）の`noindex`メタタグを削除、本番反映確認済み
- `privacy.html`/`404.html`は方針通り`noindex`のまま維持

**残タスク【悠太スイッチ・未実施】**: Google Search Console登録・所有権確認（DM送信開始前が期限の目安）。`sitemap.xml`は作成済みで登録時にそのまま使える。
