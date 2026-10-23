// 建設業ページの「事務の全体マップ」に並べるカード。
// group は見た目の区別に使う:
//   featured … 先頭の大きいカード3枚（料金を出す）
//   now / plan … それ以降の小カード（.mini）

interface MapCardType {
  tag: "dev" | "on-sale" | "plan", // dev: 開発中, on-sale: 提供中, plan: 構想中
  group: "featured" | "now" | "plan",
  title: string,
  description: string,
  price?: string
}

export const mapCard: MapCardType[] = [
  {
    tag: "on-sale",
    group: "featured",
    title: "領収書仕分け自動化",
    description: "スキャンするだけで、AIが日付・金額・科目を読み取り月別・科目別フォルダへ自動整理。税理士さんへはフォルダ共有するだけ。個人・法人の混在もカード番号で自動判別。",
    price: "料金はお問い合わせください"
  },
  {
    tag: "dev",
    group: "featured",
    title: "見積書・請求書の自動作成",
    description: "フォーム入力から過去単価を自動照合して見積書を生成。確定後は請求書への変換・送信まで一気通貫。先行モニター募集中（初期費用優遇）。",
    price: "近日公開<small>先行モニター受付中</small>"
  },
  {
    tag: "on-sale",
    group: "featured",
    title: "AI導入サポート",
    description: "「何から始めればいいか分からない」への伴走。月1回のレクチャーから自動化の構築まで、レベルに合わせて設計します。",
    price: "料金はお問い合わせください"
  },
  {
    tag: "dev",
    group: "now",
    title: "交通費の自動計算",
    description: "フォーム選択式。見積書の自動作成に組み込み済み。",
  },
  {
    tag: "on-sale",
    group: "now",
    title: "新規入場書類の自動作成",
    description: "フォーム入力→書類一式を自動生成。",
  },
  {
    tag: "on-sale",
    group: "now",
    title: "図面PDFから数量の拾い出し",
    description: "床材やクロスの面積を図面から拾い、見積の下書きにします。",
  },
  {
    tag: "on-sale",
    group: "now",
    title: "メール自動返信",
    description: "定型の問い合わせにテンプレ返信を自動化。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "安全書類のチェック・期限アラート",
    description: "資格証をスマホ撮影→自動読取→期限前にLINEで催促。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "施工写真の自動仕分け・台帳生成",
    description: "撮影するだけでAIが工程判別→写真台帳PDFまで自動。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "音声入力で日報の自動生成",
    description: "スマホに吹き込む→日報と関係者への連絡文に自動変換。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "職人シフトのLINE調整",
    description: "日程登録→下請けLINEへ自動通知→ボタン回答で台帳同期。言った言わないを消す。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "発注書の自動作成",
    description: "見積確定→品番・数量・商社を自動振り分け→発注書生成。",
  },  
  {
    tag: "plan",
    group: "plan",
    title: "支払管理（職人・商社）",
    description: "職人への支払と仕入支払を一元管理。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "入金突合・未入金アラート",
    description: "請求と入金を自動照合→未入金を知らせて消し込みまで。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "複数の問屋の見積の比較",
    description: "複数問屋の見積を一発比較。",
  },
  {
    tag: "plan",
    group: "plan",
    title: "内装特化の職人マッチング",
    description: "工種・対応メーカー・実績で探せる職人マッチング。",
  },
]

export const tagLabel = { "on-sale": "提供中", dev: "開発中", plan: "構想中" } as const;
