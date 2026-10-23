// 年間AI研修のカリキュラムと料金プラン。

export interface CurriculumStep {
  /** STEP 1 — 第1回 のような札 */
  no: string;
  title: string;
  description: string;
  /** 右上に出す区分（入門 / 業務活用 / 応用） */
  format: string;
}

export const curriculum: CurriculumStep[] = [
  {
    no: "STEP 1 — 第1回",
    title: "AIを触ってみる",
    description: "ChatGPT・Claudeで業務メール・議事録要約を体験。「思ったより難しくない」まで。",
    format: "入門",
  },
  {
    no: "STEP 1 — 第2回",
    title: "プロンプトの型",
    description: "「役割＋条件＋出力形式」の型を覚えて、自社業務用のプロンプトを3つ作る。",
    format: "入門",
  },
  {
    no: "STEP 2 — 第3回",
    title: "事務作業を半分に",
    description: "見積メモの清書・安全書類の下書き・報告書の定型化。明日から使える実務編。",
    format: "業務活用",
  },
  {
    no: "STEP 2 — 第4回",
    title: "スプレッドシート×AI",
    description: "データ整理・集計の自動化。手作業のコピペ仕事をここで卒業。",
    format: "業務活用",
  },
  {
    no: "STEP 3 — 第5回",
    title: "業務自動化を作る",
    description: "「ボタン1つでメール送信」を一緒に構築。自動化の作り方を体で覚える。",
    format: "応用",
  },
  {
    no: "STEP 3 — 第6回",
    title: "自分の業務をひとつ自動化する",
    description: "受講者の実業務をひとつ選んで自動化。運用・保守の注意点まで含めて仕上げる。",
    format: "応用",
  },
];

/** 階段の線（SVG）が通る点。カリキュラムの段数に合わせてある */
export const stairPoints =
  "4,98 16,98 16,82 30,82 30,66 44,66 44,50 58,50 58,34 72,34 72,18 90,18";

export interface PricingRow {
  plan: string;
  /** 年間パックだけ太字にする */
  emphasis?: boolean;
  detail: string;
}

export const pricing: PricingRow[] = [
  { plan: "年間パック", emphasis: true, detail: "全6回（1回2時間前後が目安）" },
  { plan: "Step 1 単品", detail: "入門・2回" },
  { plan: "Step 2 単品", detail: "業務活用・2回" },
  { plan: "Step 3 単品", detail: "応用・2回" },
];
