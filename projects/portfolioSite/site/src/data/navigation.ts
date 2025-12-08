import { Folder, History, Sparkles, User } from 'lucide-react';
import { SECTION_IDS } from './types';
import type { DockTab } from './types';

export const dockTabs: DockTab[] = [
  { id: SECTION_IDS[0], icon: Sparkles },
  { id: SECTION_IDS[1], icon: Folder },
  { id: SECTION_IDS[2], icon: History },
  { id: SECTION_IDS[3], icon: User },
];
