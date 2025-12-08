import React from 'react';
import { liquidTheme } from '@/config/tokens';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
  transparent?: boolean;
  glassEffect?: boolean;
  style?: React.CSSProperties;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({
  children,
  className = '',
  onClick,
  padding = 'p-6',
  transparent = false,
  glassEffect = true,
  style,
}) => (
  <div
    onClick={onClick}
    style={style}
    className={`
        relative
        ${
          transparent
            ? 'bg-white/10 border border-white/10'
            : glassEffect
            ? `${liquidTheme.glass.base} ${liquidTheme.glass.border} ${liquidTheme.glass.shadow}`
            : 'bg-white border border-slate-100 shadow-sm'
        }
        rounded-[36px] overflow-hidden
        ${onClick ? `${liquidTheme.glass.active} ${liquidTheme.glass.hover} cursor-pointer` : ''}
        ${padding}
        ${className}
      `}
  >
    {!transparent && glassEffect && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none" />
    )}
    <div className="relative z-10 h-full w-full">{children}</div>
  </div>
);
