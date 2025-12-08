import React from 'react';
import Image from 'next/image';
import { Github, Mail, Sparkles, Twitter, User } from 'lucide-react';
import { aboutCopy, sectionCopy } from '@/config/copy';
import type { AboutSectionProps } from './types';
import { SectionShell } from './SectionShell';
import { LiquidCard } from '../LiquidCard';
import { LiquidSegmentControl } from '../LiquidSegmentControl';
import { LiquidButton } from '../LiquidButton';
import { openExternalLink } from '@/utils/links';

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, aboutTab, options, onChangeTab, onContact }) => {
  const hasPhoto = Boolean(profile.photo?.src);
  const photoSrc = hasPhoto && profile.photo?.src ? (profile.photo.src.startsWith('/') ? profile.photo.src : `/${profile.photo.src}`) : '';
  const photoAlt = profile.photo?.alt || `${profile.name}の写真`;

  return (
    <SectionShell id="about" widthClassName="max-w-4xl" className="pb-48">
      <LiquidCard padding="p-12" className="flex flex-col items-center bg-white/80 text-center">
        <div className="flex flex-col items-center mb-10 w-full">
          <div className="w-40 h-40 rounded-[48px] bg-gradient-to-tr from-indigo-100 via-purple-100 to-blue-100 p-2 shadow-2xl mb-6 hover:rotate-3 transition-transform duration-500">
            <div className="w-full h-full rounded-[40px] bg-white flex items-center justify-center overflow-hidden relative">
              {hasPhoto && photoSrc ? (
                <Image src={photoSrc} alt={photoAlt} fill className="object-cover" sizes="160px" />
              ) : (
                <User size={64} className="text-slate-300" />
              )}
              <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-3">{profile.name}</h2>
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-sm">
              {profile.role.line1}
            </div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-bold text-sm">
              {profile.role.line2}
            </div>
          </div>

          <div className="flex gap-3">
            <LiquidButton
              size="icon"
              variant="glass"
              onClick={() => openExternalLink(profile.socials.twitter)}
              icon={Twitter}
              className="hover:text-[#1DA1F2] bg-white border-slate-200"
            />
            <LiquidButton
              size="icon"
              variant="glass"
              onClick={() => openExternalLink(profile.socials.github)}
              icon={Github}
              className="hover:text-black bg-white border-slate-200"
            />
            <LiquidButton
              size="icon"
              variant="glass"
              onClick={onContact}
              icon={Mail}
              className="hover:text-red-500 bg-white border-slate-200"
            />
          </div>
        </div>

        <div className="w-16 h-1 bg-slate-100 rounded-full mb-10" />

        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
            {sectionCopy.about.title}
          </h3>

          <p className="text-slate-600 leading-relaxed text-lg mb-10">
            {profile.description}
            <br />
            <br />
            {aboutCopy.note.prefix}
            <strong className="text-slate-900">{aboutCopy.note.emphasisA}</strong>
            {aboutCopy.note.bridge}
            <strong className="text-slate-900">{aboutCopy.note.emphasisB}</strong>
            {aboutCopy.note.suffix}
          </p>

          <div className="w-full max-w-sm mx-auto mb-8">
            <LiquidSegmentControl options={options} value={aboutTab} onChange={onChangeTab} />
          </div>

          <div className="flex justify-center items-start min-h-[80px]">
            {aboutTab === 'skills' ? (
              <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-500 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {profile.interests.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold shadow-sm border border-transparent hover:scale-105 transition-transform duration-300 cursor-default ${item.color}`}
                  >
                    <item.icon size={18} /> {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LiquidCard>
    </SectionShell>
  );
};
