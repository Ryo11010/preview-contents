import React, { useEffect, useRef, useState } from 'react';
import { sheetMetrics } from '@/config/tokens';

interface LiquidSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  headerRight?: React.ReactNode;
}

export const LiquidSheet: React.FC<LiquidSheetProps> = ({ isOpen, onClose, children, title, headerRight }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return;
    }
    const id = setTimeout(() => setIsRendered(false), 300);
    return () => clearTimeout(id);
  }, [isOpen]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const diff = event.touches[0].clientY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > sheetMetrics.dragCloseThreshold) {
      onClose();
    }
    setDragY(0);
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div
        className={`absolute inset-0 ${sheetMetrics.overlayOpacityClass} ${sheetMetrics.overlayBlurClass} transition-opacity duration-500 pointer-events-auto ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`
          pointer-events-auto
          relative w-full max-w-2xl ${sheetMetrics.containerHeightClass} 
          bg-white/80 backdrop-blur-3xl 
          shadow-[0_-20px_60px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]
          rounded-t-[40px] border-t border-white/60
          flex flex-col 
          transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1)
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          transform: isOpen ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragY > 0 ? 'none' : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {(title || headerRight) && (
          <div className="flex items-center justify-between px-8 pb-6 pt-2 shrink-0">
            <div className="text-2xl font-black text-slate-800 tracking-tight">{title}</div>
            {headerRight}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain bg-transparent px-6 pb-12">{children}</div>
      </div>
    </div>
  );
};
