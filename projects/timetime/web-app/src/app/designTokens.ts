import type { TabKey, ViewMode } from './types';

export const APP_CONFIG = {
  appName: 'timetime',
  companyName: '株式会社 timetime建設',
  version: 'v1.0.0',
  geofence: {
    defaultRadius: 200,
    minRadius: 50,
    maxRadius: 500,
    step: 10,
    displayScale: 0.7,
  },
};

export const ROLE_LABELS = {
  superAdmin: 'Super Admin',
  orgAdmin: '組織管理者',
  groupAdmin: 'グループ管理者',
  subAdmin: '小グループ管理者',
  user: '一般ユーザー',
  // 互換用（従来の admin 表記を組織管理者に紐付け）
  admin: '組織管理者',
};

export const ADMIN_ROLE_LABELS = [
  ROLE_LABELS.superAdmin,
  ROLE_LABELS.orgAdmin,
  ROLE_LABELS.groupAdmin,
  ROLE_LABELS.subAdmin,
];

export const APP_COPY = {
  version: `${APP_CONFIG.appName} ${APP_CONFIG.version}`,
};

export const COLORS = {
  primary: '#007AFF',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  indigo: '#5856D6',
  textMain: '#1C1C1E',
  textSub: '#8E8E93',
  bgTop: '#E0EAFC',
  bgBottom: '#CFDEF3',
  cardBg: 'rgba(255,255,255,0.9)',
  cardBorder: 'rgba(255,255,255,0.8)',
  separator: 'rgba(60,60,67,0.2)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const layout = {
  headerHeight: 56,
  dockHeight: 72,
};

export const MOTION = {
  punchPressScale: 0.95,
  punchSpring: {
    friction: 7,
    tension: 140,
  },
  punchRelease: {
    friction: 6,
    tension: 120,
  },
};

export const VIEW_MODE_OPTIONS: ViewMode[] = ['日', '週', '月'];
export const REPORT_VIEW_MODES: ViewMode[] = ['日', '週', '月', 'カスタム'];

export const ADMIN_TABS: { id: TabKey; label: string }[] = [
  { id: 'punch', label: '打刻' },
  { id: 'history', label: '履歴' },
  { id: 'admin', label: '管理' },
];

export const GENERAL_TABS: { id: TabKey; label: string }[] = [
  { id: 'punch', label: '打刻' },
  { id: 'history', label: '履歴' },
];
