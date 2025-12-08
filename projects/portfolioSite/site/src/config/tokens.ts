export const textures = {
  noise:
    "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E",
  stardust:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N8fHxqeHgAAAB/f393d3eAgICGhQV0dHRlZWWCgoSHh4dxcXFsbGxoaGhzdXVubm5iYmJmZmZxcXFwcHBra2tFRUUwMDAkJCRWVlQW8qjlAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmBwYQKCMy24+FAAAApElEQVRIx2NgGAWjYBSMglEwCkgCRiomMNDQyKgIqY6ODqS6u7uTqG8UjIJRMApGwSgYBSMAAxMTM7OQkBBEXmZmFpG6R8EoGAWjYBSMglEwCoYnwMnJycnMzAwmHR0dEXl5eXlE6hsFo2AUjIJRMApGwXABFiYmZmbm5uYg0tLS0hKRuqE4mJmZhYWFhY2NjaG6R8EoGAWjYBSMglEwCkYBSQAAYy8D/b+65MwAAAAASUVORK5CYII=',
};

export const backgroundTokens = {
  baseColorClass: 'bg-[#F0F2F5]',
  gradientClass: 'bg-gradient-to-tr from-[#Eef2f3] via-[#E2E2E2] to-[#C9D6FF]',
  blobs: [
    {
      className:
        'absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-300/30 blur-[120px]',
      durationSec: 15,
    },
    {
      className:
        'absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-l from-purple-300/30 to-pink-300/30 blur-[120px]',
      durationSec: 18,
    },
    {
      className:
        'absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-yellow-200/20 blur-[100px]',
      durationSec: 20,
    },
  ],
  noiseOpacityClass: 'opacity-[0.04]',
};

export const liquidTheme = {
  glass: {
    base: 'bg-white/40 backdrop-blur-3xl supports-[backdrop-filter]:bg-white/40',
    border: 'border border-white/50 ring-1 ring-white/20',
    shadow: 'shadow-[0_8px_32px_rgba(31,38,135,0.07),inset_0_1px_0_rgba(255,255,255,0.6)]',
    active: 'active:scale-[0.98] transition-all duration-300 ease-out',
    hover:
      'hover:bg-white/50 hover:shadow-[0_8px_40px_rgba(31,38,135,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-white/80',
  },
};

export const buttonVariants = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 border border-transparent',
  danger: 'bg-white/60 text-red-500 hover:bg-red-50 border border-red-100',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/40 shadow-none',
  glass:
    'bg-white/30 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white/50 hover:border-white/80 shadow-sm',
} as const;

export const buttonSizes = {
  sm: 'py-2 px-3 text-xs',
  md: 'py-3.5 px-6 text-sm',
  lg: 'py-4 px-8 text-base',
  icon: 'p-3 rounded-2xl',
} as const;

export const uiMetrics = {
  sectionObserverThreshold: 0.3,
  breakpoints: {
    mobile: 768,
  },
  dock: {
    paddingX: 8,
    gap: 24,
    buttonSize: 48,
  },
  mediaGalleryGap: 16,
};

export const plateStyle = {
  surfaceHeight: 120,
  borderRadiusPx: 20,
  perspective: 1000,
};

export const folderMotion = {
  openYOffset: -160,
  baseSpread: 120,
  spreadIncrement: 15,
  maxSpread: 240,
  maxRotateBase: 10,
  maxRotateIncrement: 1.5,
  maxRotateCap: 25,
  archIntensity: 8,
  hoverTranslateX: -20,
  hoverTranslateRange: 40,
  hoverRotateStart: -5,
  hoverRotateRange: 10,
  hoverTranslateY: -60,
  alignShiftBase: 40,
  alignShiftScale: 15,
  alignShiftMax: 160,
  alignRotateAdjust: 5,
  edgeAnchorOffset: 60,
  scrubStepPx: 12,
  scrubThrottleMs: 16,
  focusLift: 16,
  focusScale: 1.05,
  inactiveScale: 0.92,
  inactiveOpacity: 0.6,
  openZBase: 40,
  closedZBase: 10,
  activeZBoost: 20,
  openTiltDegrees: -20,
  closedTranslateZ: 20,
};

export const folderStyle = {
  plateColor: '#75BCE6',
  plateShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
  coverShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
  plateNoiseClass: 'opacity-30 mix-blend-overlay',
};

export const sheetMetrics = {
  dragCloseThreshold: 100,
  containerHeightClass: 'h-[92vh]',
  overlayOpacityClass: 'bg-slate-900/20',
  overlayBlurClass: 'backdrop-blur-[4px]',
};
