import React from 'react';
import type { SegmentOption } from '@/data/types';

interface LiquidSegmentControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const LiquidSegmentControl = <T extends string>({ options, value, onChange }: LiquidSegmentControlProps<T>) => {
  const activeIndex = options.findIndex((option) => option.value === value);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="relative flex p-1.5 bg-slate-100/50 backdrop-blur-xl rounded-[20px] border border-white/50 shadow-inner mb-6 overflow-hidden">
      <div
        className="absolute top-1.5 bottom-1.5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/50 transition-all duration-300 ease-spring"
        style={{
          width: `calc((100% - 12px) / ${options.length})`,
          transform: `translateX(${safeIndex * 100}%)`,
          left: '6px',
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-colors duration-300 relative z-10 ${
            value === option.value ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
