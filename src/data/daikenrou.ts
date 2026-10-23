// 講演の体験で使う例文ページ。
// 入力欄の定義をページの markup とブラウザ側のスクリプトで共有する。

export interface PromptField {
  /** input の id */
  id: string;
  label: string;
  placeholder: string;
  /** 例文に差し込む見出し（空欄のときはこの文字がそのまま入る） */
  slot: string;
}

export const fields: PromptField[] = [
  { id: "f-yago", label: "会社名（屋号）", placeholder: "例: 〇〇内装", slot: "【屋号】" },
  { id: "f-koji", label: "得意な工事", placeholder: "例: 階段の滑り止め、床の見切り", slot: "【得意な工事】" },
  { id: "f-chiiki", label: "地域（市区町村まで）", placeholder: "例: 大阪府〇〇市", slot: "【地域】" },
];

/** 例文の組み立て。values は fields と同じ並び */
export function buildPrompt([yago, koji, chiiki]: string[]): string {
  return (
    "私は建設業の仕事をしています。\n自分の会社のホームページの見本を作ってください。\n\n" +
    "会社名：" + yago + "\n得意な工事：" + koji + "\n地域：" + chiiki + "\n\n" +
    "次の順に、スマホで読みやすい長さで書いてください。\n" +
    "1. 一番上に出す一言（20字くらい）\n2. 会社の紹介（3行くらい）\n3. 得意な工事の説明\n4. 対応している地域\n5. 見積の相談の呼びかけ\n\n" +
    "プログラムのコードではなく、そのまま読める文章で出してください。"
  );
}

/** 表示のとき、入れた言葉を1つのまとまりにして途中で折り返さないようにする目印 */
export const promptLabels = ["会社名：", "得意な工事：", "地域："];
