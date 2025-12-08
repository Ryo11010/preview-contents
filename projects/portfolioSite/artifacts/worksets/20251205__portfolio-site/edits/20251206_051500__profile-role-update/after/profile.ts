import { Brain, GraduationCap, Palette, ShieldCheck } from 'lucide-react';
import type { Profile } from './types';

export const profile: Profile = {
  name: '鶴谷 陵',
  role: {
    line1: '合同会社FunterU代表 / 株式会社Clam Ocean エンジニア兼役員',
    line2: 'Full-stack Engineer'
  },
  catchphrase: 'Joy through code.',
  description:
    '学生起業家として合同会社FunterUを設立。AI OCR・プライバシー重視の解析・LLMユーティリティ・ゲーム計算アプリまで、モバイルとクラウドを横断した体験づくりに取り組んでいます。',
  email: 'contact@funteru.co.jp',
  socials: { github: 'https://github.com/Tsurutani-Ryo', twitter: 'https://twitter.com/Tsurutani-Ryo' },
  skills: [
    'SwiftUI',
    'FastAPI',
    'Gemini API',
    'Electron',
    'OpenCV',
    'TensorFlow.js',
    'TypeScript',
    'AWS',
    'Figma',
    'Design Systems',
  ],
  interests: [
    { label: 'AI OCR', icon: Brain, color: 'text-amber-700 bg-amber-50' },
    { label: 'Privacy-first', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'UX Design', icon: Palette, color: 'text-indigo-700 bg-indigo-50' },
    { label: 'EdTech', icon: GraduationCap, color: 'text-blue-700 bg-blue-50' },
  ],
};
