import React from 'react';
import { ArrowUpRight, Briefcase, Globe, Smartphone, Sparkles } from 'lucide-react';
import { sectionCopy } from '@/config/copy';
import type { TimelineSectionProps } from './types';
import { LiquidCard } from '../LiquidCard';
import { getTimelineProject } from '@/data/timeline';
import { SectionShell } from './SectionShell';
import type { IconComponent, TimelinePlatform } from '@/data/types';

const platformIconMap: Record<TimelinePlatform, IconComponent> = {
  app: Smartphone,
  web: Globe,
  client: Briefcase,
  other: Sparkles,
};

const resolveIcon = (platform: TimelinePlatform | undefined, projectCategory: string | null, fallback?: IconComponent) => {
  if (platform && platformIconMap[platform]) return platformIconMap[platform];
  if (projectCategory && platformIconMap[projectCategory as TimelinePlatform]) {
    return platformIconMap[projectCategory as TimelinePlatform];
  }
  return fallback ?? Sparkles;
};

const timelinePalette: Record<
  TimelinePlatform | 'default',
  {
    iconClass: string;
    bubbleClass: string;
    ringClass: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  app: {
    iconClass: 'text-amber-600',
    bubbleClass: 'bg-white backdrop-blur-lg',
    ringClass: 'border border-[#FFE6C2]/80 shadow-[0_10px_30px_-10px_rgba(255,184,94,0.35)]',
    badgeBg: 'bg-[#FFF5E8]',
    badgeText: 'text-amber-700',
  },
  web: {
    iconClass: 'text-sky-600',
    bubbleClass: 'bg-white backdrop-blur-lg',
    ringClass: 'border border-[#D6E6FF]/80 shadow-[0_10px_30px_-12px_rgba(87,148,255,0.35)]',
    badgeBg: 'bg-[#EEF4FF]',
    badgeText: 'text-sky-700',
  },
  client: {
    iconClass: 'text-emerald-600',
    bubbleClass: 'bg-white backdrop-blur-lg',
    ringClass: 'border border-[#D5F3E4]/80 shadow-[0_10px_30px_-12px_rgba(38,166,123,0.3)]',
    badgeBg: 'bg-[#E9FBF2]',
    badgeText: 'text-emerald-700',
  },
  other: {
    iconClass: 'text-indigo-600',
    bubbleClass: 'bg-white backdrop-blur-lg',
    ringClass: 'border border-[#E0E6FF]/80 shadow-[0_10px_30px_-12px_rgba(99,102,241,0.28)]',
    badgeBg: 'bg-[#F3F4FF]',
    badgeText: 'text-indigo-700',
  },
  default: {
    iconClass: 'text-slate-600',
    bubbleClass: 'bg-white backdrop-blur-lg',
    ringClass: 'border border-white/70 shadow-sm',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-500',
  },
};

const resolveTimelineStyle = (platform: TimelinePlatform | undefined, projectCategory: string | null) => {
  const key = platform ?? (projectCategory as TimelinePlatform) ?? 'default';
  return timelinePalette[key] ?? timelinePalette.default;
};

const formatTimelineDate = (year: string, month?: string) => {
  if (!month) return year;
  const normalizedMonth = month.padStart(2, '0');
  return `${year}.${normalizedMonth}`;
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({ items, onSelectProject }) => (
  <SectionShell id="history" title={sectionCopy.timeline.title} align="center" widthClassName="max-w-4xl">
    <div className="relative space-y-8">
      <div className="absolute left-[39px] top-8 bottom-8 w-[3px] bg-gradient-to-b from-[#f9c5d1]/70 via-[#d6e2ff]/85 to-[#7fb3ff]/70" />

      {items.map((item, index) => {
        const project = item.projectId ? getTimelineProject(item.projectId) : null;
        const PlatformIcon = resolveIcon(item.platform, project?.category ?? null, item.icon);
        const palette = resolveTimelineStyle(item.platform, project?.category ?? null);
        const dateLabel = formatTimelineDate(item.year, item.month);
        return (
          <div key={`${item.title}-${index}`} className="relative pl-28 group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center z-10 ${palette.bubbleClass} ${palette.ringClass} transition-all duration-500 ${
                  item.projectId ? 'group-hover:scale-110 group-hover:rotate-3' : 'opacity-85'
                }`}
              >
                <PlatformIcon size={24} className={palette.iconClass || item.color} />
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
                  {project && <ArrowUpRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${palette.badgeBg} ${palette.badgeText}`}>{dateLabel}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </LiquidCard>
          </div>
        );
      })}
    </div>
  </SectionShell>
);
