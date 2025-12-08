import { Globe, Layers, Smartphone, Sparkles, Zap } from 'lucide-react';
import { projectLookup } from './projects';
import type { TimelineItem } from './types';

export const timeline: TimelineItem[] = [
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

export const getTimelineProject = (id: string | null) => (id ? projectLookup[id] ?? null : null);
