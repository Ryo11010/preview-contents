import { Briefcase, Gamepad2, Globe, Library, Scan, Scissors, ShieldCheck, Smartphone } from 'lucide-react';
import type { CategoryConfig, Project, ProjectCategory } from './types';

export const demoImages = {
  shiftScanner: 'https://www.funteru.co.jp/assets/ShiftScanner/ICON-base_ShiftScanner_dark.png',
  remoVision: 'https://www.funteru.co.jp/assets/remoVision/ICON-base_RemoVision_dark.png',
  codeClipper: 'https://www.funteru.co.jp/assets/CodeClipper/ICON-base_CodeClipper_dark.png',
  mhLab: 'https://www.funteru.co.jp/assets/MH%20Lab/ICON-base_MHLab_dark.png',
  dialectMuseum: 'https://www.funteru.co.jp/assets/dialectMusium/ICON-base_DialectMusium.png',
  corporate: 'https://www.funteru.co.jp/assets/FunterU_logo.webp',
  videoPlaceholder: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
};

export const projects: Project[] = [
  {
    id: 'shift-scanner',
    title: 'ShiftScanner',
    category: 'app',
    year: '2025',
    role: 'CEO / Lead iOS & Backend',
    tagline: 'PDF/ExcelをAI解析し、手当込み給与を±1分で試算',
    description: 'AI(OCR + Gemini)でシフト表を正規化し、給与を即座に見える化するiOSアプリ。',
    longDescription:
      'アルバイト・パート向けに多様なシフト表をAIで正規化し、交通費や深夜・残業・曜日手当を含めた給与見込みをその場で提示。紙・Excel管理の煩雑さをなくし、提出前でも収入を把握できます。',
    features: [
      'PDF/Excel/画像をドラッグ&ドロップで取り込み',
      'Geminiベースでフォーマットを自動正規化',
      '手当込みの給与シミュレーションを即時表示',
      'Apple Calendar連携で予定を同期（実装中）',
    ],
    challenges:
      '多様なフォーマットでも解析精度を落とさず、処理5分以内を維持するため、OCR二重化とFastAPI＋Geminiのスケールアウトを設計した。',
    techStack: ['SwiftUI', 'Gemini API', 'FastAPI', 'AWS', 'EventKit'],
    color: 'from-amber-400 via-orange-500 to-amber-600',
    accent: 'text-orange-600 bg-orange-50',
    icon: Scan,
    gallery: [demoImages.shiftScanner, demoImages.corporate, demoImages.videoPlaceholder],
    appStoreUrl: 'https://apps.apple.com/jp/app/shiftscanner/id6748907538',
  },
  {
    id: 'removision',
    title: 'RemoVision',
    category: 'app',
    year: '2024',
    role: 'Lead Developer',
    tagline: 'プライバシー重視の生産性可視化ツール',
    description: '顔画像をローカル破棄しつつ在席/アプリ使用時間を分析するmacOSアプリ。',
    longDescription:
      'リモートワークの「見えない労働」を、OpenCV＋TensorFlow.jsのローカル処理で可視化。顔画像は端末内で破棄し、統計データのみを暗号化保存するGDPR準拠の生産性分析ツールです。',
    features: ['リアルタイム在席検知', 'アプリ使用時間の自動分析', '顔画像を保存しないプライバシー設計', 'Chart.jsベースのダッシュボード'],
    challenges:
      'プライバシーを守りつつ95%精度を達成するため、全処理をローカル完結させ、統計データのみを暗号化保存する設計にした。',
    techStack: ['Electron', 'OpenCV', 'TensorFlow.js', 'Chart.js', 'SQLite'],
    color: 'from-teal-400 via-emerald-500 to-cyan-500',
    accent: 'text-emerald-700 bg-emerald-50',
    icon: ShieldCheck,
    gallery: [demoImages.remoVision, demoImages.corporate],
    appStoreUrl: 'https://apps.apple.com/jp/app/removision/id6745734565',
  },
  {
    id: 'codeclipper',
    title: 'CodeClipper',
    category: 'app',
    year: '2024',
    role: 'macOS Developer',
    tagline: '複数ファイルを最適分割してワンクリックコピー',
    description: 'ドラッグ&ドロップしたコードを文字数上限で自動分割し、LLM向けにコピーするmacOSユーティリティ。',
    longDescription:
      '複数ファイルを一括展開し、対象拡張子のみ抽出・結合。任意文字数上限で自動分割し、チェック付きCopyボタンでプロンプト作成を高速化します。App SandboxとNSPasteboardで安全に運用可能です。',
    features: ['フォルダごとドラッグ&ドロップ取り込み', '拡張子フィルタとプリセット', '80k文字など任意上限で自動分割', 'Copyボタンでチェック付きコピー'],
    challenges: '大量ファイルでもメモリを抑えるため、ストリーム結合と一時ファイル回避でRAM使用量を削減した。',
    techStack: ['SwiftUI', 'App Sandbox', 'NSPasteboard'],
    color: 'from-indigo-400 via-blue-500 to-sky-500',
    accent: 'text-blue-600 bg-blue-50',
    icon: Scissors,
    gallery: [demoImages.codeClipper, demoImages.corporate],
    appStoreUrl: 'https://apps.apple.com/jp/app/codeclipper/id6747144623',
  },
  {
    id: 'mhlab',
    title: 'MHLab',
    category: 'app',
    year: '2025',
    role: 'iOS Developer',
    tagline: 'スマホだけで最適装備検索 & DPS計算',
    description: 'モンハン装備ビルド検討とダメージ期待値計算をiPhone単体で完結できる攻略アプリ。',
    longDescription:
      '指定スキルを満たす装備候補検索と、武器モーション×肉質プリセットによるDPS計算をオフラインで実行。PC向けサイト依存から解放し、通信が不安定な環境でも計算できます。',
    features: ['スキルシミュレーターで装備候補検索', '武器モーション別の期待値・DPS表示', 'マイセット保存（端末ローカル）', '初回DL後は完全オフライン動作'],
    challenges: '装備組合せの組合せ爆発をDFS＋DPで高速化し、端末内データだけで5秒以内に結果を返すよう最適化した。',
    techStack: ['SwiftUI', 'Core Data', 'Combine', 'Charts'],
    color: 'from-purple-400 via-violet-500 to-indigo-500',
    accent: 'text-indigo-700 bg-indigo-50',
    icon: Gamepad2,
    gallery: [demoImages.mhLab, demoImages.corporate],
    appStoreUrl: 'https://apps.apple.com/jp/app/mhlab/id6747290689',
  },
  {
    id: 'funteru-site',
    title: 'FunterU Official Site',
    category: 'web',
    year: '2025',
    role: 'Designer / Developer',
    tagline: '楽しさとあなたを繋ぐコーポレートサイト',
    description: '液体ガラス質感で製品・受託・チームを一元紹介する公式サイト。',
    longDescription:
      'PWA対応、テーマ切替、問い合わせ導線を備えたLP。製品一覧や受託実績、メンバー情報を集約し、キャッシュコントロールとサービスワーカー制御で表示と更新を最適化しています。',
    features: ['グラスモーフィックなLP', '製品/受託/チームの一元掲載', 'PWA & キャッシュ制御', 'テーマ切替とミニヘッダー'],
    challenges: 'リッチなモーションとPWAキャッシュが干渉しないよう、バージョン管理とサービスワーカー無効化処理を組み込んだ。',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PWA'],
    color: 'from-yellow-400 via-amber-500 to-orange-400',
    accent: 'text-amber-700 bg-amber-50',
    icon: Globe,
    gallery: [demoImages.corporate, demoImages.videoPlaceholder],
    webUrl: 'https://www.funteru.co.jp',
  },
  {
    id: 'dialect-museum',
    title: '日本語ミュージアム',
    category: 'client',
    year: '2024',
    role: 'Contract Developer',
    tagline: '全国の方言を研究者向けに整理',
    description: '地図と一括ダウンロードで方言データを扱える教育系Webアプリ。',
    longDescription:
      '研究者が全国の方言を効率的に収集できるよう、地域別マップと一括ダウンロード、メタデータ付きファイル管理を備えた受託案件。教育目的のソート・タグ機能も実装。',
    features: ['地域別方言マップと検索', '音声/テキストの一括ダウンロード', 'メタデータ付きファイル管理', '教育用途のソート/タグ機能'],
    challenges: '大量音声データのダウンロードとキャッシュを最適化し、研究用途のソート要件に応えるUIを構築した。',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    color: 'from-slate-500 via-slate-600 to-slate-700',
    accent: 'text-slate-700 bg-slate-50',
    icon: Library,
    gallery: [demoImages.dialectMuseum],
  },
];

export const projectCategoryIds: readonly ProjectCategory[] = ['app', 'web', 'client'];

export const categories: CategoryConfig[] = [
  { id: 'app', label: '自社プロダクト', subLabel: 'Products', icon: Smartphone },
  { id: 'web', label: 'コーポレート', subLabel: 'Official Site', icon: Globe },
  { id: 'client', label: '受託開発', subLabel: 'Client Works', icon: Briefcase },
];

export const projectCategoryLabel: Record<Project['category'], string> = {
  app: 'Product',
  web: 'Corporate',
  client: 'Client Work',
};

export const projectLookup = projects.reduce<Record<string, Project>>((acc, project) => {
  acc[project.id] = project;
  return acc;
}, {});
