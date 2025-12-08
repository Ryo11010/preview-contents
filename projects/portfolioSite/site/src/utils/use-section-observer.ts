import { useEffect, useRef } from 'react';
import { SECTION_IDS, SectionId } from '@/data/types';
import { uiMetrics } from '@/config/tokens';

type UseSectionObserverOptions = {
  sections?: readonly SectionId[];
  threshold?: number;
};

export const useSectionObserver = (
  onSectionChange: (id: SectionId) => void,
  { sections = SECTION_IDS, threshold = uiMetrics.sectionObserverThreshold }: UseSectionObserverOptions = {},
) => {
  const lastNotifiedId = useRef<SectionId | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const targets = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id as SectionId;
          if (lastNotifiedId.current === id) return;
          lastNotifiedId.current = id;
          onSectionChange(id);
        });
      },
      { threshold },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [onSectionChange, sections, threshold]);
};
