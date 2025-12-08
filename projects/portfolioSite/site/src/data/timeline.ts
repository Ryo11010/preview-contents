import { projectLookup } from './projects';
import type { TimelineItem } from './types';

export const timeline: TimelineItem[] = [
  {
    year: '2025',
    month: '12',
    title: 'ポートフォリオサイト刷新',
    desc: '本ポートフォリオを公開し、プロダクト紹介と技術背景を一元化。',
    platform: 'web',
    projectId: 'portfolio-site',
    color: 'text-indigo-500',
  },
  {
    year: '2025',
    month: '12',
    title: 'removision 改修版リリース',
    desc: 'リモートワークの仕事内容を見える化するmacOSアプリ。',
    platform: 'app',
    projectId: 'removision',
    color: 'text-orange-500',
  },
  {
    year: '2025',
    month: '03',
    title: 'ShiftScanner リリース',
    desc: 'AIシフト解析と給与試算を提供するiOSアプリを公開。',
    platform: 'app',
    projectId: 'shift-scanner',
    color: 'text-orange-500',
  },
  {
    year: '2025',
    month: '02',
    title: 'CodeClipper リリース',
    desc: 'LLM向けの自動分割コピー機能を備えたmacOSユーティリティを展開。',
    platform: 'app',
    projectId: 'codeclipper',
    color: 'text-orange-500',
  },
  {
    year: '2025',
    month: '01',
    title: 'MHLab リリース',
    desc: 'モンハン装備シミュレーターとDPS計算をiPhone単体で提供。',
    platform: 'app',
    projectId: 'mhlab',
    color: 'text-purple-500',
  },
  {
    year: '2024',
    month: '09',
    title: '合同会社FunterU 設立',
    desc: '学生起業家として法人化し、プロダクトと受託を統合管理。',
    platform: 'web',
    projectId: 'funteru-site',
    color: 'text-amber-500',
  },
  {
    year: '2024',
    month: '04',
    title: '受託開始（日本語ミュージアム）',
    desc: '教育系Webアプリを皮切りに受託開発を本格化。',
    platform: 'client',
    projectId: 'dialect-museum',
    color: 'text-slate-500',
  },
];

export const getTimelineProject = (id: string | null) => (id ? projectLookup[id] ?? null : null);
