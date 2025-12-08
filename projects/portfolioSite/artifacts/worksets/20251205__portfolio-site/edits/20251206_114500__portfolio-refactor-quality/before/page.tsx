'use client';

import { useCallback, useMemo, useState } from 'react';
import { LiquidContainer } from '@/components/LiquidContainer';
import { HeroSection } from '@/components/sections/Hero';
import { WorkSection } from '@/components/sections/Work';
import { TimelineSection } from '@/components/sections/Timeline';
import { AboutSection } from '@/components/sections/About';
import { LiquidDock } from '@/components/LiquidDock';
import { ProjectDetailSheet } from '@/components/ProjectDetailSheet';
import { categories, projectCategoryIds, projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { timeline } from '@/data/timeline';
import { dockTabs } from '@/data/navigation';
import { Project, SectionId } from '@/data/types';
import { useSectionObserver } from '@/utils/use-section-observer';
import { openMailLink } from '@/utils/links';

const aboutOptions = [
  { label: 'Technical Skills', value: 'skills' as const },
  { label: 'Personal Interests', value: 'interests' as const },
];

export default function Page() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [selectedProject, setSelectedProject] = useState<null | (typeof projects)[number]>(null);
  const [aboutTab, setAboutTab] = useState<'skills' | 'interests'>('skills');

  const categorizedProjects = useMemo(() => {
    const base = projectCategoryIds.reduce((acc, id) => {
      acc[id] = [] as Project[];
      return acc;
    }, {} as Record<(typeof projectCategoryIds)[number], Project[]>);

    projects.forEach((project) => {
      base[project.category].push(project);
    });

    return base;
  }, []);

  const scrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSectionChange = useCallback((id: SectionId) => {
    setActiveSection(id);
  }, []);

  useSectionObserver(handleSectionChange);

  const handleContact = useCallback(() => {
    openMailLink(profile.email);
  }, []);

  const handleSelectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  return (
    <LiquidContainer>
      <HeroSection profile={profile} onScrollToWork={() => scrollTo('work')} onContact={handleContact} />

      <WorkSection categorizedProjects={categorizedProjects} categories={categories} onSelectProject={handleSelectProject} />

      <TimelineSection
        items={timeline}
        onSelectProject={(project) => {
          handleSelectProject(project);
        }}
      />

      <AboutSection
        profile={profile}
        aboutTab={aboutTab}
        options={aboutOptions}
        onChangeTab={setAboutTab}
        onContact={handleContact}
      />

      <LiquidDock activeId={activeSection} onChange={scrollTo} tabs={dockTabs} />

      <ProjectDetailSheet project={selectedProject} onClose={() => handleSelectProject(null)} />
    </LiquidContainer>
  );
}
