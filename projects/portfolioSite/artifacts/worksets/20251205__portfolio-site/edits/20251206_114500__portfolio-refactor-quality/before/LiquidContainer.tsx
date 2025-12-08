import React from 'react';
import { textures } from '@/config/tokens';

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
  <div className={`relative min-h-screen w-full overflow-hidden font-sans text-slate-900 bg-[#F0F2F5] ${className}`}>
    <div className={`fixed inset-0 z-0 pointer-events-none ${backgroundClassName}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#Eef2f3] via-[#E2E2E2] to-[#C9D6FF]" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-300/30 blur-[120px] animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-l from-purple-300/30 to-pink-300/30 blur-[120px] animate-pulse"
        style={{ animationDuration: '18s' }}
      />
      <div
        className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-yellow-200/20 blur-[100px] animate-pulse"
        style={{ animationDuration: '20s' }}
      />
      {showNoise && (
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("${textures.noise}")` }} />
      )}
    </div>
    <div className="relative z-10 h-full">{children}</div>
  </div>
);
