import { ROLE_LABELS } from '../src/app/designTokens';
import {
  Group,
  HistoryEvent,
  MonthlyStat,
  PunchSettingItem,
  Subgroup,
  User,
  WeeklyStat,
} from '../src/app/types';
import { getWeekRange } from '../src/app/dateUtils';

export const MOCK_USER_DATA: User = {
  id: '8829-1123-9991',
  name: '田中 太郎',
  email: 'taro.tanaka@timetime.co.jp',
  role: ROLE_LABELS.admin,
  avatar: null,
  currentGroup: '関東エリア',
  currentSubgroup: '新宿駅前現場',
};

export const MOCK_GROUPS: Group[] = [
  { id: 1, name: '関東エリア', code: 'GRP-101' },
  { id: 2, name: '関西エリア', code: 'GRP-102' },
  { id: 3, name: '九州エリア', code: 'GRP-103' },
];

export const MOCK_SUBGROUPS: Record<string, Subgroup[]> = {
  関東エリア: [
    { id: 101, name: '新宿駅前現場', radius: 150 },
    { id: 102, name: '渋谷開発PJ', radius: 200 },
  ],
  関西エリア: [{ id: 201, name: '梅田タワー', radius: 100 }],
  九州エリア: [{ id: 301, name: '博多駅前', radius: 120 }],
};

export const INITIAL_PUNCH_ITEMS: PunchSettingItem[] = [
  {
    id: 1,
    title: '出勤・退勤',
    type: 'system',
    required: true,
    enabled: true,
    labelIn: '出勤',
    labelOut: '退勤',
  },
  {
    id: 2,
    title: '休憩',
    type: 'break',
    required: false,
    enabled: true,
    labelIn: '休憩',
    labelOut: '再開',
  },
];

export const getHistoryEvents = (baseDate: Date): HistoryEvent[] => {
  const seed = baseDate.getDate() + baseDate.getMonth();
  return [
    { id: 1, type: '出勤', punchType: 'in', time: `08:${30 + (seed % 30)}`, valid: true },
    { id: 2, type: '休憩開始', punchType: 'break_start', time: '12:00', valid: true },
    { id: 3, type: '休憩終了', punchType: 'break_end', time: '13:00', valid: true },
    { id: 4, type: '退勤', punchType: 'out', time: `18:${10 + (seed % 40)}`, valid: true },
  ];
};

export const getWeeklyStats = (baseDate: Date): WeeklyStat[] => {
  const { monday } = getWeekRange(baseDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: ['月', '火', '水', '木', '金', '土', '日'][i],
      hours: i < 5 ? 8 + ((d.getDate() % 5) / 10) : 0,
      date: `${d.getMonth() + 1}/${d.getDate()}`,
    };
  });
};

export const getMonthlyStats = (baseDate: Date): MonthlyStat[] => {
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
      status: isWeekend ? '休日' : '出勤',
    };
  });
};

export const getSubgroupsForGroup = (groupName: string): Subgroup[] => {
  return MOCK_SUBGROUPS[groupName] ?? [];
};

export const getDefaultSubgroupName = (groupName: string, fallback: string) => {
  const subgroups = getSubgroupsForGroup(groupName);
  return subgroups[0]?.name ?? fallback;
};
