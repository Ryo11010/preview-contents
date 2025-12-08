import React, { useState } from 'react';
import type { DockTab, SectionId } from '@/data/types';
import { uiMetrics } from '@/config/tokens';

interface LiquidDockProps {
  tabs: DockTab[];
  activeId: SectionId;
  onChange: (id: SectionId) => void;
}

export const LiquidDock: React.FC<LiquidDockProps> = ({ tabs, activeId, onChange }) => {
  const [isPressing, setIsPressing] = useState(false);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const hasActive = activeIndex !== -1;

  const { paddingX, gap, buttonSize } = uiMetrics.dock;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto relative flex items-center gap-6 p-2 rounded-full bg-white/40 backdrop-blur-3xl shadow-[0_20px_40px_-12px_rgba(50,50,93,0.25),0_12px_24px_-16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] border border-white/40 ring-1 ring-white/20 transition-all duration-500 hover:bg-white/50 hover:scale-[1.02]">
        {hasActive && (
          <div
            className="absolute rounded-full bg-gradient-to-b from-white to-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"
            style={{
              left: `${paddingX + activeIndex * (buttonSize + gap)}px`,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              top: '50%',
              transform: `translateY(-50%) scale(${isPressing ? 0.9 : 1})`,
            }}
          />
        )}

        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onPointerDown={() => {
                onChange(tab.id);
                setIsPressing(true);
              }}
              onPointerUp={() => setIsPressing(false)}
              onPointerLeave={() => setIsPressing(false)}
              onTouchEnd={() => setIsPressing(false)}
              className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300 group"
            >
              <div
                className={`transition-all duration-500 ease-out ${
                  isActive
                    ? isPressing
                      ? 'scale-90'
                      : 'scale-100 -translate-y-0.5'
                    : 'scale-90 opacity-60 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-0.5'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-indigo-600 drop-shadow-sm' : 'text-slate-600'}`}
                />
              </div>
              <div
                className={`absolute bottom-2 w-1 h-1 rounded-full bg-indigo-600 transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 translate-y-1'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
