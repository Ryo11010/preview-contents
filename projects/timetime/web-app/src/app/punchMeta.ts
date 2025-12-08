import { Coffee, LogIn, LogOut, PlayCircle } from 'lucide-react-native';
import type { IconComponent, PunchStatus, PunchTypeId } from './types';

export const PUNCH_TYPE_META: Record<
  PunchTypeId,
  { id: PunchTypeId; label: string; color: string; icon: IconComponent }
> = {
  in: { id: 'in', label: '出勤', color: '#007AFF', icon: LogIn },
  break_start: { id: 'break_start', label: '休憩', color: '#FF9500', icon: Coffee },
  break_end: { id: 'break_end', label: '再開', color: '#007AFF', icon: PlayCircle },
  out: { id: 'out', label: '退勤', color: '#34C759', icon: LogOut },
};

export const PUNCH_TYPE_ORDER: PunchTypeId[] = ['in', 'break_start', 'break_end', 'out'];

export const PUNCH_STATUS_TRANSITIONS: Record<PunchTypeId, PunchStatus> = {
  in: 'working',
  break_start: 'break',
  break_end: 'working',
  out: 'finished',
};

export const DEFAULT_SELECTION_BY_STATUS: Record<PunchStatus, PunchTypeId> = {
  none: 'in',
  working: 'out',
  break: 'break_end',
  finished: 'in',
};

export const PUNCH_PROCESSING_DELAY_MS = 800;
export const NOW_TICK_INTERVAL_MS = 1000;

export const getPunchColor = (type: PunchTypeId | null) =>
  type ? PUNCH_TYPE_META[type]?.color ?? '#ddd' : '#ddd';

export const getPunchLabel = (type: PunchTypeId | null) =>
  type ? PUNCH_TYPE_META[type]?.label ?? '選択' : '選択';
