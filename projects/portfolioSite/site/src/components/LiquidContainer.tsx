import React from 'react';
import { backgroundTokens, textures } from '@/config/tokens';

interface LiquidContainerProps {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  showNoise?: boolean;
}

export const LiquidContainer: React.FC<LiquidContainerProps> = ({
  children,
  className = '',
  backgroundClassName = '',
  showNoise = true,
}) => (
  <div
    className={`relative min-h-screen w-full overflow-hidden font-sans text-slate-900 ${backgroundTokens.baseColorClass} ${className}`}
  >
    <div className={`fixed inset-0 z-0 pointer-events-none ${backgroundClassName}`}>
      <div className={`absolute inset-0 ${backgroundTokens.gradientClass}`} />
      {backgroundTokens.blobs.map((blob, index) => (
        <div
          key={index}
          className={`${blob.className} animate-pulse`}
          style={{ animationDuration: `${blob.durationSec}s` }}
        />
      ))}
      {showNoise && (
        <div
          className={`absolute inset-0 ${backgroundTokens.noiseOpacityClass} mix-blend-overlay`}
          style={{ backgroundImage: `url("${textures.noise}")` }}
        />
      )}
    </div>
    <div className="relative z-10 h-full">{children}</div>
  </div>
);
