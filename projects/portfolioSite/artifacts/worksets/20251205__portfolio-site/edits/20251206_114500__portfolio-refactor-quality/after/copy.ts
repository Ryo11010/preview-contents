export const heroCopy = {
  status: 'Ryo Tsurutani',
  leadPrefix: "I'm Ryo Tsurutani — I build",
  leadHighlight: 'joyful products',
  leadSuffix: ' that connect people.',
};

export const heroActionsCopy = {
  browseProjects: 'Browse Projects',
  contactMe: 'Contact Me',
};

export const sectionCopy = {
  work: {
    title: 'Work Archives',
    helper: 'Tap a folder to explore each project. Select a card to view the details.',
  },
  timeline: {
    title: 'Journey',
  },
  about: {
    title: 'Hello, World!',
  },
};

export const aboutCopy = {
  note: {
    prefix: 'ネイティブアプリの',
    emphasisA: '「滑らかさ」',
    bridge: 'と、Webの',
    emphasisB: '「柔軟性」',
    suffix: 'を組み合わせ、境界のないデジタル体験を作ることに情熱を注いでいます。',
  },
};

export const aboutTabs = [
  { label: 'Technical Skills', value: 'skills' as const },
  { label: 'Personal Interests', value: 'interests' as const },
];

export type AboutTabValue = (typeof aboutTabs)[number]['value'];

export const folderCopy = {
  getProjectCountLabel: (count: number) => `${count} Projects`,
  openLabel: 'Select a project',
};

export const projectSheetCopy = {
  promoBadge: 'Promo Video',
  galleryLabel: 'Gallery',
  headings: {
    features: 'Key Features',
    tech: 'Technical Deep Dive',
  },
  labels: {
    year: 'Year',
    role: 'Role',
  },
  ctas: {
    appStore: 'View on App Store',
    website: 'Website',
    sourceCode: 'Source Code',
  },
};

export const shareCopy = {
  successTitle: 'Check this out',
  fallback: 'Shared!',
};
