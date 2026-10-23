// 領収書仕分けの実測（自社・2026年1月〜6月・400件）。
// 導入事例・建設業ページ・コラム2本が同じ内訳を出しているので、数字はここ1箇所で持つ。

export interface BeforeAfterColumn {
  /** BEFORE — 手作業 のような見出し */
  heading: string;
  /** 月平均 170分 のような大きな数字 */
  total: string;
  /** 工程ごとの内訳 */
  items: string[];
}

export const receiptBefore: BeforeAfterColumn = {
  heading: "BEFORE — 手作業",
  total: "月平均 170分",
  items: [
    "紙の整理・確認 — 30分",
    "日付・金額・取引先の読み取り — 40分",
    "勘定科目の判断（12科目） — 30分",
    "個人/法人の切り分け — 20分",
    "フォルダ格納・リネーム — 20分",
    "税理士への受け渡し準備 — 15分",
    "差し戻し対応 — 15分",
  ],
};

export const receiptAfter: BeforeAfterColumn = {
  heading: "AFTER — 自動化",
  total: "月平均 20分",
  items: [
    "スキャン（1枚5秒×約70枚） — 7分",
    "AI処理 — 0分（待つだけ・作業なし）",
    "仕分け結果の確認・承認 — 10分",
    "税理士への受け渡し — 0分（常に同期）",
    "差し戻し対応 — 3分",
  ],
};
