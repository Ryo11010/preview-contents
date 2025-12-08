import React from 'react';
import { Folder, Mail } from 'lucide-react';
import { heroActionsCopy, heroCopy } from '@/config/copy';
import type { HeroSectionProps } from './types';
import { LiquidCard } from '../LiquidCard';
import { LiquidButton } from '../LiquidButton';

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onScrollToWork, onContact }) => (
  <div id="hero" className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-20 pb-32">
    <div className="mb-10 animate-[fade-in-up_1s_ease-out]">
      <LiquidCard padding="px-5 py-2.5" className="!rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md inline-block">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-slate-600 tracking-wider whitespace-nowrap">{heroCopy.status}</span>
        </div>
      </LiquidCard>
    </div>

    <h1 className="text-7xl md:text-[100px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 pb-4 mb-4 leading-[1.05]">
      {profile.catchphrase}
    </h1>

    <p className="text-xl md:text-3xl text-slate-600 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
      {heroCopy.leadPrefix}{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">{heroCopy.leadHighlight}</span>
      {heroCopy.leadSuffix}
    </p>

    <div className="flex flex-col sm:flex-row gap-5">
      <LiquidButton size="lg" onClick={onScrollToWork} icon={Folder} className="shadow-xl shadow-indigo-500/20">
        {heroActionsCopy.browseProjects}
      </LiquidButton>
      <LiquidButton size="lg" variant="glass" onClick={onContact} icon={Mail}>
        {heroActionsCopy.contactMe}
      </LiquidButton>
    </div>
  </div>
);
