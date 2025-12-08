import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { folderMotion, folderStyle, plateStyle, textures } from '@/config/tokens';
import { folderCopy } from '@/config/copy';
import type { Project, ProjectCategory } from '@/data/types';
import { useWindowSize } from '@/utils/use-window-size';
import { Smartphone } from 'lucide-react';

type Align = 'left' | 'center' | 'right';

const clampIndex = (index: number, total: number) => Math.min(Math.max(index, 0), Math.max(total - 1, 0));

const getAnchorOffset = (align: Align) =>
  align === 'left' ? folderMotion.edgeAnchorOffset : align === 'right' ? -folderMotion.edgeAnchorOffset : 0;

const computeOpenTransform = ({
  index,
  activeIndex,
  align,
  totalCards,
}: {
  index: number;
  activeIndex: number;
  align: Align;
  totalCards: number;
}) => {
  if (totalCards === 1) return `translateY(${folderMotion.openYOffset}px) rotate(0deg)`;

  const spreadX = Math.min(
    folderMotion.baseSpread + Math.max(0, totalCards - 3) * folderMotion.spreadIncrement,
    folderMotion.maxSpread,
  );
  const spreadDivider = Math.max(totalCards - 1, 1);
  const relativeIndex = index - activeIndex;
  const anchorOffset = getAnchorOffset(align);

  let x = anchorOffset + relativeIndex * (spreadX / spreadDivider);

  const maxRotate = Math.min(
    folderMotion.maxRotateBase + Math.max(0, totalCards - 3) * folderMotion.maxRotateIncrement,
    folderMotion.maxRotateCap,
  );
  let rotate = relativeIndex * (maxRotate / Math.max(spreadDivider, 1));

  const y = folderMotion.openYOffset - Math.abs(relativeIndex) * folderMotion.archIntensity;

  const shiftAmount = Math.min(
    Math.max(folderMotion.alignShiftBase, totalCards * folderMotion.alignShiftScale),
    folderMotion.alignShiftMax,
  );
  if (align === 'left') {
    x += shiftAmount;
    rotate += folderMotion.alignRotateAdjust;
  } else if (align === 'right') {
    x -= shiftAmount;
    rotate -= folderMotion.alignRotateAdjust;
  }

  const scale = index === activeIndex ? folderMotion.focusScale : folderMotion.inactiveScale;
  const lift = index === activeIndex ? folderMotion.focusLift : 0;

  return `translate(${x}px, ${y - lift}px) rotate(${rotate}deg) scale(${scale})`;
};

const computeHoverTransform = ({
  index,
  align,
  totalCards,
}: {
  index: number;
  align: Align;
  totalCards: number;
}) => {
  const anchorOffset = getAnchorOffset(align);
  const hoverDivider = Math.max(totalCards - 1, 1);
  const x = anchorOffset + folderMotion.hoverTranslateX + (folderMotion.hoverTranslateRange / hoverDivider) * index;
  const rotate = folderMotion.hoverRotateStart + (folderMotion.hoverRotateRange / hoverDivider) * index;
  return `translate(${x}px, ${folderMotion.hoverTranslateY}px) rotate(${rotate}deg)`;
};

const computeTransform = ({
  isOpen,
  isHovered,
  index,
  activeIndex,
  align,
  totalCards,
}: {
  isOpen: boolean;
  isHovered: boolean;
  index: number;
  activeIndex: number;
  align: Align;
  totalCards: number;
}) => {
  if (isOpen) return computeOpenTransform({ index, activeIndex, align, totalCards });
  if (isHovered) return computeHoverTransform({ index, align, totalCards });
  return 'translate(0, 0) rotate(0deg)';
};

const computeZIndex = (isOpen: boolean, index: number, activeIndex: number) => {
  if (isOpen) {
    const distance = Math.abs(index - activeIndex);
    return folderMotion.openZBase + (index === activeIndex ? folderMotion.activeZBoost : 0) - Math.floor(distance);
  }
  return folderMotion.closedZBase + index;
};

const FolderCardContent: React.FC<{ project?: Project }> = ({ project }) => {
  if (!project) {
    return (
      <div className="w-full h-full p-5 flex flex-col gap-3">
        <div className="w-1/2 h-4 bg-white/10 rounded-md" />
        <div className="w-full h-16 bg-white/5 rounded-md" />
        <div className="flex gap-2 mt-auto">
          <div className="w-6 h-6 rounded-full bg-white/10" />
          <div className="w-1/2 h-2 rounded-full bg-white/10 mt-2" />
        </div>
      </div>
    );
  }

  const Icon = project.icon || Smartphone;

  return (
    <div className="w-full h-full p-5 flex flex-col relative z-10">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80">
          {project.year}
        </span>
        <Icon size={16} className="text-white/60" />
      </div>
      <h4 className="text-base font-bold text-white mb-2 leading-tight line-clamp-2">{project.title}</h4>
      <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">{project.tagline}</p>
      <div className="mt-auto flex gap-1">
        {project.techStack.slice(0, 2).map((tech) => (
          <span key={tech} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-white/40">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

const FolderCardItem = ({
  index,
  isOpen,
  isHovered,
  project,
  totalCards,
  align = 'center',
  activeIndex,
}: {
  index: number;
  isOpen: boolean;
  isHovered: boolean;
  project?: Project;
  totalCards: number;
  align?: Align;
  activeIndex: number;
}) => {
  const transform = computeTransform({ isOpen, isHovered, index, activeIndex, align, totalCards });
  const zIndex = computeZIndex(isOpen, index, activeIndex);
  const opacity = isOpen && index !== activeIndex ? folderMotion.inactiveOpacity : 1;
  const bgGradient = project ? `bg-gradient-to-br ${project.color}` : 'bg-slate-800';

  return (
    <div
      className={[
        'absolute bottom-0 left-0 right-0 mx-auto w-56 h-36 rounded-2xl border border-white/20 shadow-2xl',
        'overflow-hidden origin-bottom transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
        bgGradient,
      ].join(' ')}
      style={{ transform, zIndex: Math.floor(zIndex), opacity }}
    >
      <FolderCardContent project={project} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/20 pointer-events-none" />
    </div>
  );
};

export const FolderComponent = ({
  label,
  subLabel,
  projects = [],
  onClick,
  align = 'center',
}: {
  label: string;
  subLabel: string;
  projects: Project[];
  onClick: (p: Project) => void;
  align?: Align;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const lastScrubTs = useRef(0);
  const { isMobile } = useWindowSize();

  const effectiveAlign: Align = isMobile ? 'center' : align;
  const displayCards = useMemo(() => (projects.length > 0 ? projects : [undefined]), [projects]);
  const totalCards = displayCards.length;

  useEffect(() => {
    if (activeIndex > totalCards - 1) {
      setActiveIndex(Math.max(0, totalCards - 1));
    }
  }, [activeIndex, totalCards]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  const toggleFolder = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const setIndexSafe = useCallback(
    (idx: number) => {
      const clamped = clampIndex(idx, totalCards);
      setIsOpen(true);
      setActiveIndex(clamped);
    },
    [totalCards],
  );

  const focusCard = useCallback((idx: number) => setIndexSafe(idx), [setIndexSafe]);

  const handleScrub = useCallback(
    (clientX: number) => {
      const now = Date.now();
      if (now - lastScrubTs.current < (folderMotion.scrubThrottleMs ?? 0)) return;
      lastScrubTs.current = now;

      const rect = dotsRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const offset = clientX - rect.left;
      const step = Math.max(folderMotion.scrubStepPx || rect.width / totalCards, 1);
      const idx = Math.floor(offset / step);
      setIndexSafe(idx);
    },
    [setIndexSafe, totalCards],
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent, idx: number, p?: Project) => {
      e.stopPropagation();
      if (!isOpen || activeIndex !== idx) {
        focusCard(idx);
        return;
      }
      if (p) onClick(p);
    },
    [activeIndex, focusCard, isOpen, onClick],
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-64 h-64 flex items-end justify-center pb-4 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleFolder}
        style={{ perspective: plateStyle.perspective }}
      >
        <div
          className="absolute bottom-4 w-[17rem] h-52 rounded-3xl z-0 transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${isOpen ? 0.95 : 1})`,
            boxShadow: folderStyle.plateShadow,
            backgroundColor: folderStyle.plateColor,
          }}
        >
          <div
            className="absolute -top-4 left-0 w-24 h-10 rounded-t-2xl border-t border-white/10"
            style={{ backgroundColor: folderStyle.plateColor }}
          />
          <div className={`w-full h-full rounded-3xl ${folderStyle.plateNoiseClass}`} style={{ backgroundImage: `url(${textures.stardust})` }} />
        </div>

        <div className="absolute bottom-8 w-full flex justify-center items-end">
          {displayCards.map((proj, idx) => (
            <div key={proj?.id || idx} onClick={(e) => handleCardClick(e, idx, proj)} className="contents">
              <FolderCardItem
                index={idx}
                isOpen={isOpen}
                isHovered={isHovered}
                project={proj}
                totalCards={totalCards}
                align={effectiveAlign}
                activeIndex={activeIndex}
              />
            </div>
          ))}
        </div>

        <div
          className="relative z-40 w-[17rem] h-[170px] bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${isOpen ? folderMotion.openTiltDegrees : 0}deg) translateZ(${isOpen ? 0 : folderMotion.closedTranslateZ}px)`,
            boxShadow: folderStyle.coverShadow,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 rounded-[24px] pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-white font-bold text-lg drop-shadow-md tracking-tight">{label}</span>
            <span className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">{subLabel}</span>

            <div
              ref={dotsRef}
              className={`mt-4 flex flex-wrap justify-center max-w-[80%] gap-1.5 transition-all duration-500 ${
                isOpen ? 'opacity-100' : 'opacity-60'
              }`}
              onMouseMove={(e) => handleScrub(e.clientX)}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                if (touch) handleScrub(touch.clientX);
              }}
            >
              {displayCards.map((_, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      focusCard(i);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      isOpen
                        ? isActive
                          ? 'w-3 h-3 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)] ring-2 ring-white/70'
                          : 'w-2 h-2 bg-white/40'
                        : 'w-1.5 h-1.5 bg-white/30'
                    }`}
                    aria-label={`Show card ${i + 1}`}
                    aria-current={isActive}
                  />
                );
              })}
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-[24px]"
            style={{ backgroundImage: `url("${textures.noise}")` }}
          />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 mt-2 transition-opacity duration-300">
        {isOpen ? folderCopy.openLabel : folderCopy.getProjectCountLabel(projects.length)}
      </p>
    </div>
  );
};

export type CategorizedProjects = Record<ProjectCategory, Project[]>;
