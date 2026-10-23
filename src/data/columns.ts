// コラム記事の台帳。
// ここ1箇所を直せば、コラム一覧・建設業ページのコラム欄・各記事末尾の「関連記事」が
// すべて追従する。記事を追加するときは columns に1件足して、src/pages/<slug>.astro を作る。

export type ColumnCategory = "intro" | "howto" | "people" | "ops";

export interface Column {
  /** ページのファイル名＝URL（拡張子なし） */
  slug: string;
  /** 記事タイトル。「関連記事」のリンク文言に使う */
  title: string;
  /** 一覧カードで使う短い題。省略時は title をそのまま使う */
  cardTitle?: string;
  /** 一覧カードの説明文。省略するとカードは題だけになる */
  excerpt?: string;
  /** 一覧のどの節に並べるか */
  category: ColumnCategory;
  /** 「AI入門3部作」の 1本目/2本目/3本目 のような札 */
  badge?: string;
  /** 記事末尾に出す関連記事の slug。並べた順に出る */
  related: string[];
}

export const columnCategories: { key: ColumnCategory; num: string; title: string; lead?: string }[] = [
  { key: "intro", num: "01", title: "AI入門3部作", lead: "「AIって何ができるん？」から「最初の1業務」まで、3本で一気に。" },
  { key: "howto", num: "02", title: "実測記録・ハウツー" },
  { key: "people", num: "03", title: "人材育成・組織", lead: "社内でAIを使える人が1人もいない状態から、最初の1人が生まれるまで。" },
  { key: "ops", num: "04", title: "運用の実例", lead: "AIや自動化を入れたあとに、私たちの会社で実際に起きたことと、そこから決めたルールです。" },
];

export const columns: Column[] = [
  {
    slug: "ai-jimu-koritsuka",
    title: "建設業の事務、AIに任せやすいのは「型がある仕事」",
    excerpt: "内装系金物の施工会社の実例（400件・月平均170分→20分）で、AIに任せやすい仕事と人が最終判断すべき仕事の違いを解説します。",
    category: "intro",
    badge: "1本目",
    related: ["ai-muki-fumuki", "ai-saisho-1gyoumu", "ai-jimu-dounyu-shippai"],
  },
  {
    slug: "ai-muki-fumuki",
    title: "AIが向いている業務・向いていない業務の見分け方",
    excerpt: "「手順の型」「確認記録」「その場の判断」の3軸で、自分の会社の業務を判定できます。",
    category: "intro",
    badge: "2本目",
    related: ["ai-hitorime", "ai-jimu-koritsuka", "ai-saisho-1gyoumu", "jidouka-teishi-kizukanai"],
  },
  {
    slug: "ai-saisho-1gyoumu",
    title: "建設業のAI導入、最初の1業務はどう選ぶ？",
    excerpt: "今日できる3ステップ（棚卸し・採点・候補を1つ決める）で、最初に試す業務を選べます。",
    category: "intro",
    badge: "3本目",
    related: ["ai-hitorime", "ai-jimu-koritsuka", "ai-muki-fumuki", "hp-access-mikata"],
  },
  {
    slug: "jimu-jidoka-jissoku",
    title: "月平均170分の領収書仕分けが20分になった実測記録",
    excerpt: "建設業の事務をAIで自動化した、私たち自身の実測データを公開します。",
    category: "howto",
    related: ["mitsumori-jidoka", "nyujo-shorui-koritsuka"],
  },
  {
    slug: "mitsumori-jidoka",
    title: "建設業の見積書、まだ手作業で作ってませんか？",
    cardTitle: "見積書、まだ手作業で作ってませんか？",
    excerpt: "見積書作成の自動化を検討する際の考え方を整理します。",
    category: "howto",
    related: ["nyujo-shorui-koritsuka", "jimu-jidoka-jissoku"],
  },
  {
    slug: "nyujo-shorui-koritsuka",
    title: "新規入場書類の作成、毎回イチから作っていませんか？",
    cardTitle: "新規入場書類、毎回イチから作っていませんか？",
    excerpt: "新規入場書類の作成負担を軽くする考え方を整理します。",
    category: "howto",
    related: ["mitsumori-jidoka", "jimu-jidoka-jissoku"],
  },
  {
    slug: "ai-hitorime",
    title: "真っ黒い画面のターミナルを触るのが怖かった",
    excerpt: "最初の壁は操作でも費用でもありませんでした。私たち自身の記録です。",
    category: "people",
    related: ["ai-saisho-1gyoumu", "ai-muki-fumuki"],
  },
  {
    slug: "zumen-hiroidashi-ai",
    title: "図面の拾い出しを AI に任せる前に、確かめておくことが3つあります",
    excerpt: "条件の違う2回の試験の記録と、見積に使う前の照合のやり方。",
    category: "ops",
    related: ["jidouka-teishi-kizukanai", "ai-muki-fumuki"],
  },
  {
    slug: "jidouka-teishi-kizukanai",
    title: "自動化した仕組みが止まっていても、3時間誰も気づきませんでした",
    excerpt: "朝の自動処理が止まった実例と、止まったことに気づくための3つの点検ルール。",
    category: "ops",
    related: ["ai-muki-fumuki", "ai-saisho-1gyoumu", "ai-jimu-dounyu-shippai"],
  },
  {
    slug: "ai-jimu-dounyu-shippai",
    title: "事務へのAI導入で失敗したのは、使い終わった後の片付けでした",
    excerpt: "空きメモリが0.9GBまで減った実例と、片付けを手順に入れるルール。",
    category: "ops",
    related: ["jidouka-teishi-kizukanai", "ai-jimu-koritsuka", "ai-muki-fumuki"],
  },
  {
    slug: "hp-access-mikata",
    title: "ホームページのアクセスは、どこを見ればいいのか",
    excerpt: "4つのサイトを測って分かった、合計より先に見る3つの数字。",
    category: "ops",
    related: ["jidouka-teishi-kizukanai", "ai-jimu-koritsuka", "ai-saisho-1gyoumu"],
  },
];

const bySlug = new Map(columns.map((c) => [c.slug, c]));

/** slug からコラムを引く。台帳に無い slug はビルド時に気づけるよう投げる */
export function getColumn(slug: string): Column {
  const column = bySlug.get(slug);
  if (!column) throw new Error(`columns.ts に無い slug です: ${slug}`);
  return column;
}

export function columnsIn(category: ColumnCategory): Column[] {
  return columns.filter((c) => c.category === category);
}

/** 一覧カードに出す題（cardTitle があればそちら） */
export function cardTitleOf(column: Column): string {
  return column.cardTitle ?? column.title;
}

/** 建設業ページのコラム欄に並べる6本 */
export const constructionColumnSlugs = [
  "ai-jimu-koritsuka",
  "ai-muki-fumuki",
  "ai-saisho-1gyoumu",
  "jimu-jidoka-jissoku",
  "mitsumori-jidoka",
  "nyujo-shorui-koritsuka",
];
