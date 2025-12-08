import { Briefcase, Gamepad2, Library, Scan, Scissors } from 'lucide-react';
import { projectLookup } from './projects';
import type { TimelineItem } from './types';

export const timeline: TimelineItem[] = [
  {
    year: '2025',
    title: 'ShiftScanner リリース',
    desc: 'AIシフト解析と給与試算を提供するiOSアプリを公開。',
    icon: Scan,
    projectId: 'shift-scanner',
    color: 'text-orange-500',
  },
  {
    year: '2025',
    title: 'CodeClipper リリース',
    desc: 'LLM向けの自動分割コピー機能を備えたmacOSユーティリティを展開。',
    icon: Scissors,
    projectId: 'codeclipper',
    color: 'text-blue-500',
  },
  {
    year: '2025',
    title: 'MHLab β公開',
    desc: 'モンハン装備シミュレーターとDPS計算をiPhone単体で提供。',
    icon: Gamepad2,
    projectId: 'mhlab',
    color: 'text-purple-500',
  },
  {
    year: '2024',
    title: '合同会社FunterU 設立',
    desc: '学生起業家として法人化し、プロダクトと受託を統合管理。',
    icon: Briefcase,
    projectId: 'funteru-site',
    color: 'text-amber-500',
  },
  {
    year: '2024',
    title: '受託開始（日本語ミュージアム）',
    desc: '教育系Webアプリを皮切りに受託開発を本格化。',
    icon: Library,
    projectId: 'dialect-museum',
    color: 'text-slate-500',
  },
];

export const getTimelineProject = (id: string | null) => (id ? projectLookup[id] ?? null : null);
