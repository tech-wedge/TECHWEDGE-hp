// HP制作ページの中身（実績・デザインサンプル・制作の流れ）。

export interface WorkCard {
  href: string;
  /** 外部サイトは別タブで開く */
  external?: boolean;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export const works: WorkCard[] = [
  {
    href: "/",
    image: "/assets/results/result_techwedge.png",
    imageAlt: "TechWedge HPのスクリーンショット",
    title: "TechWedge HP",
    description: "今ご覧いただいているこのサイト自体が制作実績です。「現場を動かす人に、テクノロジーを。」がコンセプト。",
  },
  {
    href: "https://akiyamusubu.jp",
    external: true,
    image: "/assets/results/result_akiyamusubu.png",
    imageAlt: "アキヤムスブのスクリーンショット",
    title: "アキヤムスブ",
    description: "空き家関連事業のコーポレートサイト。コラム記事・エリア別ページを含む複数ページ構成。",
  },
  {
    href: "https://myshia.jp",
    external: true,
    image: "/assets/results/result_myshia.png",
    imageAlt: "myshia HPのスクリーンショット",
    title: "myshia HP",
    description: "内装金物業myshiaのコーポレートサイト。施工会社向けの信頼要件を意識した構成。",
  },
];

export interface DesignSample {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

/** すべて制作見本用の架空の店舗。カードの札の文言は全件共通 */
export const sampleTagLabel = "デザインサンプル（架空の店舗です・写真はイメージです）";

export const designSamples: DesignSample[] = [
  {
    image: "/assets/mock/mock_koumuten.webp",
    imageAlt: "工務店の架空の店舗のデザインサンプル（大和田工務店・架空）",
    title: "工務店",
    description: "地域密着・信頼感重視のレイアウト例。施工実績・お客様の声を前面に出す構成。",
  },
  {
    image: "/assets/mock/mock_tosou.webp",
    imageAlt: "塗装工事店の架空の店舗のデザインサンプル（アオバネ塗装・架空）",
    title: "塗装工事店",
    description: "高コントラストな写真とドラマチックな配色で魅せる、プロフェッショナル感重視のレイアウト例。",
  },
  {
    image: "/assets/mock/mock_denki.webp",
    imageAlt: "電気工事店の架空の店舗のデザインサンプル（ソラト電設・架空）",
    title: "電気工事店",
    description: "整然としたグリッド構成と技術文書のような端正さで、精密さ・信頼感を伝えるレイアウト例。",
  },
  {
    image: "/assets/mock/mock_naiso.webp",
    imageAlt: "内装工事店の架空の店舗のデザインサンプル（木もれ内装・架空）",
    title: "内装工事店",
    description: "木材の質感と自然光を活かした、丁寧な手仕事を伝える温かみのあるレイアウト例。",
  },
  {
    image: "/assets/mock/mock_shokudo.webp",
    imageAlt: "食堂の架空の店舗のデザインサンプル（食堂ひなた・架空）",
    title: "食堂",
    description: "メニュー写真とアクセス情報を軸にした、来店導線を意識した構成例。",
  },
  {
    image: "/assets/mock/mock_biyou.webp",
    imageAlt: "美容室の架空の店舗のデザインサンプル（hair salon Lumo・架空）",
    title: "美容室",
    description: "世界観重視のビジュアル型レイアウト例。予約導線とスタイル写真を軸に構成。",
  },
  {
    image: "/assets/mock/mock_zeirishi.webp",
    imageAlt: "税理士事務所の架空の店舗のデザインサンプル（みずき税理士事務所・架空）",
    title: "士業（税理士）",
    description: "誠実さ・専門性を伝える落ち着いたレイアウト例。相談導線を最優先にした構成。",
  },
  {
    image: "/assets/mock/mock_zakka.webp",
    imageAlt: "雑貨店の架空の店舗のデザインサンプル（くらしの店とんぼ・架空）",
    title: "雑貨店",
    description: "商品の世界観を伝えるビジュアル重視のレイアウト例。オンラインショップへの導線も意識した構成。",
  },
];

export interface FlowStep {
  no: string;
  title: string;
  description: string;
}

export const flowSteps: FlowStep[] = [
  {
    no: "STEP 1",
    title: "ヒアリング",
    description: "お店・会社のこと、そして「人柄」や雰囲気を聞かせてください。落ち着いた感じか、元気な感じか——ここが決まればデザインは自然と決まります。",
  },
  {
    no: "STEP 2",
    title: "デザイン案",
    description: "ヒアリング内容をもとにデザイン案を作成。イメージのすり合わせを行います。",
  },
  {
    no: "STEP 3",
    title: "修正",
    description: "気になる箇所を修正。納得いただけるまでやり取りします。",
  },
  {
    no: "STEP 4",
    title: "公開",
    description: "公開作業もこちらで実施。公開後の相談も引き続き受け付けます。",
  },
];
