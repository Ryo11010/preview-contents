import type { ViewMode } from './types';

export const getWeekRange = (date: Date) => {
  const dayOfWeek = date.getDay();
  const diffToMon = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
};

export const formatDate = (date: Date, mode: ViewMode) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

  if (mode === '日') return `${y}年${m}月${d}日(${day})`;
  if (mode === '月') return `${y}年${m}月`;
  if (mode === '週') {
    const { monday, sunday } = getWeekRange(date);
    return `${monday.getMonth() + 1}/${monday.getDate()} - ${
      sunday.getMonth() + 1
    }/${sunday.getDate()}`;
  }
  if (mode === 'カスタム') return 'カスタム期間';
  return '';
};

export const shiftDateByViewMode = (baseDate: Date, mode: ViewMode, direction: number) => {
  const next = new Date(baseDate);
  if (mode === '日') next.setDate(next.getDate() + direction);
  else if (mode === '週') next.setDate(next.getDate() + direction * 7);
  else if (mode === '月') next.setMonth(next.getMonth() + direction);
  return next;
};

export const getWeekDate = (baseDate: Date, offset: number) => {
  const { monday } = getWeekRange(baseDate);
  const target = new Date(monday);
  target.setDate(monday.getDate() + offset);
  return target;
};

export const getShortDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()} (${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;

export const formatDateInputValue = (date: Date) => date.toISOString().slice(0, 10);
