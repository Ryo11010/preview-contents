import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Smartphone,
  Code2,
  User,
  Mail,
  ChevronRight,
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
  description: string;
  techStack: string[];
  color: string;
  accent: string;
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

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

type SectionHeaderProps = {
  icon: IconComponent;
  title: string;
  align?: 'left' | 'center';
};

type HeroSectionProps = {
  profile: Profile;
  onScrollToWork: () => void;
  onContact: () => void;
};

type WorkSectionProps = {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenArchive: () => void;
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
  onOpenAppStore: () => void;
};

type ArchiveSheetProps = {
  projects: Project[];
  isOpen: boolean;
  onSelect: (project: Project) => void;
  onClose: () => void;
};

/* -------------------------------------------------------------------------- */
/* CONSTANTS (content & visual tokens)                                       */
/* -------------------------------------------------------------------------- */

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

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

const APP_STORE_MESSAGE = 'Opening App Store...';

const EXPERIENCE_STAT = {
  value: '6',
  suffix: '+',
  label: 'Years Experience',
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
  colors: {
    primary: 'from-indigo-500 via-purple-500 to-pink-500',
    text: {
      main: 'text-slate-800',
      muted: 'text-slate-500',
      gradient:
        'bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600',
    },
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
    category: 'Personal App',
    year: '2024',
    role: 'Solo Dev',
    tagline: 'Capture life, one second at a time.',
    description:
      '「継続する楽しさ」をテーマにした動画日記アプリ。カレンダーのグリッド表示におけるパフォーマンス最適化（LazyVGrid）と、触り心地の良いカスタムトランジションにこだわりました。',
    techStack: ['SwiftUI', 'AVFoundation', 'Firebase'],
    color: 'from-cyan-400 via-blue-500 to-indigo-500',
    accent: 'text-cyan-600 bg-cyan-50',
  },
  {
    id: 'proj-2',
    title: 'TaskFlow Pro',
    category: 'SaaS Product',
    year: '2023',
    role: 'Lead Eng',
    tagline: 'Productivity, reimagined for iPad.',
    description:
      'iPad対応を含むユニバーサルアプリ。Core DataとCloudKitの同期処理、ドラッグ&ドロップの複雑な操作系をSwiftUIとUIKitのハイブリッドで実現。',
    techStack: ['UIKit', 'CoreData', 'TCA'],
    color: 'from-violet-400 via-purple-500 to-fuchsia-500',
    accent: 'text-purple-600 bg-purple-50',
  },
  {
    id: 'proj-3',
    title: 'EcoScanner',
    category: 'Hackathon',
    year: '2023',
    role: 'ML Engineer',
    tagline: 'AI that sees the future.',
    description:
      'デバイスオンデバイスでプラスチックの種類を判別するARスキャナー。CreateMLでの学習モデル作成からアプリ組み込みまでを担当。',
    techStack: ['CoreML', 'Vision', 'ARKit'],
    color: 'from-emerald-400 via-teal-500 to-cyan-500',
    accent: 'text-teal-600 bg-teal-50',
  },
  {
    id: 'proj-4',
    title: 'Portfolio v2',
    category: 'Web / Design',
    year: '2025',
    role: 'Design & Dev',
    tagline: 'My digital playground.',
    description:
      'iOSエンジニアとしてのアイデンティティをWebで表現。ReactとTailwind CSSを極限まで使い倒し、ネイティブアプリのような没入感を実現。',
    techStack: ['Next.js', 'React', 'Tailwind'],
    color: 'from-amber-400 via-orange-500 to-red-500',
    accent: 'text-orange-600 bg-orange-50',
  },
];

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
  { id: 'work', icon: Smartphone },
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
  segment: 'bg-white text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
} as const;

const BUTTON_SIZES = {
  sm: 'py-2 px-3 text-xs',
  md: 'py-3.5 px-6 text-sm',
  lg: 'py-4 px-8 text-base',
  icon: 'p-3 rounded-2xl',
} as const;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const openExternalLink = (url: string) => {
  if (!url || typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const openMailLink = (email: string) => {
  if (!email || typeof window === 'undefined') return;
  window.location.href = `mailto:${email}`;
};

const safeAlert = (message: string) => {
  if (typeof window === 'undefined') return;
  window.alert(message);
};

const getProjectById = (id: string | null): Project | null =>
  PROJECTS.find((project) => project.id === id) || null;

const shareContent = (text: string) => {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      nav.share({ title: SHARE_COPY.successTitle, text }).catch(() => safeAlert(SHARE_COPY.fallback));
      return;
    }
  }
  safeAlert(SHARE_COPY.fallback);
};

const useSectionObserver = (onSectionChange: (id: SectionId) => void) => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || !('IntersectionObserver' in window)) {
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
      { threshold: 0.3 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [onSectionChange]);
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

  return (
    <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto relative flex items-center gap-4 p-3 rounded-[32px] bg-white/60 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(255,255,255,0.4)]">
        {hasActive && (
          <div
            className="absolute top-3 bottom-3 w-[60px] rounded-[24px] bg-gradient-to-b from-white to-slate-50 shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-500 ease-[cubic-bezier(0.25,1.5,0.5,1)] z-0"
            style={{
              left: '12px',
              transform: `translateX(${activeIndex * (60 + 16)}px) scale(${isPressing ? 0.9 : 1.0})`,
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
              className={`relative z-10 w-[60px] h-[52px] flex items-center justify-center rounded-[24px] transition-colors duration-300 ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`transition-all duration-300 ${
                  isActive ? (isPressing ? 'scale-90' : 'scale-110 drop-shadow-sm -translate-y-1') : 'scale-100'
                }`}
              >
                <Icon size={24} />
              </div>
              {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, align = 'left' }) => (
  <div
    className={`flex items-center gap-4 mb-12 pl-2 ${
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
        className="inline-flex items-center gap-3 !rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <span className="text-xs font-bold text-slate-600 tracking-wider">{HERO_COPY.status}</span>
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
      <LiquidButton size="lg" onClick={onScrollToWork} icon={ArrowUpRight} className="shadow-xl shadow-indigo-500/20">
        Explore Work
      </LiquidButton>
      <LiquidButton size="lg" variant="glass" onClick={onContact} icon={Mail}>
        Contact Me
      </LiquidButton>
    </div>
  </div>
);

const ProjectHighlightCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => (
  <LiquidCard
    onClick={onClick}
    className="md:col-span-4 min-h-[460px] group flex flex-col relative !overflow-visible"
    glassEffect={false}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-700 rounded-[36px]`}
    />

    <div className="relative z-10 flex flex-col h-full p-2">
      <div className="flex justify-between items-start mb-6">
        <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold uppercase text-slate-700 shadow-sm border border-white/50">
          Featured
        </span>
        <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
          <ArrowUpRight className="text-slate-400 group-hover:text-slate-900" />
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-500">
          {project.title}
        </h3>
        <p className="text-xl text-slate-600 font-medium max-w-md leading-relaxed">{project.tagline}</p>
      </div>

      <div className="mt-auto self-end w-[85%] h-56 bg-gradient-to-t from-white/90 to-white/40 border-t border-l border-white/60 rounded-tl-[40px] shadow-2xl flex items-center justify-center translate-y-8 translate-x-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700 backdrop-blur-md">
        <div className="text-center opacity-50">
          <Smartphone size={64} className="mx-auto mb-2 text-indigo-900" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-900">App Preview</span>
        </div>
      </div>
    </div>
  </LiquidCard>
);

const ProjectSummaryCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => (
  <LiquidCard
    onClick={onClick}
    className="md:col-span-3 min-h-[240px] group flex items-center justify-between relative !overflow-visible"
    glassEffect={false}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 rounded-[36px]`}
    />
    <div className="relative z-10 max-w-[60%] p-2">
      <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase mb-3 tracking-wide ${project.accent}`}>
        {project.category}
      </span>
      <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{project.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 font-medium">{project.tagline}</p>
    </div>
    <div className="relative z-10 w-20 h-20 rounded-[24px] bg-white shadow-lg border border-white/50 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
      {project.id === 'proj-2' ? <Layers size={32} className="text-purple-500" /> : <Cpu size={32} className="text-teal-500" />}
    </div>
  </LiquidCard>
);

const WorkArchiveCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <LiquidCard
    onClick={onClick}
    className="md:col-span-6 group relative overflow-hidden !bg-white/70 hover:!bg-white/90 border border-white/60 transition-all duration-300"
    padding="p-6"
  >
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <List size={26} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">View All Projects Archive</h3>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Explore experimental prototypes & concepts</p>
        </div>
      </div>

      <div className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
        <ChevronRight size={20} />
      </div>
    </div>
  </LiquidCard>
);

const ExperienceCard: React.FC = () => (
  <LiquidCard className="md:col-span-2 flex flex-col justify-center items-center text-center bg-white/60 backdrop-blur-xl border border-white/60">
    <div className="w-20 h-20 rounded-[30px] bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 rotate-3 shadow-inner">
      <Activity size={36} />
    </div>
    <div className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
      {EXPERIENCE_STAT.value}
      <span className="text-indigo-500 text-4xl">{EXPERIENCE_STAT.suffix}</span>
    </div>
    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{EXPERIENCE_STAT.label}</div>
  </LiquidCard>
);

const WorkSection: React.FC<WorkSectionProps> = ({ projects, onSelectProject, onOpenArchive }) => {
  if (projects.length === 0) return null;

  const [featured, ...rest] = projects;
  const secondaryProjects = rest.slice(0, 2);

  return (
    <div id="work" className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader icon={Layers} title="Selected Works" />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <ProjectHighlightCard project={featured} onClick={() => onSelectProject(featured)} />
        <ExperienceCard />

        {secondaryProjects.map((project) => (
          <ProjectSummaryCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
        ))}

        <WorkArchiveCard onClick={onOpenArchive} />
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
            onClick={() => openExternalLink(profile.socials.twitter)}
            icon={Twitter}
            className="hover:text-[#1DA1F2] bg-white border-slate-200"
          />
          <LiquidButton
            size="icon"
            variant="glass"
            onClick={() => openExternalLink(profile.socials.github)}
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

        <div className="min-h-[140px] flex justify-center">
          {aboutTab === 'skills' ? (
            <div className="flex flex-wrap justify-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default"
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

const ProjectDetailSheet: React.FC<ProjectDetailSheetProps> = ({ project, onClose, onShare, onOpenAppStore }) => (
  <LiquidSheet
    isOpen={!!project}
    onClose={onClose}
    title={project?.category || 'Project'}
    headerRight={<LiquidButton size="sm" variant="ghost" icon={Share} onClick={onShare} />}
  >
    {project && (
      <div className="pb-10">
        <div
          className={`h-72 w-full bg-gradient-to-br ${project.color} rounded-[32px] mb-8 flex items-center justify-center shadow-lg relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }} />
          <div className="w-full h-full flex items-center justify-center scale-90 opacity-90">
            <Smartphone size={100} className="text-white drop-shadow-2xl" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">{project.title}</h2>
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
            <p className="text-slate-700 leading-relaxed text-lg">{project.description}</p>
          </LiquidCard>

          <div className="pt-4">
            <LiquidButton size="lg" className="w-full" onClick={onOpenAppStore} icon={ExternalLink}>
              View on App Store
            </LiquidButton>
          </div>
        </div>
      </div>
    )}
  </LiquidSheet>
);

const ArchiveSheet: React.FC<ArchiveSheetProps> = ({ projects, isOpen, onSelect, onClose }) => (
  <LiquidSheet isOpen={isOpen} onClose={onClose} title="All Projects Archive">
    <div className="space-y-4 pt-2">
      {projects.map((project) => (
        <LiquidCard
          key={project.id}
          onClick={() => {
            onSelect(project);
          }}
          className="flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group"
          padding="p-5"
          transparent
        >
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <Smartphone size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-slate-900 truncate mb-0.5">{project.title}</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{project.year}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
            <ChevronRight size={20} />
          </div>
        </LiquidCard>
      ))}
      <LiquidCard className="flex items-center gap-5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed" padding="p-5" transparent>
        <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
          <Code2 size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-slate-500 truncate mb-0.5">Old Prototype 2020</h4>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
            <span>Archived</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>2020</span>
          </div>
        </div>
      </LiquidCard>
    </div>
  </LiquidSheet>
);

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [aboutTab, setAboutTab] = useState<'skills' | 'interests'>('skills');

  const dockTabs = useMemo(() => DOCK_TABS, []);
  const aboutOptions = useMemo(() => ABOUT_OPTIONS, []);

  const scrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSectionChange = useCallback((id: SectionId) => {
    setActiveSection(id);
  }, []);

  useSectionObserver(handleSectionChange);

  const handleContact = useCallback(() => {
    openMailLink(PROFILE.email);
  }, []);

  const handleShare = useCallback(() => {
    shareContent(PROFILE.catchphrase);
  }, []);

  const handleOpenAppStore = useCallback(() => {
    safeAlert(APP_STORE_MESSAGE);
  }, []);

  const handleSelectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  const handleOpenArchive = useCallback(() => setShowArchive(true), []);
  const handleCloseArchive = useCallback(() => setShowArchive(false), []);

  const handleArchiveSelect = useCallback(
    (project: Project) => {
      setSelectedProject(project);
      setShowArchive(false);
    },
    []
  );

  return (
    <LiquidContainer>
      <HeroSection profile={PROFILE} onScrollToWork={() => scrollTo('work')} onContact={handleContact} />
      <WorkSection projects={PROJECTS} onSelectProject={(project) => handleSelectProject(project)} onOpenArchive={handleOpenArchive} />
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
        onOpenAppStore={handleOpenAppStore}
      />

      <ArchiveSheet
        projects={PROJECTS}
        isOpen={showArchive}
        onSelect={handleArchiveSelect}
        onClose={handleCloseArchive}
      />
    </LiquidContainer>
  );
}
