import type { ComponentType } from 'react';

export type ViewMode = '日' | '週' | '月' | 'カスタム';

export type TabKey =
  | 'punch'
  | 'history'
  | 'settings'
  | 'settings_profile'
  | 'settings_notifications'
  | 'settings_password'
  | 'admin'
  | 'admin_org_settings'
  | 'admin_group_settings'
  | 'admin_subgroup_settings'
  | 'admin_group_edit'
  | 'admin_subgroup_edit'
  | 'reports';

export type PunchTypeId = 'in' | 'break_start' | 'break_end' | 'out';
export type PunchStatus = 'none' | 'working' | 'break' | 'finished';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  currentGroup: string;
  currentSubgroup: string;
  // 管理画面での表示用メタ
  location?: string;
  dailyTime?: string;
  weeklyHours?: string;
  weeklyDays?: string;
  monthlyHours?: string;
  monthlyDays?: string;
};

export type Group = { id: number; name: string; code: string };
export type Subgroup = { id: number; name: string; radius: number };

export type HistoryEvent = {
  id: number;
  type: string;
  time: string;
  valid: boolean;
  punchType: PunchTypeId;
};

export type WeeklyStat = { day: string; hours: number; date: string };
export type MonthlyStat = { date: string; day: string; hours: number; status: string };

export type PunchSettingItem = {
  id: number;
  title: string;
  type: 'system' | 'break' | 'custom';
  required: boolean;
  enabled: boolean;
  labelIn: string;
  labelOut: string;
};

export type IconComponent = ComponentType<{ size?: number; color?: string }>;
