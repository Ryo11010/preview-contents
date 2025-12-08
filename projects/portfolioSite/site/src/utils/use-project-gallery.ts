import { useMemo } from 'react';
import type { Project } from '@/data/types';
import { withBasePath } from './paths';

export const useProjectGallery = (project: Project | null) =>
  useMemo(() => {
    if (!project) return null;
    if (Array.isArray(project.gallery) && project.gallery.length > 0) {
      return project.gallery.map((src) => withBasePath(src));
    }
    const cover = (project.appIcon as string | undefined) || withBasePath('images/projects/dialect-museum/screenshot.webp');
    return [cover];
  }, [project]);
