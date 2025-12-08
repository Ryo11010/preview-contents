import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Smartphone,
  Code2,
  User,
  Mail,
  ChevronRight,
  ChevronLeft,
  Github,
  Twitter,
  Layers,
  Zap,
  ExternalLink,
  Sparkles,
  Cpu,
  Globe,
  ArrowUpRight,
  Activity,
  History,
  List,
  Coffee,
  Music,
  Camera,
  Share,
  Folder,
  FileText,
  Briefcase,
  Play,
  Image as ImageIcon,
  Monitor
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

type SocialLinks = {
  github: string;
  twitter: string;
};

type Interest = {
  label: string;
  icon: IconComponent;
  color: string;
};

type Profile = {
  name: string;
  role: string;
  catchphrase: string;
  description: string;
  email: string;
  socials: SocialLinks;
  skills: string[];
  interests: Interest[];
};

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  role: string;
  tagline: string;
  description: string; // Short description
  longDescription: string; // Detailed description
  features: string[];
  challenges: string;
  techStack: string[];
  color: string;
  accent: string;
  icon?: IconComponent;
  gallery: string[]; // Array of image URLs
  videoUrl?: string; // Optional video URL
  appStoreUrl?: string;
  githubUrl?: string;
  webUrl?: string;
};

type TimelineItem = {
  year: string;
  title: string;
  desc: string;
  icon: IconComponent;
  projectId: string | null;
  color: string;
};

const SECTION_IDS = ['hero', 'work', 'history', 'about'] as const;
type SectionId = (typeof SECTION_IDS)[number];

type DockTab = {
  id: SectionId;
  icon: IconComponent;
};

type PlatformBridge = {
  isClient: boolean;
  canUseDocument: boolean;
  canShare: boolean;
  scrollToId: (id: string) => void;
  openExternalLink: (url: string) => void;
  openMailLink: (email: string) => void;
  share: (text: string) => void;
  alert: (message: string) => void;
};

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

type HeroSectionProps = {
  profile: Profile;
  onScrollToWork: () => void;
  onContact: () => void;
};

type WorkSectionProps = {
  categorizedProjects: Record<string, Project[]>;
  categories: { id: string; label: string; subLabel: string; icon: IconComponent }[];
  onSelectProject: (project: Project) => void;
};

type TimelineSectionProps = {
  items: TimelineItem[];
  onSelectProject: (project: Project) => void;
};

type AboutSectionProps = {
  profile: Profile;
  aboutTab: 'skills' | 'interests';
  options: SegmentOption<'skills' | 'interests'>[];
  onChangeTab: (tab: 'skills' | 'interests') => void;
  onContact: () => void;
};

type ProjectDetailSheetProps = {
  project: Project | null;
  onClose: () => void;
  onShare: () => void;
};

/* -------------------------------------------------------------------------- */
/* CONSTANTS (content & visual tokens)                                       */
/* -------------------------------------------------------------------------- */

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";
  
const STARDUST_TEXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N8fHxqeHgAAAB/f393d3eAgICGhQV0dHRlZWWCgoSHh4dxcXFsbGxoaGhzdXVubm5iYmJmZmZxcXFwcHBra2tFRUUwMDAkJCRWVlQW8qjlAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmBwYQKCMy24+FAAAApElEQVRIx2NgGAWjYBSMglEwCkgCRiomMNDQyKgIqY6ODqS6u7uTqG8UjIJRMApGwSgYBSMAAxMTM7OQkBBEXmZmFpG6R8EoGAWjYBSMglEwCoYnwMnJycnMzAwmHR0dEXl5eXlE6hsFo2AUjIJRMApGwXABFiYmZmbm5uYg0tLS0hKRuqE4mJmZhYWFhY2NjaG6R8EoGAWjYBSMglEwCkYBSQAAYy8D/b+65MwAAAAASUVORK5CYII=";

// Placeholder images for demo purposes
const DEMO_IMAGES = {
  app1: "https://images.unsplash.com/photo-1512941937669-90a1b5bbb695?w=800&q=80",
  app2: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
  app3: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80",
  code: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  mock1: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
  mock2: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80",
  videoPlaceholder: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80"
};

const HERO_COPY = {
  status: 'AVAILABLE FOR WORK',
  leadPrefix: 'Engineering interactions that feel',
  leadHighlight: 'alive',
  leadSuffix: '.',
};

const SHARE_COPY = {
  successTitle: 'Check this out',
  fallback: 'Shared!',
};

const LiquidTheme = {
  glass: {
    base: 'bg-white/40 backdrop-blur-3xl supports-[backdrop-filter]:bg-white/40',
    border: 'border border-white/50 ring-1 ring-white/20',
    shadow:
      'shadow-[0_8px_32px_rgba(31,38,135,0.07),inset_0_1px_0_rgba(255,255,255,0.6)]',
    active: 'active:scale-[0.98] transition-all duration-300 ease-out',
    hover:
      'hover:bg-white/50 hover:shadow-[0_8px_40px_rgba(31,38,135,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-white/80',
  },
};

const PROFILE: Profile = {
  name: 'FunDriven',
  role: 'iOS Engineer',
  catchphrase: 'Crafting Joy.',
  description:
    'コードは「書く」ものではなく「奏でる」もの。触れた瞬間にユーザーの心が動く、そんなiOSアプリケーションを作り続けています。',
  email: 'hello@fundriven.dev',
  socials: { github: 'https://github.com', twitter: 'https://twitter.com' },
  skills: [
    'Swift',
    'SwiftUI',
    'UIKit',
    'React',
    'Next.js',
    'TypeScript',
    'Core ML',
    'ARKit',
  ],
  interests: [
    { label: 'Coffee', icon: Coffee, color: 'text-amber-700 bg-amber-50' },
    { label: 'Photo', icon: Camera, color: 'text-blue-700 bg-blue-50' },
    { label: 'Music', icon: Music, color: 'text-pink-700 bg-pink-50' },
    { label: 'Sauna', icon: Sparkles, color: 'text-cyan-700 bg-cyan-50' },
  ],
};

const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'SnapDaily',
    category: 'app',
    year: '2024',
    role: 'Solo Dev',
    tagline: 'Capture life, one second at a time.',
    description: '「継続する楽しさ」をテーマにした動画日記アプリ。',
    longDescription:
      'SnapDailyは、日常の何気ない瞬間を1秒の動画として記録し、それをつなぎ合わせて人生のハイライトムービーを作成するアプリです。従来の重たい日記アプリとは異なり、「撮るだけ」の軽快さを追求しました。',
    features: [
      '1秒動画の超高速撮影＆保存',
      'カレンダービューでの視覚的な思い出管理',
      'AIによる自動ハイライト生成機能',
      'iCloud同期によるデバイス間連携',
      'プライバシー重視のローカルファースト設計'
    ],
    challenges:
      '大量の動画ファイルを扱いながらも、スクロールのカクつきをゼロにするために、AVAssetの非同期読み込みとキャッシング戦略を徹底的にチューニングしました。また、カスタムトランジションを自作し、画面遷移そのものが楽しくなるような演出を施しています。',
    techStack: ['SwiftUI', 'AVFoundation', 'CoreData', 'CloudKit'],
    color: 'from-cyan-400 via-blue-500 to-indigo-500',
    accent: 'text-cyan-600 bg-cyan-50',
    icon: Smartphone,
    gallery: [DEMO_IMAGES.app1, DEMO_IMAGES.mock1, DEMO_IMAGES.app2],
    videoUrl: 'https://example.com/demo.mp4',
    appStoreUrl: 'https://apple.com',
  },
  {
    id: 'proj-2',
    title: 'TaskFlow Pro',
    category: 'client',
    year: '2023',
    role: 'Lead Eng',
    tagline: 'Productivity for iPad.',
    description: 'iPad対応を含むユニバーサルタスク管理アプリ。',
    longDescription:
      'プロフェッショナル向けのタスク管理ツールとして、iPadの大画面を最大限に活かした3カラムレイアウトを採用。ドラッグ&ドロップによる直感的なタスク整理と、複雑なプロジェクト管理を両立させました。',
    features: [
      'iPadOSに最適化されたマルチカラムUI',
      'PencilKitを活用した手書きメモ機能',
      'ウィジェット対応',
      'Siriショートカット連携',
      'チーム共有機能'
    ],
    challenges:
      'Core DataとCloudKitの同期において、オフライン時のデータ整合性を保つためのコンフリクト解決ロジックの実装に苦労しました。また、iPadのマルチタスク機能（Split View, Slide Over）に完全対応させるため、レスポンシブなレイアウト設計を行っています。',
    techStack: ['UIKit', 'CoreData', 'PencilKit', 'CloudKit'],
    color: 'from-violet-400 via-purple-500 to-fuchsia-500',
    accent: 'text-purple-600 bg-purple-50',
    icon: Layers,
    gallery: [DEMO_IMAGES.app3, DEMO_IMAGES.mock2],
  },
  {
    id: 'proj-3',
    title: 'EcoScanner',
    category: 'client',
    year: '2023',
    role: 'ML Engineer',
    tagline: 'AI that sees the future.',
    description: 'デバイスオンデバイスでプラスチックの種類を判別するARスキャナー。',
    longDescription:
      '環境保護を目的とした、プラスチックのリサイクル区分を即座に判定するARアプリです。カメラをかざすだけで、素材（PET, PS, PPなど）をAIが識別し、正しい廃棄方法をARでオーバーレイ表示します。',
    features: [
      'リアルタイム物体検出',
      'ARによる情報オーバーレイ',
      'オフライン動作可能な軽量MLモデル',
      'リサイクルログの可視化'
    ],
    challenges:
      'Create MLを使用して独自データセットから学習モデルを作成しましたが、透明なプラスチックの識別精度を上げるのが最大の課題でした。照明条件による精度のばらつきを抑えるため、画像前処理パイプラインを工夫しています。',
    techStack: ['CoreML', 'ARKit', 'Vision', 'SwiftUI'],
    color: 'from-emerald-400 via-teal-500 to-cyan-500',
    accent: 'text-teal-600 bg-teal-50',
    icon: Zap,
    gallery: [DEMO_IMAGES.code, DEMO_IMAGES.app2],
  },
  {
    id: 'proj-4',
    title: 'Portfolio v2',
    category: 'web',
    year: '2025',
    role: 'Design & Dev',
    tagline: 'My digital playground.',
    description: 'iOSエンジニアとしてのアイデンティティをWebで表現。',
    longDescription:
      'Web技術（React, Tailwind CSS）を用いて、ネイティブアプリのような「触り心地」をWeb上で再現することを目指したポートフォリオサイトです。流体的なアニメーションと、細部まで作り込まれたマイクロインタラクションが特徴です。',
    features: [
      '物理演算風のインタラクション',
      'グラスモーフィズムデザイン',
      '完全レスポンシブ対応',
      'ダークモード対応（予定）'
    ],
    challenges:
      'Framer Motionなどのライブラリに頼らず、React標準の機能とCSSのみで複雑なアニメーションを実現することで、パフォーマンスとバンドルサイズの最適化を図りました。',
    techStack: ['Next.js', 'React', 'Tailwind CSS'],
    color: 'from-amber-400 via-orange-500 to-red-500',
    accent: 'text-orange-600 bg-orange-50',
    icon: Globe,
    gallery: [DEMO_IMAGES.code, DEMO_IMAGES.app1],
    webUrl: 'https://fundriven.dev',
    githubUrl: 'https://github.com/fundriven',
  },
];

const CATEGORIES = [
  { id: 'app', label: '自社アプリ', subLabel: 'Personal Apps', icon: Smartphone },
  { id: 'web', label: '自社サイト', subLabel: 'Official Site', icon: Globe },
  { id: 'client', label: '受託開発', subLabel: 'Client Works', icon: Briefcase },
];

const PROJECT_CATEGORY_LABEL: Record<Project['category'], string> = {
  app: 'Personal App',
  web: 'Official Site',
  client: 'Client Work',
};

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2025',
    title: 'Portfolio v2',
    desc: 'Web技術での表現の限界に挑戦。',
    icon: Globe,
    projectId: 'proj-4',
    color: 'text-orange-500',
  },
  {
    year: '2024',
    title: 'SnapDaily',
    desc: '構想から1年、動画日記アプリをリリース。',
    icon: Smartphone,
    projectId: 'proj-1',
    color: 'text-blue-500',
  },
  {
    year: '2023',
    title: 'TaskFlow Pro',
    desc: 'iPadアプリのリニューアルを主導。',
    icon: Layers,
    projectId: 'proj-2',
    color: 'text-purple-500',
  },
  {
    year: '2023',
    title: 'EcoScanner',
    desc: '環境×AIハッカソンにてBest UI賞。',
    icon: Zap,
    projectId: 'proj-3',
    color: 'text-teal-500',
  },
  {
    year: '2021',
    title: 'Dive into iOS',
    desc: 'ネイティブアプリ開発へ転向。',
    icon: Smartphone,
    projectId: null,
    color: 'text-slate-400',
  },
];

const DOCK_TABS: DockTab[] = [
  { id: 'hero', icon: Sparkles },
  { id: 'work', icon: Folder },
  { id: 'history', icon: History },
  { id: 'about', icon: User },
];

const ABOUT_OPTIONS: SegmentOption<'skills' | 'interests'>[] = [
  { label: 'Technical Skills', value: 'skills' },
  { label: 'Personal Interests', value: 'interests' },
];

const BUTTON_VARIANTS = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 border border-transparent',
  danger: 'bg-white/60 text-red-500 hover:bg-red-50 border border-red-100',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/40 shadow-none',
  glass:
    'bg-white/30 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white/50 hover:border-white/80 shadow-sm',
} as const;

const BUTTON_SIZES = {
  sm: 'py-2 px-3 text-xs',
  md: 'py-3.5 px-6 text-sm',
  lg: 'py-4 px-8 text-base',
  icon: 'p-3 rounded-2xl',
} as const;

const UI_METRICS = {
  sectionObserverThreshold: 0.3,
  dock: {
    paddingX: 8, // px
    gap: 24, // px
    buttonSize: 48, // px
  },
  mediaGalleryGap: 16, // px; gap-4 equivalent
} as const;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const createPlatformBridge = (): PlatformBridge => {
  const isClient = typeof window !== 'undefined';
  const canUseDocument = typeof document !== 'undefined';
  const canShare = typeof navigator !== 'undefined' && typeof (navigator as Navigator & { share?: unknown }).share === 'function';

  const alert = (message: string) => {
    if (!isClient) return;
    window.alert(message);
  };

  const openExternalLink = (url: string) => {
    if (!url || !isClient) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openMailLink = (email: string) => {
    if (!email || !isClient) return;
    window.location.href = `mailto:${email}`;
  };

  const scrollToId = (id: string) => {
    if (!canUseDocument) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const share = (text: string) => {
    if (canShare) {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      nav.share?.({ title: SHARE_COPY.successTitle, text }).catch(() => alert(SHARE_COPY.fallback));
      return;
    }
    alert(SHARE_COPY.fallback);
  };

  return {
    isClient,
    canUseDocument,
    canShare,
    scrollToId,
    openExternalLink,
    openMailLink,
    share,
    alert,
  };
};

const platformBridge = createPlatformBridge();

const getProjectById = (id: string | null): Project | null =>
  PROJECTS.find((project) => project.id === id) || null;

const useSectionObserver = (onSectionChange: (id: SectionId) => void, bridge: PlatformBridge) => {
  const { canUseDocument } = bridge;

  useEffect(() => {
    if (!canUseDocument || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionChange(entry.target.id as SectionId);
          }
        });
      },
      { threshold: UI_METRICS.sectionObserverThreshold }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [canUseDocument, onSectionChange]);
};

/* -------------------------------------------------------------------------- */
/* FOLDER UI COMPONENTS                                                       */
/* -------------------------------------------------------------------------- */

const PLATE_STYLE = {
  surfaceHeight: 120,
  borderRadiusPx: 20,
  perspective: 1000,
};

const FolderCardContent: React.FC<{ project?: Project }> = ({ project }) => {
  if (!project) {
    // Empty skeleton state
    return (
      <div className="w-full h-full p-4 flex flex-col gap-3">
         <div className="w-1/2 h-4 bg-white/10 rounded-md" />
         <div className="w-full h-16 bg-white/5 rounded-md" />
         <div className="flex gap-2 mt-auto">
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <div className="w-1/2 h-2 rounded-full bg-white/10 mt-2" />
         </div>
      </div>
    );
  }
  
  const Icon = project.icon || Smartphone;

  return (
    <div className="w-full h-full p-4 flex flex-col relative z-10">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80`}>
          {project.year}
        </span>
        <Icon size={16} className="text-white/60" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{project.title}</h4>
      <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed">
        {project.tagline}
      </p>
      <div className="mt-auto flex gap-1">
        {project.techStack.slice(0, 2).map(tech => (
           <span key={tech} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-white/40">{tech}</span>
        ))}
      </div>
    </div>
  );
};

const FolderCardItem = ({
  index,
  isOpen,
  isHovered,
  project,
  totalCards,
}: {
  index: number;
  isOpen: boolean;
  isHovered: boolean;
  project?: Project;
  totalCards: number;
}) => {
  // CSS Transform Logic for non-framer-motion animation
  const getTransform = () => {
    if (isOpen) {
      // Fan out
      if (totalCards === 1) return `translateY(-160px) rotate(0deg)`;
      const spreadX = 120; // max spread width
      const x = -spreadX/2 + (spreadX / (totalCards - 1 || 1)) * index;
      const rotate = -10 + (20 / (totalCards - 1 || 1)) * index;
      const y = -160 - (Math.abs(index - (totalCards-1)/2) * 10); // Arch effect
      return `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    }
    
    if (isHovered) {
      // Peek out
      const x = -20 + (40 / (totalCards - 1 || 1)) * index;
      const rotate = -5 + (10 / (totalCards - 1 || 1)) * index;
      return `translate(${x}px, -60px) rotate(${rotate}deg)`;
    }
    
    // Closed
    return `translate(0, 0) rotate(0deg)`;
  };

  const zIndex = isOpen ? 30 - Math.abs(index - (totalCards-1)/2) : 10 + index;
  
  const bgGradient = project ? `bg-gradient-to-br ${project.color}` : 'bg-slate-800';

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 mx-auto w-44 h-28 rounded-xl border border-white/20 shadow-2xl overflow-hidden origin-bottom transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${bgGradient}`}
      style={{
        transform: getTransform(),
        zIndex: Math.floor(zIndex),
      }}
    >
      <FolderCardContent project={project} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};

const FolderComponent = ({ 
  label, 
  subLabel, 
  projects = [],
  onClick
}: { 
  label: string; 
  subLabel: string; 
  projects: Project[];
  onClick: (p: Project) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // If no projects, show 1 skeleton card
  const displayCards = projects.length > 0 ? projects : [undefined]; 
  const totalCards = displayCards.length;

  const toggleFolder = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
  };
  
  const handleCardClick = (e: React.MouseEvent, p?: Project) => {
    e.stopPropagation();
    if (isOpen && p) {
        onClick(p);
    } else {
        setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
        <div
            className="relative w-64 h-64 flex items-end justify-center pb-4 cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleFolder}
            style={{ perspective: PLATE_STYLE.perspective }}
        >
            {/* Back Plate */}
            <div
            className="absolute bottom-4 w-60 h-44 bg-[#1f1f1f] rounded-3xl z-0 transition-transform duration-300 ease-out"
            style={{
                transform: `scale(${isOpen ? 0.95 : 1})`,
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
            }}
            >
            <div className="absolute -top-4 left-0 w-24 h-10 bg-[#1f1f1f] rounded-t-2xl border-t border-white/10" />
            <div
                className="w-full h-full opacity-30 mix-blend-overlay rounded-3xl"
                style={{ backgroundImage: `url(${STARDUST_TEXTURE})` }}
            ></div>
            </div>

            {/* Cards */}
            <div className="absolute bottom-8 w-full flex justify-center items-end">
                {displayCards.map((proj, idx) => (
                    <div key={proj?.id || idx} onClick={(e) => handleCardClick(e, proj)} className="contents">
                        <FolderCardItem
                            index={idx}
                            isOpen={isOpen}
                            isHovered={isHovered}
                            project={proj}
                            totalCards={totalCards}
                        />
                    </div>
                ))}
            </div>

            {/* Front Plate */}
            <div
            className="relative z-40 w-60 h-[140px] bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{
                transformOrigin: 'bottom center',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${isOpen ? -20 : 0}deg) translateZ(${isOpen ? 0 : 20}px)`,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/40 rounded-[24px] pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                     <span className="text-white font-bold text-lg drop-shadow-md tracking-tight">{label}</span>
                     <span className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">{subLabel}</span>
                     
                     {/* Interaction hint - 修正: 背景のピルを削除し、ドットを小さく薄くして控えめに */}
                     <div className={`mt-4 flex items-center justify-center gap-1.5 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-60'}`}>
                        {displayCards.map((_, i) => (
                           <div 
                             key={i} 
                             className={`rounded-full transition-all duration-300 ${
                               isOpen 
                                 ? 'w-1.5 h-1.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.4)]' 
                                 : 'w-1 h-1 bg-white/30'
                             }`} 
                           />
                        ))}
                     </div>
                </div>
                
                {/* Noise overlay */}
                <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-[24px]" style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }} />
            </div>
        </div>
        <p className="text-sm font-medium text-slate-400 mt-2 transition-opacity duration-300">
            {isOpen ? 'Select a project' : `${projects.length} Projects`}
        </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PRESENTATION COMPONENTS                                                   */
/* -------------------------------------------------------------------------- */

type LiquidContainerProps = {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  showNoise?: boolean;
};

const LiquidContainer: React.FC<LiquidContainerProps> = ({
  children,
  className = '',
  backgroundClassName = '',
  showNoise = true,
}) => (
  <div className={`relative min-h-screen w-full overflow-hidden font-sans text-slate-900 bg-[#F0F2F5] ${className}`}>
    <div className={`fixed inset-0 z-0 pointer-events-none ${backgroundClassName}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#Eef2f3] via-[#E2E2E2] to-[#C9D6FF]" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-300/30 blur-[120px] animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-l from-purple-300/30 to-pink-300/30 blur-[120px] animate-pulse"
        style={{ animationDuration: '18s' }}
      />
      <div
        className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-yellow-200/20 blur-[100px] animate-pulse"
        style={{ animationDuration: '20s' }}
      />
      {showNoise && (
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }} />
      )}
    </div>
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

type LiquidCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
  transparent?: boolean;
  glassEffect?: boolean;
  style?: React.CSSProperties;
};

const LiquidCard: React.FC<LiquidCardProps> = ({
  children,
  className = '',
  onClick,
  padding = 'p-6',
  transparent = false,
  glassEffect = true,
  style,
}) => (
  <div
    onClick={onClick}
    style={style}
    className={`
        relative
        ${
          transparent
            ? 'bg-white/10 border border-white/10'
            : glassEffect
            ? `${LiquidTheme.glass.base} ${LiquidTheme.glass.border} ${LiquidTheme.glass.shadow}`
            : 'bg-white border border-slate-100 shadow-sm'
        }
        rounded-[36px] overflow-hidden
        ${onClick ? `${LiquidTheme.glass.active} ${LiquidTheme.glass.hover} cursor-pointer` : ''}
        ${padding}
        ${className}
      `}
  >
    {!transparent && glassEffect && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none" />
    )}
    <div className="relative z-10 h-full w-full">{children}</div>
  </div>
);

type LiquidButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  className?: string;
  icon?: IconComponent;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'flex items-center justify-center font-bold rounded-2xl transition-all active:scale-95 shadow-sm relative overflow-hidden group';

  const buttonClass = [
    baseStyles,
    BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.glass,
    BUTTON_SIZES[size] || BUTTON_SIZES.md,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].join(' ');

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buttonClass} {...props}>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      )}
      {Icon && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} className={children ? 'mr-2.5' : ''} />
      )}
      {children}
    </button>
  );
};

type LiquidSegmentControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const LiquidSegmentControl = <T extends string>({ options, value, onChange }: LiquidSegmentControlProps<T>) => {
  const activeIndex = options.findIndex((option) => option.value === value);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="relative flex p-1.5 bg-slate-100/50 backdrop-blur-xl rounded-[20px] border border-white/50 shadow-inner mb-6 overflow-hidden">
      <div
        className="absolute top-1.5 bottom-1.5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/50 transition-all duration-300 ease-spring"
        style={{
          width: `calc((100% - 12px) / ${options.length})`,
          transform: `translateX(${safeIndex * 100}%)`,
          left: '6px',
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-colors duration-300 relative z-10 ${
            value === option.value ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

type LiquidSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  headerRight?: React.ReactNode;
};

const LiquidSheet: React.FC<LiquidSheetProps> = ({ isOpen, onClose, children, title, headerRight }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return;
    }
    const id = setTimeout(() => setIsRendered(false), 300);
    return () => clearTimeout(id);
  }, [isOpen]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const diff = event.touches[0].clientY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div
        className={`absolute inset-0 bg-slate-900/20 backdrop-blur-[4px] transition-opacity duration-500 pointer-events-auto ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`
          pointer-events-auto
          relative w-full max-w-2xl h-[92vh] 
          bg-white/80 backdrop-blur-3xl 
          shadow-[0_-20px_60px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]
          rounded-t-[40px] border-t border-white/60
          flex flex-col 
          transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1)
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          transform: isOpen ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragY > 0 ? 'none' : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {(title || headerRight) && (
          <div className="flex items-center justify-between px-8 pb-6 pt-2 shrink-0">
            <div className="text-2xl font-black text-slate-800 tracking-tight">{title}</div>
            {headerRight}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain bg-transparent px-6 pb-12">{children}</div>
      </div>
    </div>
  );
};

type LiquidDockProps = {
  tabs: DockTab[];
  activeId: SectionId;
  onChange: (id: SectionId) => void;
};

const LiquidDock: React.FC<LiquidDockProps> = ({ tabs, activeId, onChange }) => {
  const [isPressing, setIsPressing] = useState(false);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const hasActive = activeIndex !== -1;

  // レイアウト定数 (px単位での計算用)
  const { paddingX, gap, buttonSize } = UI_METRICS.dock;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* デザイン修正:
        - p-2: 上下左右のパディングを8pxに統一し、バーの高さを最小限に
        - gap-6: 間隔を少し詰める
        - shadow調整: スリムなバーに合わせて影を少し控えめに
      */}
      <div className="pointer-events-auto relative flex items-center gap-6 p-2 rounded-full bg-white/40 backdrop-blur-3xl shadow-[0_20px_40px_-12px_rgba(50,50,93,0.25),0_12px_24px_-16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] border border-white/40 ring-1 ring-white/20 transition-all duration-500 hover:bg-white/50 hover:scale-[1.02]">
        
        {/* アクティブな背景インジケーター（正円） */}
        {hasActive && (
          <div
            className="absolute rounded-full bg-gradient-to-b from-white to-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"
            style={{
              // 左位置 = パディング + (ボタン幅 + ギャップ) * インデックス
              left: `${paddingX + activeIndex * (buttonSize + gap)}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              top: '50%',
              transform: `translateY(-50%) scale(${isPressing ? 0.9 : 1})`,
            }}
          />
        )}

        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onPointerDown={() => {
                onChange(tab.id);
                setIsPressing(true);
              }}
              onPointerUp={() => setIsPressing(false)}
              onPointerLeave={() => setIsPressing(false)}
              onTouchEnd={() => setIsPressing(false)}
              // w-12 h-12 (48px) にサイズ変更して高さを抑える
              className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300 group`}
            >
              <div
                className={`transition-all duration-500 ease-out ${
                  isActive 
                    ? (isPressing ? 'scale-90' : 'scale-100 -translate-y-0.5') 
                    : 'scale-90 opacity-60 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-0.5'
                }`}
              >
                <Icon 
                  size={20} // ボタン縮小に合わせてアイコンも少し小さく(24->20)
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-indigo-600 drop-shadow-sm' : 'text-slate-600'
                  }`}
                />
              </div>
              
              {/* アクティブ時の下部のドットインジケーター */}
              <div 
                className={`absolute bottom-2 w-1 h-1 rounded-full bg-indigo-600 transition-all duration-500 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 translate-y-1'
                }`} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: IconComponent; title: string; align?: 'left' | 'center' }> = ({ icon: Icon, title, align = 'left' }) => (
  <div
    className={`flex items-center gap-4 mb-16 pl-2 ${
      align === 'center' ? 'justify-center' : ''
    }`}
  >
    <div className="p-3 bg-white/80 rounded-2xl shadow-sm border border-white/50 text-indigo-600">
      <Icon size={28} />
    </div>
    <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{title}</h2>
  </div>
);

/* -------------------------------------------------------------------------- */
/* SECTIONS                                                                  */
/* -------------------------------------------------------------------------- */

const HeroSection: React.FC<HeroSectionProps> = ({ profile, onScrollToWork, onContact }) => (
  <div id="hero" className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-20 pb-32">
    <div className="mb-10 animate-[fade-in-up_1s_ease-out]">
      <LiquidCard
        padding="px-5 py-2.5"
        // 修正: ここから inline-flex items-center gap-3 を削除し、カード自体のスタイルのみ残します
        className="!rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md inline-block"
      >
        {/* 修正: 中身を flex コンテナで囲み、ここで一列配置とギャップを制御します */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-slate-600 tracking-wider whitespace-nowrap">
            {HERO_COPY.status}
          </span>
        </div>
      </LiquidCard>
    </div>

    <h1 className="text-7xl md:text-[100px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 pb-4 mb-4 leading-[0.9]">
      {profile.catchphrase}
    </h1>

    <p className="text-xl md:text-3xl text-slate-600 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
      {HERO_COPY.leadPrefix}{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">
        {HERO_COPY.leadHighlight}
      </span>
      {HERO_COPY.leadSuffix}
    </p>

    <div className="flex flex-col sm:flex-row gap-5">
      <LiquidButton size="lg" onClick={onScrollToWork} icon={Folder} className="shadow-xl shadow-indigo-500/20">
        Browse Projects
      </LiquidButton>
      <LiquidButton size="lg" variant="glass" onClick={onContact} icon={Mail}>
        Contact Me
      </LiquidButton>
    </div>
  </div>
);

const WorkSection: React.FC<WorkSectionProps> = ({ categorizedProjects, categories, onSelectProject }) => {
  return (
    <div id="work" className="max-w-7xl mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
      <SectionHeader icon={Briefcase} title="Work Archives" align="center" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 justify-items-center">
        {categories.map((category) => (
            <FolderComponent
                key={category.id}
                label={category.label}
                subLabel={category.subLabel}
                projects={categorizedProjects[category.id] || []}
                onClick={onSelectProject}
            />
        ))}
      </div>
      
      <div className="text-center mt-20 max-w-lg mx-auto text-slate-500 text-sm leading-relaxed">
        <p>Folderをタップするとプロジェクトが展開します。<br/>各カードを選択して詳細をご覧ください。</p>
      </div>
    </div>
  );
};

const TimelineSection: React.FC<TimelineSectionProps> = ({ items, onSelectProject }) => (
  <div id="history" className="max-w-4xl mx-auto px-6 py-24">
    <SectionHeader icon={History} title="Journey" align="center" />

    <div className="relative space-y-8">
      <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

      {items.map((item, index) => {
        const Icon = item.icon;
        const project = item.projectId ? getProjectById(item.projectId) : null;
        return (
          <div key={`${item.title}-${index}`} className="relative pl-28 group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-[#F0F2F5] z-10 bg-white shadow-sm transition-all duration-500 ${
                  item.projectId ? 'group-hover:scale-110 group-hover:rotate-3' : 'opacity-80'
                }`}
              >
                <Icon size={24} className={item.color} />
              </div>
            </div>

            <LiquidCard
              onClick={() => project && onSelectProject(project)}
              className={`${project ? 'hover:scale-[1.01]' : 'cursor-default opacity-90'} transition-all`}
              padding="p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {item.title}
                  {project && (
                    <ArrowUpRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit">{item.year}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </LiquidCard>
          </div>
        );
      })}
    </div>
  </div>
);

const AboutSection: React.FC<AboutSectionProps> = ({ profile, aboutTab, options, onChangeTab, onContact }) => (
  <div id="about" className="max-w-4xl mx-auto px-6 py-24 pb-48">
    <LiquidCard padding="p-12" className="flex flex-col items-center bg-white/80 text-center">
      <div className="flex flex-col items-center mb-10 w-full">
        <div className="w-40 h-40 rounded-[48px] bg-gradient-to-tr from-indigo-100 via-purple-100 to-blue-100 p-2 shadow-2xl mb-6 hover:rotate-3 transition-transform duration-500">
          <div className="w-full h-full rounded-[40px] bg-white flex items-center justify-center overflow-hidden relative">
            <User size={64} className="text-slate-300" />
            <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-3">{profile.name}</h2>
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-sm mb-6">
          {profile.role}
        </div>

        <div className="flex gap-3">
          <LiquidButton
            size="icon"
            variant="glass"
            onClick={() => platformBridge.openExternalLink(profile.socials.twitter)}
            icon={Twitter}
            className="hover:text-[#1DA1F2] bg-white border-slate-200"
          />
          <LiquidButton
            size="icon"
            variant="glass"
            onClick={() => platformBridge.openExternalLink(profile.socials.github)}
            icon={Github}
            className="hover:text-black bg-white border-slate-200"
          />
          <LiquidButton
            size="icon"
            variant="glass"
            onClick={onContact}
            icon={Mail}
            className="hover:text-red-500 bg-white border-slate-200"
          />
        </div>
      </div>

      <div className="w-16 h-1 bg-slate-100 rounded-full mb-10" />

      <div className="w-full max-w-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
          <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
          Hello, World!
        </h3>

        <p className="text-slate-600 leading-relaxed text-lg mb-10">
          {profile.description}
          <br />
          <br />
          ネイティブアプリの<strong className="text-slate-900">「滑らかさ」</strong>と、Webの
          <strong className="text-slate-900">「柔軟性」</strong>を組み合わせ、境界のないデジタル体験を作ることに情熱を注いでいます。
        </p>

        <div className="w-full max-w-sm mx-auto mb-8">
          <LiquidSegmentControl options={options} value={aboutTab} onChange={onChangeTab} />
        </div>

        {/* 修正: min-h-[140px] を削除し、items-start を追加して、中身が縦に引き伸ばされるのを防ぎます */}
        <div className="flex justify-center items-start min-h-[80px]">
          {aboutTab === 'skills' ? (
            <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-500 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {profile.interests.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold shadow-sm border border-transparent hover:scale-105 transition-transform duration-300 cursor-default ${item.color}`}
                >
                  <item.icon size={18} /> {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LiquidCard>
  </div>
);

const ProjectDetailSheet: React.FC<ProjectDetailSheetProps> = ({ project, onClose, onShare }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position and index when project changes
  useEffect(() => {
    setActiveMediaIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [project]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Calculate the active index based on scroll position
    // Note: We use the first child's width to estimate step size
    const firstCard = container.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = UI_METRICS.mediaGalleryGap;
    const scrollLeft = container.scrollLeft;
    
    // Calculate index: round(scrollPosition / (cardWidth + gap))
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveMediaIndex(index);
  }, []);

  if (!project) return null;
  
  const sheetTitle = PROJECT_CATEGORY_LABEL[project.category] ?? 'Project';
  const totalMedia = (project.videoUrl ? 1 : 0) + project.gallery.length;

  return (
  <LiquidSheet
    isOpen={!!project}
    onClose={onClose}
    title={sheetTitle}
    headerRight={<LiquidButton size="sm" variant="ghost" icon={Share} onClick={onShare} />}
  >
    <div className="pb-12">
      {/* 1. MEDIA GALLERY SECTION */}
      <div className="mb-8">
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory hide-scrollbar"
        >
          {project.videoUrl && (
            <div className="shrink-0 w-[85%] md:w-[600px] aspect-video rounded-[32px] overflow-hidden shadow-lg snap-center relative bg-black group">
               {/* Video Placeholder (In a real app, this would be a <video> or <iframe>) */}
               <img src={DEMO_IMAGES.videoPlaceholder} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play fill="white" className="text-white ml-1" size={32} />
                  </div>
               </div>
               <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                 Promo Video
               </div>
            </div>
          )}
          
          {project.gallery.map((img, idx) => (
            <div key={idx} className="shrink-0 w-[85%] md:w-[600px] aspect-video rounded-[32px] overflow-hidden shadow-lg snap-center bg-slate-100 relative">
               <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
               <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                 <ImageIcon size={12} /> Gallery {idx + 1}
               </div>
            </div>
          ))}
        </div>
        
        {/* Dynamic Dots Indicator */}
        <div className="flex justify-center gap-1.5 mt-2">
           {totalMedia > 1 && (
             Array.from({ length: totalMedia }).map((_, i) => (
               <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeMediaIndex ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-300'
                }`} 
               />
             ))
           )}
        </div>
      </div>

      <div className="space-y-10">
        {/* 2. HEADER INFO */}
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{project.title}</h2>
          <p className="text-2xl text-slate-500 font-medium leading-snug">{project.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3.5 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 uppercase tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 3. KEY STATS CARD */}
        <LiquidCard padding="p-8" transparent className="bg-slate-50/80 border-slate-100">
          <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Year</div>
              <div className="text-lg font-black text-slate-900">{project.year}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Role</div>
              <div className="text-lg font-black text-slate-900">{project.role}</div>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed text-lg">{project.longDescription}</p>
        </LiquidCard>

        {/* 4. FEATURES SECTION */}
        <div>
           <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
             <StarIcon className="text-yellow-500 fill-yellow-500" /> Key Features
           </h3>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {project.features.map((feature, i) => (
               <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-700 text-sm font-medium">
                  <div className="mt-0.5 min-w-[16px] h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                  {feature}
               </li>
             ))}
           </ul>
        </div>

        {/* 5. CHALLENGES SECTION */}
        <div>
           <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
             <Cpu className="text-indigo-500" /> Technical Deep Dive
           </h3>
           {/* 背景を明るくし、文字を濃くして視認性を改善 */}
           <LiquidCard className="bg-slate-50 text-slate-700 border-slate-200 !shadow-sm" padding="p-6">
             <p className="leading-relaxed text-base font-medium">
               {project.challenges}
             </p>
           </LiquidCard>
        </div>

        {/* 6. ACTION BUTTONS */}
        <div className="flex flex-col gap-3 pt-4">
          {project.appStoreUrl && (
            <LiquidButton size="lg" className="w-full" onClick={() => platformBridge.openExternalLink(project.appStoreUrl!)} icon={ExternalLink}>
              View on App Store
            </LiquidButton>
          )}
          
          <div className="flex gap-3">
            {project.webUrl && (
              <LiquidButton size="lg" variant="glass" className="flex-1 bg-white border-slate-200" onClick={() => platformBridge.openExternalLink(project.webUrl!)} icon={Globe}>
                Website
              </LiquidButton>
            )}
            {project.githubUrl && (
               <LiquidButton size="lg" variant="glass" className="flex-1 bg-white border-slate-200" onClick={() => platformBridge.openExternalLink(project.githubUrl!)} icon={Github}>
                 Source Code
               </LiquidButton>
            )}
          </div>
        </div>
      </div>
    </div>
  </LiquidSheet>
  );
};

// Simple Star Icon component for the features section
const StarIcon = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aboutTab, setAboutTab] = useState<'skills' | 'interests'>('skills');

  const dockTabs = useMemo(() => DOCK_TABS, []);
  const aboutOptions = useMemo(() => ABOUT_OPTIONS, []);

  // Filter projects by category
  const categorizedProjects = useMemo(() => {
    return PROJECTS.reduce((acc, project) => {
        const cat = project.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(project);
        return acc;
    }, {} as Record<string, Project[]>);
  }, []);

  const scrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);
    platformBridge.scrollToId(id);
  }, []);

  const handleSectionChange = useCallback((id: SectionId) => {
    setActiveSection(id);
  }, []);

  useSectionObserver(handleSectionChange, platformBridge);

  const handleContact = useCallback(() => {
    platformBridge.openMailLink(PROFILE.email);
  }, []);

  const handleShare = useCallback(() => {
    platformBridge.share(PROFILE.catchphrase);
  }, []);

  const handleSelectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  return (
    <LiquidContainer>
      <HeroSection profile={PROFILE} onScrollToWork={() => scrollTo('work')} onContact={handleContact} />
      
      <WorkSection 
        categorizedProjects={categorizedProjects} 
        categories={CATEGORIES}
        onSelectProject={handleSelectProject} 
      />
      
      <TimelineSection
        items={TIMELINE_DATA}
        onSelectProject={(project) => {
          handleSelectProject(project);
        }}
      />
      <AboutSection
        profile={PROFILE}
        aboutTab={aboutTab}
        options={aboutOptions}
        onChangeTab={setAboutTab}
        onContact={handleContact}
      />

      <LiquidDock activeId={activeSection} onChange={scrollTo} tabs={dockTabs} />

      <ProjectDetailSheet
        project={selectedProject}
        onClose={() => handleSelectProject(null)}
        onShare={handleShare}
      />
    </LiquidContainer>
  );
}
