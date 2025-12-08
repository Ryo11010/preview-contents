import React from 'react';
import { Briefcase } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { FolderComponent } from '../Folder';
import type { WorkSectionProps } from './types';

export const WorkSection: React.FC<WorkSectionProps> = ({ categorizedProjects, categories, onSelectProject }) => (
  <div id="work" className="max-w-7xl mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
    <SectionHeader icon={Briefcase} title="Work Archives" align="center" />

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
      <p>Folderをタップするとプロジェクトが展開します。<br />各カードを選択して詳細をご覧ください。</p>
    </div>
  </div>
);
