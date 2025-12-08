import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Cpu, ExternalLink, Github, Globe, Image as ImageIcon, Play, Share } from 'lucide-react';
import { projectSheetCopy } from '@/config/copy';
import { uiMetrics } from '@/config/tokens';
import type { Project } from '@/data/types';
import { demoImages, projectCategoryLabel } from '@/data/projects';
import { openExternalLink, shareContent } from '@/utils/links';
import { LiquidSheet } from './LiquidSheet';
import { LiquidButton } from './LiquidButton';

interface ProjectDetailSheetProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailSheet: React.FC<ProjectDetailSheetProps> = ({ project, onClose }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasVideo = Boolean(project?.videoUrl);
  const galleryCount = project?.gallery.length ?? 0;
  const totalMedia = (hasVideo ? 1 : 0) + galleryCount;

  useEffect(() => {
    setActiveMediaIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [project]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || totalMedia <= 0) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    const step = firstCard.offsetWidth + uiMetrics.mediaGalleryGap;
    if (step <= 0) return;

    const nextIndex = Math.round(container.scrollLeft / step);
    const clampedIndex = Math.max(0, Math.min(totalMedia - 1, nextIndex));
    setActiveMediaIndex(clampedIndex);
  }, [totalMedia]);

  if (!project) return null;

  return (
    <LiquidSheet
      isOpen={!!project}
      onClose={onClose}
      title={projectCategoryLabel[project.category]}
      headerRight={<LiquidButton size="sm" variant="ghost" icon={Share} onClick={() => shareContent(project.title)} />}
    >
      <div className="pb-12">
        <div className="mb-8">
          <div ref={scrollRef} onScroll={handleScroll} className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory hide-scrollbar">
            {hasVideo && (
              <div className="shrink-0 w-[85%] md:w-[600px] aspect-video rounded-[32px] overflow-hidden shadow-lg snap-center relative bg-black group">
                <Image
                  src={project.videoUrl || demoImages.videoPlaceholder}
                  alt={projectSheetCopy.promoBadge}
                  fill
                  className="object-cover opacity-80"
                  sizes="(min-width: 768px) 600px, 85vw"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play fill="white" className="text-white ml-1" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {projectSheetCopy.promoBadge}
                </div>
              </div>
            )}

            {project.gallery.map((img, idx) => (
              <div
                key={idx}
                className="shrink-0 w-[85%] md:w-[600px] aspect-video rounded-[32px] overflow-hidden shadow-lg snap-center bg-slate-100 relative"
              >
                <Image
                  src={img}
                  alt={`${projectSheetCopy.galleryLabel} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 600px, 85vw"
                />
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <ImageIcon size={12} /> {projectSheetCopy.galleryLabel} {idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-2">
            {totalMedia > 1 &&
              Array.from({ length: totalMedia }).map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeMediaIndex ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-300'}`} />
              ))}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{project.title}</h2>
            <p className="text-2xl text-slate-500 font-medium leading-snug">{project.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 uppercase tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-[24px] p-8 text-slate-700 shadow-sm">
            <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {projectSheetCopy.labels.year}
                </div>
                <div className="text-lg font-black text-slate-900">{project.year}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {projectSheetCopy.labels.role}
                </div>
                <div className="text-lg font-black text-slate-900">{project.role}</div>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg">{project.longDescription}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">★</span> {projectSheetCopy.headings.features}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-700 text-sm font-medium"
                >
                  <div className="mt-0.5 min-w-[16px] h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Cpu className="text-indigo-500" /> {projectSheetCopy.headings.tech}
            </h3>
            <div className="bg-slate-50 text-slate-700 border border-slate-200 rounded-[24px] p-6 shadow-sm">
              <p className="leading-relaxed text-base font-medium">{project.challenges}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {project.appStoreUrl && (
              <LiquidButton size="lg" className="w-full" onClick={() => openExternalLink(project.appStoreUrl)} icon={ExternalLink}>
                {projectSheetCopy.ctas.appStore}
              </LiquidButton>
            )}

            <div className="flex gap-3">
              {project.webUrl && (
                <LiquidButton
                  size="lg"
                  variant="glass"
                className="flex-1 bg-white border-slate-200"
                onClick={() => openExternalLink(project.webUrl)}
                icon={Globe}
              >
                {projectSheetCopy.ctas.website}
              </LiquidButton>
            )}
              {project.githubUrl && (
                <LiquidButton
                  size="lg"
                  variant="glass"
                className="flex-1 bg-white border-slate-200"
                onClick={() => openExternalLink(project.githubUrl)}
                icon={Github}
              >
                {projectSheetCopy.ctas.sourceCode}
              </LiquidButton>
            )}
            </div>
          </div>
        </div>
      </div>
    </LiquidSheet>
  );
};
