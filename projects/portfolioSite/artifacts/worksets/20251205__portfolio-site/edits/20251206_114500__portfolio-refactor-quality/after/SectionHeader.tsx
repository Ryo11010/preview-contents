import React from 'react';
import type { IconComponent } from '@/data/types';

type SectionHeaderProps = {
  icon?: IconComponent;
  title: string;
  align?: 'left' | 'center';
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, align = 'left' }) => (
  <div className={`flex items-center gap-4 mb-16 pl-2 ${align === 'center' ? 'justify-center' : ''}`}>
    {Icon ? (
      <div className="p-3 bg-white/80 rounded-2xl shadow-sm border border-white/50 text-indigo-600">
        <Icon size={28} />
      </div>
    ) : null}
    <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{title}</h2>
  </div>
);
