import type { Profile, Project, CategoryConfig, TimelineItem } from '@/data/types';

export type HeroSectionProps = {
  profile: Profile;
  onScrollToWork: () => void;
  onContact: () => void;
};

export type WorkSectionProps = {
  categorizedProjects: Record<Project['category'], Project[]>;
  categories: CategoryConfig[];
  onSelectProject: (project: Project) => void;
};

export type TimelineSectionProps = {
  items: TimelineItem[];
  onSelectProject: (project: Project) => void;
};

export type AboutSectionProps = {
  profile: Profile;
  aboutTab: 'skills' | 'interests';
  options: { label: string; value: 'skills' | 'interests' }[];
  onChangeTab: (tab: 'skills' | 'interests') => void;
  onContact: () => void;
};
