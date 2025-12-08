import React from 'react';
import { sectionCopy } from '@/config/copy';
import { SectionShell } from './SectionShell';
import { FolderComponent } from '../Folder';
import type { WorkSectionProps } from './types';

export const WorkSection: React.FC<WorkSectionProps> = ({ categorizedProjects, categories, onSelectProject }) => (
  <SectionShell id="work" title={sectionCopy.work.title} align="center" className="min-h-screen flex flex-col justify-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 justify-items-center">
      {categories.map((category, index) => {
        let align: 'left' | 'center' | 'right' = 'center';
        if (index % 3 === 0) align = 'left';
        if (index % 3 === 2) align = 'right';

        return (
          <FolderComponent
            key={category.id}
            label={category.label}
            subLabel={category.subLabel}
            projects={categorizedProjects[category.id] || []}
            onClick={onSelectProject}
            align={align}
          />
        );
      })}
    </div>

    <div className="text-center mt-20 max-w-lg mx-auto text-slate-500 text-sm leading-relaxed">
      <p>{sectionCopy.work.helper}</p>
    </div>
  </SectionShell>
);
