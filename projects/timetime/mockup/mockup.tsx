import React, { useState, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, ComponentType } from 'react';
import {
  Menu,
  Clock,
  List,
  LayoutDashboard,
  Settings,
  X,
  Building2,
  Users,
  MapPin,
  FileText,
  Layers,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Plus,
  MinusCircle,
  Edit2,
  LogIn,
  Map,
  Search,
  Maximize,
  Save,
  Smartphone,
  CreditCard,
  User as UserIcon,
  Check,
  Globe,
  Calendar,
  BarChart2,
  ArrowRight,
  Download,
  Coffee,
  PlayCircle,
  Briefcase
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

type ViewMode = '日' | '週' | '月' | 'カスタム';
type TabKey =
  | 'punch'
  | 'history'
  | 'settings'
  | 'settings_profile'
  | 'admin'
  | 'admin_org_settings'
  | 'admin_group_settings'
  | 'admin_subgroup_settings'
  | 'admin_group_edit'
  | 'admin_subgroup_edit'
  | 'reports';

type PunchTypeId = 'in' | 'break_start' | 'break_end' | 'out';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  currentGroup: string;
  currentSubgroup: string;
};

type Group = { id: number; name: string; code: string };
type Subgroup = { id: number; name: string; radius: number };
type HistoryEvent = { id: number; type: string; time: string; valid: boolean; punchType: PunchTypeId };
type WeeklyStat = { day: string; hours: number; date: string };
type MonthlyStat = { date: string; day: string; hours: number; status: string };
type PunchSettingItem = {
  id: number;
  title: string;
  type: 'system' | 'break' | 'custom';
  required: boolean;
  enabled: boolean;
  labelIn: string;
  labelOut: string;
};
type PunchStatus = 'none' | 'working' | 'break' | 'finished';

type Style = CSSProperties;
type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: Style }>;

// ==========================================
// CONFIG & CONSTANTS
// ==========================================

const APP_CONFIG = {
  appName: 'timetime',
  companyName: '株式会社 timetime建設',
  version: 'v1.0.0',
};

const ROLE_LABELS = {
  admin: '組織管理者',
};

const VIEW_MODE_OPTIONS: ViewMode[] = ['日', '週', '月'];
const REPORT_VIEW_MODES: ViewMode[] = ['日', '週', '月', 'カスタム'];
const ADMIN_TABS: { id: TabKey, label: string }[] = [{ id: 'punch', label: '打刻' }, { id: 'history', label: '履歴' }, { id: 'admin', label: '管理' }];
const GENERAL_TABS: { id: TabKey, label: string }[] = [{ id: 'punch', label: '打刻' }, { id: 'history', label: '履歴' }];

const TAB_ICON_MAP: Record<TabKey, IconComponent> = {
  punch: Clock,
  history: List,
  admin: LayoutDashboard,
  settings: Settings,
  settings_profile: Settings,
  admin_org_settings: Globe,
  admin_group_settings: Layers,
  admin_subgroup_settings: Map,
  admin_group_edit: Edit2,
  admin_subgroup_edit: Edit2,
  reports: FileText,
};

const APP_COPY = {
  version: `${APP_CONFIG.appName} ${APP_CONFIG.version}`,
};

const PUNCH_TYPE_META: Record<PunchTypeId, { id: PunchTypeId; label: string; color: string; icon: IconComponent }> = {
  in: { id: 'in', label: '出勤', color: '#007AFF', icon: LogIn },
  break_start: { id: 'break_start', label: '休憩', color: '#FF9500', icon: Coffee },
  break_end: { id: 'break_end', label: '再開', color: '#007AFF', icon: PlayCircle },
  out: { id: 'out', label: '退勤', color: '#34C759', icon: LogOut },
};

const PUNCH_TYPE_ORDER: PunchTypeId[] = ['in', 'break_start', 'break_end', 'out'];

const getPunchColor = (type: PunchTypeId | null) => {
  if (!type) return '#ddd';
  return PUNCH_TYPE_META[type]?.color ?? '#ddd';
};

const getPunchLabel = (type: PunchTypeId | null) => {
  if (!type) return '選択';
  return PUNCH_TYPE_META[type]?.label ?? '選択';
};

const PUNCH_STATUS_TRANSITIONS: Record<PunchTypeId, PunchStatus> = {
  in: 'working',
  break_start: 'break',
  break_end: 'working',
  out: 'finished',
};

const DEFAULT_SELECTION_BY_STATUS: Record<PunchStatus, PunchTypeId> = {
  none: 'in',
  working: 'out',
  break: 'break_end',
  finished: 'in',
};

const PUNCH_PROCESSING_DELAY_MS = 800;
const NOW_TICK_INTERVAL_MS = 1000;

// ==========================================
// DESIGN TOKENS (RN Compatible)
// ==========================================

const ANIMATION = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
};

const COLORS = {
  primary: '#007AFF', // iOS Blue
  success: '#34C759', // iOS Green
  danger: '#FF3B30',  // iOS Red
  warning: '#FF9500', // iOS Orange
  indigo: '#5856D6',  // iOS Indigo
  textMain: '#1C1C1E',
  textSub: '#8E8E93',
  bgGradientStart: '#E0EAFC',
  bgGradientEnd: '#CFDEF3',
  glassWhite: 'rgba(255, 255, 255, 0.85)', 
  glassWhiteStrong: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  glassBorderLight: 'rgba(255, 255, 255, 0.3)',
  separator: 'rgba(60, 60, 67, 0.1)',
  inputBg: 'rgba(0, 0, 0, 0.04)', // 薄いグレー背景
};

const RADII = {
  none: 0,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

const SHADOWS = {
  card: '0 8px 32px rgba(0,0,0,0.08)',
  dock: '0 20px 50px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.5) inset',
  float: '0 8px 16px rgba(0,0,0,0.08)',
  text: '0 1px 2px rgba(0,0,0,0.1)',
};

const FONTS = {
  main: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const LAYOUT = {
  headerHeight: 60,
  contentPaddingTop: 80,
  contentPaddingBottom: 140,
  dockHeight: 72,
  dockPaddingX: 20,
  dockGap: 24,
  dockBottom: 32,
};

// Global CSS (RNではGlobalStylesで再現する要素)
const globalCss = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  
  html, body, #root { 
    margin: 0; padding: 0; 
    font-family: ${FONTS.main}; 
    background: #F2F2F7;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  @keyframes ping {
    75%, 100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes pulse {
    50% { opacity: .5; }
  }

  /* RNのScrollView的な挙動のためのクラス */
  .scroll-content {
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  
  /* スクロールバー非表示 */
  ::-webkit-scrollbar { width: 0px; background: transparent; }
`;

// ==========================================
// UTILS
// ==========================================

const getWeekRange = (date: Date) => {
  const dayOfWeek = date.getDay();
  const diffToMon = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
};

const formatDate = (date: Date, mode: ViewMode) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  
  if (mode === '日') return `${y}年${m}月${d}日(${day})`;
  if (mode === '月') return `${y}年${m}月`;
  if (mode === '週') {
    const { monday, sunday } = getWeekRange(date);
    return `${monday.getMonth()+1}/${monday.getDate()} - ${sunday.getMonth()+1}/${sunday.getDate()}`;
  }
  if (mode === 'カスタム') return 'カスタム期間';
  return '';
};

const shiftDateByViewMode = (baseDate: Date, mode: ViewMode, direction: number) => {
  const next = new Date(baseDate);
  if (mode === '日') next.setDate(next.getDate() + direction);
  else if (mode === '週') next.setDate(next.getDate() + (direction * 7));
  else if (mode === '月') next.setMonth(next.getMonth() + direction);
  return next;
};

const getWeekDate = (baseDate: Date, offset: number) => {
  const { monday } = getWeekRange(baseDate);
  const target = new Date(monday);
  target.setDate(monday.getDate() + offset);
  return target;
};

const getShortDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()} (${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;
};

const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), NOW_TICK_INTERVAL_MS);
    return () => clearInterval(timerId);
  }, []);
  return now;
};

const getDefaultSubgroupName = (groupName: string, fallback: string) => {
  const subgroups = MOCK_SUBGROUPS[groupName] ?? [];
  return subgroups[0]?.name ?? fallback;
};

const formatDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_USER_DATA: User = {
  id: '8829-1123-9991',
  name: '田中 太郎',
  email: 'taro.tanaka@timetime.co.jp',
  role: ROLE_LABELS.admin,
  avatar: null,
  currentGroup: '関東エリア',
  currentSubgroup: '新宿駅前現場',
};

const MOCK_GROUPS: Group[] = [
  { id: 1, name: '関東エリア', code: 'GRP-101' },
  { id: 2, name: '関西エリア', code: 'GRP-102' },
  { id: 3, name: '九州エリア', code: 'GRP-103' },
];

const MOCK_SUBGROUPS: Record<string, Subgroup[]> = {
  '関東エリア': [
    { id: 101, name: '新宿駅前現場', radius: 150 },
    { id: 102, name: '渋谷開発PJ', radius: 200 },
  ],
  '関西エリア': [
    { id: 201, name: '梅田タワー', radius: 100 },
  ],
  '九州エリア': [
      { id: 301, name: '博多駅前', radius: 120 },
  ]
};

const INITIAL_PUNCH_ITEMS: PunchSettingItem[] = [
  { id: 1, title: '出勤・退勤', type: 'system', required: true, enabled: true, labelIn: '出勤', labelOut: '退勤' },
  { id: 2, title: '休憩', type: 'break', required: false, enabled: true, labelIn: '休憩', labelOut: '再開' },
];

const getHistoryEvents = (baseDate: Date): HistoryEvent[] => {
  const seed = baseDate.getDate() + baseDate.getMonth(); 
  return [
    { id: 1, type: '出勤', punchType: 'in', time: `08:${30 + (seed % 30)}`, valid: true },
    { id: 2, type: '休憩開始', punchType: 'break_start', time: '12:00', valid: true },
    { id: 3, type: '休憩終了', punchType: 'break_end', time: '13:00', valid: true },
    { id: 4, type: '退勤', punchType: 'out', time: `18:${10 + (seed % 40)}`, valid: true },
  ];
};

const getWeeklyStats = (baseDate: Date): WeeklyStat[] => {
  const { monday } = getWeekRange(baseDate);
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: ['月', '火', '水', '木', '金', '土', '日'][i],
      hours: i < 5 ? 8 + ((d.getDate() % 5) / 10) : 0,
      date: `${d.getMonth()+1}/${d.getDate()}`
    };
  });
};

const getMonthlyStats = (baseDate: Date): MonthlyStat[] => {
  const y = baseDate.getFullYear();
  const m = baseDate.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(y, m, i + 1);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return {
      date: `${m + 1}/${i + 1}`,
      day: ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek],
      hours: isWeekend ? 0 : 8.0 + ((i % 3) * 0.25),
      status: isWeekend ? '休日' : '出勤'
    };
  });
};

// ==========================================
// SHARED COMPONENTS
// ==========================================

const LiquidContainer = ({ children }: { children: ReactNode }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100dvh', 
    background: '#F2F2F7',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
  }}>
    <style>{globalCss}</style>
    {/* 背景: RNのImageBackground相当 */}
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${COLORS.bgGradientStart} 0%, ${COLORS.bgGradientEnd} 100%)`, zIndex: 0 }} />
    
    {/* 装飾: RNではImage等で実装 */}
    <div style={{
      position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vh',
      background: `radial-gradient(circle, rgba(66,165,245,0.4) 0%, rgba(66,165,245,0) 70%)`,
      filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', bottom: '-10%', right: '-10%', width: '60vw', height: '60vh',
      background: `radial-gradient(circle, rgba(170,100,240,0.3) 0%, rgba(170,100,240,0) 70%)`,
      filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
    }} />
    
    <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

// RNのView + Style相当
const LiquidCard = ({ children, padding = '16px', style, onClick }: any) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: COLORS.glassWhite,
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', // RNではBlurViewを使用
      border: `1px solid ${COLORS.glassBorder}`,
      borderRadius: RADII.xl,
      padding,
      boxShadow: SHADOWS.card,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.1s ease',
      display: 'flex', flexDirection: 'column', // Flexboxデフォルト
      ...style
    }}
    onMouseDown={e => onClick && (e.currentTarget.style.transform = 'scale(0.98)')}
    onMouseUp={e => onClick && (e.currentTarget.style.transform = 'scale(1)')}
    onMouseLeave={e => onClick && (e.currentTarget.style.transform = 'scale(1)')}
  >
    {children}
  </div>
);

// RNのTouchableOpacity相当
const LiquidButton = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, style }: any) => {
  let variantStyle: Style = {};
  if (variant === 'primary') variantStyle = { background: COLORS.primary, color: 'white', boxShadow: '0 4px 12px rgba(0,122,255,0.3)' };
  else if (variant === 'danger') variantStyle = { background: COLORS.glassWhite, color: COLORS.danger };
  else if (variant === 'ghost') variantStyle = { background: 'transparent', color: COLORS.textSub };
  else if (variant === 'glass') variantStyle = { background: COLORS.glassWhite, color: COLORS.textMain, border: `1px solid ${COLORS.glassBorder}`, boxShadow: SHADOWS.float };

  let sizeStyle = { height: 44, fontSize: 15, padding: '0 16px' };
  if (size === 'sm') sizeStyle = { height: 32, fontSize: 13, padding: '0 12px' };
  if (size === 'icon') sizeStyle = { width: 40, height: 40, padding: 0, justifyContent: 'center' };

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', outline: 'none', borderRadius: RADII.lg,
        fontWeight: 600, cursor: 'pointer',
        transition: 'opacity 0.2s',
        ...variantStyle, ...sizeStyle, ...style
      }}
      onMouseDown={e => (e.currentTarget.style.opacity = '0.7')}
      onMouseUp={e => (e.currentTarget.style.opacity = '1')}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} style={{ marginRight: children ? 8 : 0 }} />}
      {children}
    </button>
  );
};

const LiquidSegmentControl = ({ options, selected, onSelect }: any) => {
  const getOptionValue = (option: any) => (typeof option === 'string' ? option : option.value);
  const getOptionLabel = (option: any) => (typeof option === 'string' ? option : option.label);
  
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(118, 118, 128, 0.12)',
      borderRadius: '8px', padding: '2px',
      height: '32px'
    }}>
      {options.map((option: any) => {
        const value = getOptionValue(option);
        const label = getOptionLabel(option);
        const isSelected = value === selected;
        return (
          <div 
            key={value} 
            onClick={() => onSelect(value)} 
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px',
              background: isSelected ? 'white' : 'transparent',
              boxShadow: isSelected ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none',
              fontSize: '13px', fontWeight: isSelected ? '600' : '400',
              color: isSelected ? 'black' : 'black',
              cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none'
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

const LiquidDock = ({ activeTab, onTabChange, role }: any) => {
  const tabs = role === ROLE_LABELS.admin ? ADMIN_TABS : GENERAL_TABS;

  return (
    <div style={{
      position: 'fixed', bottom: `${LAYOUT.dockBottom}px`, left: '50%', transform: 'translateX(-50%)',
      width: 'auto', minWidth: '200px', maxWidth: '90%', height: `${LAYOUT.dockHeight}px`,
      padding: `0 ${LAYOUT.dockPaddingX}px`,
      background: COLORS.glassWhite,
      backdropFilter: 'blur(42px)', WebkitBackdropFilter: 'blur(42px)',
      borderRadius: '48px', boxShadow: SHADOWS.dock,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: `${LAYOUT.dockGap}px`, zIndex: 50, border: `1px solid ${COLORS.glassBorderLight}`
    }}>
      {tabs.map((tab) => {
        const Icon = TAB_ICON_MAP[tab.id]; 
        const isActive = tab.id === activeTab || (tab.id === 'admin' && (activeTab === 'reports' || activeTab.startsWith('admin_')));
        
        return (
          <div 
            key={tab.id}
            onClick={() => onTabChange(tab.id === 'admin' ? 'reports' : tab.id)}
            style={{
              width: '64px', height: '56px', borderRadius: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 2, position: 'relative', 
              background: isActive ? 'rgba(255,255,255,0.6)' : 'transparent',
              boxShadow: isActive ? SHADOWS.float : 'none',
              transition: 'all 0.3s'
            }}
          >
            {Icon && (
              <Icon 
                  size={24} 
                  color={isActive ? COLORS.primary : COLORS.textSub} 
                  strokeWidth={isActive ? 2.5 : 2} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// FEATURE COMPONENTS
// ==========================================

/**
 * DatePicker Button Component
 * RNでは TouchableOpacity + DatePicker Modal
 * Webでは透明なinput type="date"を重ねて実装
 */
const DateInputButton = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => (
  <div style={{ 
    position: 'relative', flex: 1, 
    height: '48px', // RNの標準的なタッチターゲットサイズ
    background: COLORS.inputBg,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    transition: 'background 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
  onMouseLeave={e => e.currentTarget.style.background = COLORS.inputBg}
  >
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: '100%'
    }}>
      <span style={{ fontSize: '15px', color: COLORS.textMain, fontWeight: '500' }}>{value.replace(/-/g, '/')}</span>
      <Calendar size={18} color={COLORS.textSub} />
    </div>
    
    {/* Web用: 透明なinputを重ねてクリッカブルにする */}
    <input 
      type="date" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        position: 'absolute', inset: 0, opacity: 0, 
        width: '100%', height: '100%', cursor: 'pointer',
        zIndex: 1
      }}
    />
  </div>
);

// リストアイテム (RNのListItem相当)
const ListItem = ({ label, value, icon: Icon, onClick, showArrow = true }: any) => (
  <div onClick={onClick} style={{ 
    display: 'flex', alignItems: 'center', padding: '16px 0', 
    borderBottom: `1px solid ${COLORS.separator}`, cursor: onClick ? 'pointer' : 'default' 
  }}>
    {Icon && (
      <div style={{ 
        width: '32px', height: '32px', borderRadius: '8px', 
        background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginRight: '16px' 
      }}>
        <Icon size={18} color={COLORS.textSub} />
      </div>
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '11px', color: COLORS.textSub, marginBottom: '2px', fontWeight: '500' }}>{label}</div>
      <div style={{ fontSize: '16px', color: COLORS.textMain, fontWeight: '500' }}>{value}</div>
    </div>
    {showArrow && <ChevronRight size={18} color={COLORS.textSub} style={{ opacity: 0.5 }} />}
  </div>
);

const ReportScreen = ({ onBack, user }: any) => {
  const [targetGroup, setTargetGroup] = useState(user.currentGroup);
  const [targetSubgroup, setTargetSubgroup] = useState(user.currentSubgroup);
  const [reportMode, setReportMode] = useState<ViewMode>('カスタム');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleExport = (format: 'CSV' | 'PDF') => {
    alert(`${format}エクスポートを実行します`);
  };

  return (
    <PageWrapper>
      <SettingsHeader title="レポート出力" onBack={onBack} />
      
      <h3 style={{ fontSize: '13px', fontWeight: '600', color: COLORS.textSub, marginBottom: '8px', marginLeft: '4px', textTransform: 'uppercase' }}>対象者と期間の指定</h3>

      <LiquidCard padding="0 24px" style={{ marginBottom: '24px' }}>
        <ListItem 
          label="対象組織 / グループ" 
          value={targetGroup} 
          icon={Building2}
          onClick={() => {}} // RNではPicker表示
        />
        <ListItem 
          label="対象現場" 
          value={targetSubgroup} 
          icon={MapPin}
          onClick={() => {}} 
        />
        
        <div style={{ padding: '20px 0 24px' }}>
          <div style={{ fontSize: '12px', color: COLORS.textSub, marginBottom: '10px', fontWeight: '600' }}>期間指定</div>
          <LiquidSegmentControl 
            options={REPORT_VIEW_MODES}
            selected={reportMode}
            onSelect={setReportMode}
          />
          
          {reportMode === 'カスタム' && (
            <div style={{ 
              marginTop: '16px',
              display: 'flex', alignItems: 'center', gap: '12px' 
            }}>
               <DateInputButton 
                 value={formatDateInputValue(startDate)} 
                 onChange={(v) => setStartDate(new Date(v))} 
               />
               <span style={{ color: COLORS.textSub, fontWeight: 'bold' }}>〜</span>
               <DateInputButton 
                 value={formatDateInputValue(endDate)} 
                 onChange={(v) => setEndDate(new Date(v))} 
               />
            </div>
          )}
        </div>
      </LiquidCard>

      <h3 style={{ fontSize: '13px', fontWeight: '600', color: COLORS.textSub, marginBottom: '8px', marginLeft: '4px', textTransform: 'uppercase' }}>出力フォーマット</h3>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <LiquidButton 
          variant="primary" 
          icon={Download}
          onClick={() => handleExport('CSV')}
          style={{ flex: 1, height: '52px' }}
        >
          CSVエクスポート
        </LiquidButton>
        
        <LiquidButton 
          variant="glass" 
          icon={FileText}
          onClick={() => handleExport('PDF')}
          style={{ flex: 1, height: '52px' }}
        >
          PDFエクスポート
        </LiquidButton>
      </div>

    </PageWrapper>
  );
};

// ==========================================
// OTHER SCREENS
// ==========================================

const SettingsHeader = ({ title, onBack, action }: any) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
    marginBottom: '24px', paddingTop: '10px' 
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {onBack && (
        <div onClick={onBack} style={{ 
          marginRight: '8px', cursor: 'pointer', 
          width: 40, height: 40, borderRadius: 20, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.5)'
        }}>
          <ChevronLeft size={24} color={COLORS.textMain} />
        </div>
      )}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.3px', color: COLORS.textMain }}>{title}</h2>
    </div>
    {action}
  </div>
);

const PunchScreen = ({ user }: any) => {
    const [status, setStatus] = useState<PunchStatus>('working'); 
    const now = useNow();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selection, setSelection] = useState<PunchTypeId | null>(DEFAULT_SELECTION_BY_STATUS.working); 
  
    useEffect(() => { setSelection(DEFAULT_SELECTION_BY_STATUS[status]); }, [status]);
  
    const handlePunch = () => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const nextStatus = PUNCH_STATUS_TRANSITIONS[selection!] ?? status;
        setStatus(nextStatus);
        setSelection(DEFAULT_SELECTION_BY_STATUS[nextStatus]);
      }, PUNCH_PROCESSING_DELAY_MS);
    };
  
    const punchButtonColor = getPunchColor(selection);
  
    return (
      <div style={{ 
        width: '100%', maxWidth: '640px', margin: '0 auto', 
        minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
        padding: '0 24px' 
      }}>
        {/* Status Chip */}
        <div style={{ 
          display: 'flex', alignItems: 'center', backgroundColor: COLORS.glassWhite, 
          padding: '8px 16px', borderRadius: '20px', marginBottom: '4vh', marginTop: '1vh',
          boxShadow: SHADOWS.float, backdropFilter: 'blur(10px)'
        }}>
           <div style={{ 
             width: '8px', height: '8px', borderRadius: '50%', 
             background: status === 'working' ? COLORS.success : COLORS.warning, 
             marginRight: '8px', boxShadow: `0 0 8px ${status === 'working' ? COLORS.success : COLORS.warning}`
           }} />
           <span style={{ fontSize: '13px', fontWeight: '600' }}>{user.currentSubgroup}</span>
        </div>

        {/* Clock */}
        <div style={{ textAlign: 'center', marginBottom: '6vh' }}>
          <div style={{ 
            fontSize: '80px', fontWeight: '200', lineHeight: 1, 
            letterSpacing: '-2px', color: COLORS.textMain, textShadow: '0 4px 16px rgba(0,0,0,0.05)'
          }}>
            {now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '16px', color: COLORS.textSub, marginTop: '8px', fontWeight: '500' }}>
            {now.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
          </div>
        </div>

        {/* 4x4 Layout (Flexbox Implementation for RN) */}
        <div style={{ 
          display: 'flex', flexWrap: 'wrap', gap: '16px', 
          width: '100%', maxWidth: '340px', marginBottom: '40px', justifyContent: 'center' 
        }}>
            {PUNCH_TYPE_ORDER.map((typeId) => {
                const typeMeta = PUNCH_TYPE_META[typeId];
                const isSelected = selection === typeId;
                const TypeIcon = typeMeta.icon;
                return (
                    <div key={typeId} onClick={() => setSelection(typeId)} style={{
                        // calc for 2 columns with gap
                        width: 'calc(50% - 8px)', height: '100px', borderRadius: '20px',
                        background: isSelected ? COLORS.glassWhiteStrong : 'rgba(255,255,255,0.25)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: isSelected ? SHADOWS.card : 'none',
                        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.3)',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                    }}>
                        <div style={{ 
                          color: isSelected ? typeMeta.color : COLORS.textSub, marginBottom: '8px',
                          background: isSelected ? `${typeMeta.color}15` : 'transparent',
                          padding: '8px', borderRadius: '12px'
                        }}>
                          <TypeIcon size={24} />
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? COLORS.textMain : COLORS.textSub }}>{typeMeta.label}</div>
                    </div>
                )
            })}
        </div>

        {/* Main Punch Button */}
        <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto' }}>
            <button onClick={handlePunch} style={{
                width: '100%', height: '100%', borderRadius: '50%', border: 'none', outline: 'none',
                background: punchButtonColor,
                boxShadow: `0 20px 50px ${punchButtonColor}55, inset 0 2px 0 rgba(255,255,255,0.4)`,
                color: 'white', cursor: 'pointer', transition: 'transform 0.1s',
                transform: isProcessing ? 'scale(0.95)' : 'scale(1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                 <span style={{ fontSize: '13px', opacity: 0.9, letterSpacing: '2px', marginBottom: '4px', fontWeight: '600' }}>TAP TO</span>
                 <span style={{ fontSize: '32px', fontWeight: '700' }}>{isProcessing ? '...' : getPunchLabel(selection)}</span>
            </button>
        </div>
      </div>
    );
};

const ScrollContent = ({ children }: any) => (
    <div className="scroll-content" style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        paddingTop: `${LAYOUT.contentPaddingTop}px`, paddingBottom: `${LAYOUT.contentPaddingBottom}px`
    }}>
        {children}
    </div>
);

const PageWrapper = ({ children }: any) => (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        {children}
    </div>
);

// SideMenu (Simulating RN Modal)
const SideMenu = ({ isOpen, onClose, user, onNavigate }: any) => {
    return (
        <>
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
                opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.2s'
            }} />
            <div style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '300px',
                background: COLORS.glassWhiteStrong, zIndex: 101,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: SHADOWS.sideMenu,
                borderRight: `1px solid ${COLORS.glassBorderLight}`
            }}>
                <div style={{ padding: '60px 24px 32px', background: 'rgba(255,255,255,0.5)', borderBottom: `1px solid ${COLORS.separator}` }}>
                    <div style={{ 
                      width: '64px', height: '64px', borderRadius: '32px', 
                      background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: '24px', fontWeight: 'bold', color: COLORS.primary, marginBottom: '16px',
                      boxShadow: SHADOWS.float
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textMain }}>{user.name}</div>
                    <div style={{ fontSize: '14px', color: COLORS.textSub, marginTop: '4px' }}>{user.role}</div>
                </div>
                <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                    <LiquidButton variant="ghost" icon={Clock} onClick={() => { onNavigate('punch'); onClose(); }} style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>打刻</LiquidButton>
                    <LiquidButton variant="ghost" icon={List} onClick={() => { onNavigate('history'); onClose(); }} style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>履歴</LiquidButton>
                    <LiquidButton variant="ghost" icon={FileText} onClick={() => { onNavigate('reports'); onClose(); }} style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>レポート</LiquidButton>
                    <div style={{ height: '1px', background: COLORS.separator, margin: '12px 0' }} />
                    <LiquidButton variant="ghost" icon={Settings} onClick={() => { onNavigate('settings'); onClose(); }} style={{ justifyContent: 'flex-start' }}>設定</LiquidButton>
                </div>
            </div>
        </>
    );
}

// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('reports'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useState<User>(MOCK_USER_DATA);

  const renderScreen = () => {
    switch (activeTab) {
      case 'punch': return <PunchScreen user={user} />;
      case 'reports': return <ReportScreen onBack={() => setActiveTab('punch')} user={user} />;
      default: return <PunchScreen user={user} />;
    }
  };

  return (
    <LiquidContainer>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: `${LAYOUT.headerHeight}px`, padding: '0 20px', display: 'flex', alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.01)', // RNのHeaderは基本的に透明かBlur
      }}>
        <div onClick={() => setIsMenuOpen(true)} style={{ 
          width: 44, height: 44, borderRadius: 22,
          background: COLORS.glassWhite, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: SHADOWS.float, cursor: 'pointer',
          border: `1px solid ${COLORS.glassBorderLight}`
        }}>
          <Menu color={COLORS.textMain} size={22} />
        </div>
      </div>

      <ScrollContent>
        {renderScreen()}
      </ScrollContent>

      <LiquidDock activeTab={activeTab} onTabChange={setActiveTab} role={user.role} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} onNavigate={setActiveTab} />
    </LiquidContainer>
  );
}