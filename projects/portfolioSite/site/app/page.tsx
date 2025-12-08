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
import { Project } from '@/data/types';
import { openMailLink } from '@/utils/links';
import { useDockNavigation } from '@/utils/use-dock-navigation';
import { AboutTabValue, aboutTabs } from '@/config/copy';

export default function Page() {
  const { activeSection, scrollToSection } = useDockNavigation();
  const [selectedProject, setSelectedProject] = useState<null | (typeof projects)[number]>(null);
  const [aboutTab, setAboutTab] = useState<AboutTabValue>('skills');
  const handleContactEmail = useCallback(() => {
    openMailLink(profile.email);
  }, []);
  const handleHeroContact = useCallback(() => {
    scrollToSection('about');
  }, [scrollToSection]);

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

  const handleSelectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  return (
    <LiquidContainer>
      <HeroSection profile={profile} onScrollToWork={() => scrollToSection('work')} onContact={handleHeroContact} />

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
        options={aboutTabs}
        onChangeTab={setAboutTab}
        onContact={handleContactEmail}
      />

      <LiquidDock activeId={activeSection} onChange={scrollToSection} tabs={dockTabs} />

      <ProjectDetailSheet project={selectedProject} onClose={() => handleSelectProject(null)} />
    </LiquidContainer>
  );
}
