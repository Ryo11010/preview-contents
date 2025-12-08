import { Coffee, Camera, Music, Sparkles } from 'lucide-react';
import type { Profile } from './types';

export const profile: Profile = {
  name: 'FunDriven',
  role: 'iOS Engineer',
  catchphrase: 'Crafting Joy.',
  description:
    'コードは「書く」ものではなく「奏でる」もの。触れた瞬間にユーザーの心が動く、そんなiOSアプリケーションを作り続けています。',
  email: 'hello@fundriven.dev',
  socials: { github: 'https://github.com', twitter: 'https://twitter.com' },
  skills: ['Swift', 'SwiftUI', 'UIKit', 'React', 'Next.js', 'TypeScript', 'Core ML', 'ARKit'],
  interests: [
    { label: 'Coffee', icon: Coffee, color: 'text-amber-700 bg-amber-50' },
    { label: 'Photo', icon: Camera, color: 'text-blue-700 bg-blue-50' },
    { label: 'Music', icon: Music, color: 'text-pink-700 bg-pink-50' },
    { label: 'Sauna', icon: Sparkles, color: 'text-cyan-700 bg-cyan-50' },
  ],
};
