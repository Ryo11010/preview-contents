import { LucideIcon } from 'lucide-react';

export type IconComponent = LucideIcon;

export type SocialLinks = {
  github: string;
  twitter: string;
};

export type ProjectCategory = 'app' | 'web' | 'client';

export type Interest = {
  label: string;
  icon: IconComponent;
  color: string;
};

export type Profile = {
  name: string;
  role: {
    line1: string;
    line2: string;
  };
  catchphrase: string;
  description: string;
  email: string;
  socials: SocialLinks;
  skills: string[];
  interests: Interest[];
};

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  role: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  challenges: string;
  techStack: string[];
  color: string;
  accent: string;
  icon?: IconComponent;
  gallery: string[];
  videoUrl?: string;
  appStoreUrl?: string;
  githubUrl?: string;
  webUrl?: string;
};

export type TimelineItem = {
  year: string;
  month: string;
  title: string;
  desc: string;
  icon: IconComponent;
  projectId: Project['id'] | null;
  color: string;
};

export const SECTION_IDS = ['hero', 'work', 'history', 'about'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type DockTab = {
  id: SectionId;
  icon: IconComponent;
};

export type CategoryConfig = {
  id: ProjectCategory;
  label: string;
  subLabel: string;
  icon: IconComponent;
};

export type SegmentOption<T extends string> = {
  label: string;
  value: T;
};
