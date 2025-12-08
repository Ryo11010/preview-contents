import React, { useState } from 'react';
import { textures, plateStyle, uiMetrics } from '@/config/tokens';
import type { Project, ProjectCategory } from '@/data/types';
import { useWindowSize } from '@/utils/use-window-size';
import { Smartphone } from 'lucide-react';

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
}: {
  index: number;
  isOpen: boolean;
  isHovered: boolean;
  project?: Project;
  totalCards: number;
  align?: 'left' | 'center' | 'right';
}) => {
  const getTransform = () => {
    if (isOpen) {
      if (totalCards === 1) return 'translateY(-160px) rotate(0deg)';

      const baseSpread = 120;
      const spreadIncrement = 15;
      const maxSpread = 240;
      const spreadX = Math.min(baseSpread + Math.max(0, totalCards - 3) * spreadIncrement, maxSpread);

      const centerOffset = (totalCards - 1) / 2;
      const relativeIndex = index - centerOffset;

      let x = relativeIndex * (spreadX / (totalCards - 1 || 1)) * 2;
      const maxRotate = Math.min(10 + Math.max(0, totalCards - 3) * 1.5, 25);
      let rotate = relativeIndex * (maxRotate / centerOffset || 1);

      const yBase = -160;
      const archIntensity = 8;
      const y = yBase - Math.abs(relativeIndex) * archIntensity;

      const shiftAmount = Math.min(Math.max(40, totalCards * 15), 160);

      if (align === 'left') {
        x += shiftAmount;
        rotate += 5;
      } else if (align === 'right') {
        x -= shiftAmount;
        rotate -= 5;
      }

      return `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    }

    if (isHovered) {
      const x = -20 + (40 / (totalCards - 1 || 1)) * index;
      const rotate = -5 + (10 / (totalCards - 1 || 1)) * index;
      return `translate(${x}px, -60px) rotate(${rotate}deg)`;
    }

    return 'translate(0, 0) rotate(0deg)';
  };

  const centerIndex = (totalCards - 1) / 2;
  const distFromCenter = Math.abs(index - centerIndex);
  const zIndex = isOpen ? 50 - Math.floor(distFromCenter) : 10 + index;

  const bgGradient = project ? `bg-gradient-to-br ${project.color}` : 'bg-slate-800';

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 mx-auto w-56 h-36 rounded-2xl border border-white/20 shadow-2xl overflow-hidden origin-bottom transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${bgGradient}`}
      style={{
        transform: getTransform(),
        zIndex: Math.floor(zIndex),
      }}
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
  align?: 'left' | 'center' | 'right';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useWindowSize();

  const effectiveAlign = isMobile ? 'center' : align;
  const displayCards = projects.length > 0 ? projects : [undefined];
  const totalCards = displayCards.length;

  const toggleFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleCardClick = (e: React.MouseEvent, p?: Project) => {
    e.stopPropagation();
    if (isOpen && p) {
      onClick(p);
    } else {
      setIsOpen(true);
    }
  };

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
        className="absolute bottom-4 w-[17rem] h-52 bg-[#75BCE6] rounded-3xl z-0 transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${isOpen ? 0.95 : 1})`,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
        }}
      >
          <div className="absolute -top-4 left-0 w-24 h-10 bg-[#75BCE6] rounded-t-2xl border-t border-white/10" />
          <div className="w-full h-full opacity-30 mix-blend-overlay rounded-3xl" style={{ backgroundImage: `url(${textures.stardust})` }} />
        </div>

        <div className="absolute bottom-8 w-full flex justify-center items-end">
          {displayCards.map((proj, idx) => (
            <div key={proj?.id || idx} onClick={(e) => handleCardClick(e, proj)} className="contents">
              <FolderCardItem index={idx} isOpen={isOpen} isHovered={isHovered} project={proj} totalCards={totalCards} align={effectiveAlign} />
            </div>
          ))}
        </div>

        <div
          className="relative z-40 w-[17rem] h-[170px] bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${isOpen ? -20 : 0}deg) translateZ(${isOpen ? 0 : 20}px)`,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 rounded-[24px] pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-white font-bold text-lg drop-shadow-md tracking-tight">{label}</span>
            <span className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">{subLabel}</span>

            <div className={`mt-4 flex flex-wrap justify-center max-w-[80%] gap-1.5 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-60'}`}>
              {displayCards.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    isOpen ? 'w-1.5 h-1.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'w-1 h-1 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-[24px]"
            style={{ backgroundImage: `url("${textures.noise}")` }}
          />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 mt-2 transition-opacity duration-300">
        {isOpen ? 'Select a project' : `${projects.length} Projects`}
      </p>
    </div>
  );
};

export type CategorizedProjects = Record<ProjectCategory, Project[]>;
