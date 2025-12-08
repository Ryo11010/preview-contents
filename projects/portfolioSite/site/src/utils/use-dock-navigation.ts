import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionId, SECTION_IDS } from '@/data/types';
import { useSectionObserver } from './use-section-observer';

type UseDockNavigationOptions = {
  lockDurationMs?: number;
  sections?: readonly SectionId[];
};

export const useDockNavigation = ({
  lockDurationMs = 2500,
  sections = SECTION_IDS,
}: UseDockNavigationOptions = {}) => {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const navigationTargetRef = useRef<SectionId | null>(null);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNavigationTimeout = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, []);

  const commitActiveSection = useCallback((id: SectionId) => {
    setActiveSection((prev) => (prev === id ? prev : id));
  }, []);

  const handleSectionChange = useCallback(
    (id: SectionId) => {
      const pending = navigationTargetRef.current;
      if (pending) {
        if (id === pending) {
          navigationTargetRef.current = null;
          clearNavigationTimeout();
          commitActiveSection(id);
        }
        return;
      }

      commitActiveSection(id);
    },
    [clearNavigationTimeout, commitActiveSection],
  );

  const scrollToSection = useCallback(
    (id: SectionId) => {
      navigationTargetRef.current = id;
      clearNavigationTimeout();
      navigationTimeoutRef.current = setTimeout(() => {
        navigationTargetRef.current = null;
        navigationTimeoutRef.current = null;
      }, lockDurationMs);

      commitActiveSection(id);

      if (typeof document === 'undefined') return;
      const el = document.getElementById(id);
      if (!el) return;
      try {
        el.scrollIntoView({ behavior: 'smooth' });
      } catch {
        el.scrollIntoView();
      }
    },
    [clearNavigationTimeout, commitActiveSection, lockDurationMs],
  );

  useSectionObserver(handleSectionChange, { sections });

  useEffect(() => clearNavigationTimeout, [clearNavigationTimeout]);

  return { activeSection, scrollToSection };
};
