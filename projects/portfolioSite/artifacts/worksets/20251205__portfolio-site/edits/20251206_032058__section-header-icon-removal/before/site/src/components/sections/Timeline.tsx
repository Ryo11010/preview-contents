import React from 'react';
import { ArrowUpRight, History } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import type { TimelineSectionProps } from './types';
import { LiquidCard } from '../LiquidCard';
import { getTimelineProject } from '@/data/timeline';

export const TimelineSection: React.FC<TimelineSectionProps> = ({ items, onSelectProject }) => (
  <div id="history" className="max-w-4xl mx-auto px-6 py-24">
    <SectionHeader icon={History} title="Journey" align="center" />

    <div className="relative space-y-8">
      <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

      {items.map((item, index) => {
        const Icon = item.icon;
        const project = item.projectId ? getTimelineProject(item.projectId) : null;
        return (
          <div key={`${item.title}-${index}`} className="relative pl-28 group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-[#F0F2F5] z-10 bg-white shadow-sm transition-all duration-500 ${
                  item.projectId ? 'group-hover:scale-110 group-hover:rotate-3' : 'opacity-80'
                }`}
              >
                <Icon size={24} className={item.color} />
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
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit">{item.year}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </LiquidCard>
          </div>
        );
      })}
    </div>
  </div>
);
