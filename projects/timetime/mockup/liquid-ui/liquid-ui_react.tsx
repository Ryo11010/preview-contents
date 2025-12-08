// src/ui/liquid-ui.tsx
import React, { useState, useRef, useEffect } from 'react';

/**
 * Liquid UI Design System
 * - iOS / glassmorphism っぽい見た目とモーションだけをまとめた共通ライブラリ
 * - ビジネスロジックやアプリ固有の状態は一切持たない
 * - Tailwind CSS 前提のスタイル（backdrop-blur など）を使用
 */

export const LiquidTheme = {
  glass: {
    base: 'bg-white/60 backdrop-blur-2xl',
    border: 'border border-white/40',
    shadow:
      'shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.5)]',
    active: 'active:scale-[0.98] transition-transform duration-200',
  },
};

/**
 * LiquidContainer
 * 画面全体にグラデーション＋ノイズ背景＋オーラを敷くコンテナ。
 * アプリ全体を包む「iOS風の土台」として使う。
 */
export const LiquidContainer = ({
  children,
  className = '',
  backgroundClassName = '',
  showNoise = true,
}: {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  showNoise?: boolean;
}) => {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden font-sans text-gray-900 bg-[#E0E5EC] ${className}`}
    >
      <div
        className={`fixed inset-0 z-0 pointer-events-none ${backgroundClassName}`}
      >
        {/* base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3]" />
        {/* soft blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/20 blur-[100px]" />
        {/* subtle noise */}
        {showNoise && (
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/**
 * LiquidCard
 * ガラス風のカード。onClick を渡すとタップ時に iOS 風に僅かに縮む。
 */
export const LiquidCard = ({
  children,
  className = '',
  onClick,
  padding = 'p-4',
  transparent = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
  transparent?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${
          transparent
            ? 'bg-white/30 border border-white/20'
            : `${LiquidTheme.glass.base} ${LiquidTheme.glass.border} ${LiquidTheme.glass.shadow}`
        }
        rounded-[32px] overflow-hidden
        ${
          onClick
            ? LiquidTheme.glass.active + ' cursor-pointer hover:bg-white/80'
            : ''
        }
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * LiquidButton
 * iOS のボタンっぽい、ガラス感のあるボタン。
 * variant/size/icon で見た目を切り替え可能。
 */
export const LiquidButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
  ...props
}: {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'danger' | 'ghost' | 'glass' | 'segment';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  type?: 'button' | 'submit';
  [key: string]: any;
}) => {
  const baseStyles =
    'flex items-center justify-center font-bold rounded-2xl transition-all active:scale-95 shadow-sm relative overflow-hidden';

  const variants: Record<string, string> = {
    primary: 'bg-[#007AFF] text-white hover:bg-[#0062cc] shadow-blue-500/30',
    danger: 'bg-white/60 text-red-500 hover:bg-red-50 border border-white/60',
    ghost: 'bg-transparent text-gray-600 hover:bg-white/30 shadow-none',
    glass: 'bg-white/40 border border-white/50 text-gray-700 hover:bg-white/60',
    segment:
      'bg-white text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
  };

  const sizes: Record<string, string> = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-6 text-base',
    icon: 'p-2 rounded-xl',
  };

  const buttonClass = [
    baseStyles,
    variants[variant] || variants.glass,
    sizes[size] || sizes.md,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      {...props}
    >
      {Icon && (
        <Icon
          size={size === 'sm' ? 14 : 18}
          className={children ? 'mr-2' : ''}
        />
      )}
      {children}
      {disabled && <div className="absolute inset-0 bg-white/20" />}
    </button>
  );
};

/**
 * LiquidSwitch
 * iOS のトグルスイッチ風。
 */
export const LiquidSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onClick={() => onChange(!checked)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(!checked);
      }
    }}
    className={`w-11 h-7 rounded-full p-0.5 transition-all duration-300 cursor-pointer shadow-inner ${
      checked ? 'bg-[#34C759]' : 'bg-gray-300'
    }`}
  >
    <div
      className={`w-6 h-6 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </div>
);

/**
 * LiquidSegmentControl
 * iOS のセグメントコントロール風タブ。
 * options: [{ label, value }]
 */
export const LiquidSegmentControl = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const activeIndex = options.findIndex((o) => o.value === value);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="relative flex p-1 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.02)] mb-4 overflow-hidden">
      <div
        className="absolute top-1 bottom-1 rounded-xl bg-white/80 backdrop-filter backdrop-blur-md border border-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${safeIndex * 100}%)`,
          left: '4px',
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors duration-300 relative z-10 ${
            value === option.value
              ? 'text-[#007AFF] drop-shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

/**
 * LiquidInput
 * アイコン付きのガラス風テキスト入力。
 * icon: Lucide など任意のアイコンコンポーネント。
 */
export const LiquidInput = ({
  icon: Icon,
  className = '',
  ...props
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  [key: string]: any;
}) => (
  <div className="relative group w-full">
    {Icon && (
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon
          size={16}
          className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
        />
      </div>
    )}
    <input
      {...props}
      className={`
        w-full bg-white/50 border border-white/60 rounded-xl 
        ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 
        text-sm font-bold text-gray-700 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/80 
        transition-all
        ${className}
      `}
    />
  </div>
);

/**
 * LiquidSelect
 * アイコン付きのセレクトボックス。
 */
export const LiquidSelect = ({
  icon: Icon,
  options,
  className = '',
  ...props
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  options: { label: string; value: string }[];
  className?: string;
  [key: string]: any;
}) => (
  <div className="relative w-full">
    <select
      {...props}
      className={`
        w-full appearance-none bg-white/50 border border-white/60 rounded-xl 
        ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 
        text-sm font-bold text-gray-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/80
        transition-all
        ${className}
      `}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    {Icon && (
      <Icon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    )}
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      ▾
    </span>
  </div>
);

/**
 * LiquidSheet
 * iOS 的なボトムシート。ドラッグで閉じるアニメーション付き。
 */
export const LiquidSheet = ({
  isOpen,
  onClose,
  children,
  title,
  headerRight,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  headerRight?: React.ReactNode;
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const id = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) setDragY(diff);
  };

  const handleTouchEnd = () => {
    if (dragY > 100) onClose();
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`
          relative w-full max-w-lg h-[92vh] 
          bg-white/85 backdrop-blur-3xl 
          shadow-[0_-10px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.8)]
          rounded-t-[32px] border-t border-white/60
          flex flex-col 
          transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{
          transform: isOpen
            ? `translateY(${dragY}px)`
            : 'translateY(100%)',
          transition: dragY > 0 ? 'none' : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-10 h-1.5 bg-gray-300/80 rounded-full" />
        </div>

        {(title || headerRight) && (
          <div className="flex items-center justify-between px-6 pb-4 pt-1 border-b border-gray-200/30 shrink-0">
            <div className="text-lg font-bold text-gray-800">{title}</div>
            {headerRight}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * DeleteConfirmationModal
 * 削除確認などで使う小さめのモーダル。
 */
export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
  icon,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xs bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-center border border-white/50 scale-100 animate-[popIn_0.2s_ease-out]">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
          {icon ?? <span className="text-xl font-bold">!</span>}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <LiquidButton onClick={onConfirm} variant="danger">
            {confirmLabel}
          </LiquidButton>
          <LiquidButton onClick={onClose} variant="ghost">
            {cancelLabel}
          </LiquidButton>
        </div>
      </div>
    </div>
  );
};

/**
 * LiquidDock
 * 画面下部の iOS 風フローティング Dock。
 * tabs: { id, icon, label? } の配列、activeId / onChange で制御。
 */
export const LiquidDock = ({
  tabs,
  activeId,
  onChange,
}: {
  tabs: { id: string; icon: React.ReactNode; label?: string }[];
  activeId: string;
  onChange: (id: string) => void;
}) => {
  const [isPressing, setIsPressing] = useState(false);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const hasActive = activeIndex !== -1;

  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto relative flex items-center gap-3 p-2.5 rounded-[48px] bg-white/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.5)_inset,0_-1px_0_rgba(0,0,0,0.05)_inset,0_0_0_1px_rgba(255,255,255,0.2)] bg-gradient-to-b from-white/40 to-white/10">
        {hasActive && (
          <div
            className="absolute top-2.5 bottom-2.5 w-[64px] rounded-[36px] bg-white/90 backdrop-filter backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.1),0_0_15px_rgba(255,255,255,0.8),inset_0_2px_0_rgba(255,255,255,1),inset_0_-2px_5px_rgba(0,0,0,0.05)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
            style={{
              left: '10px',
              transform: `translateX(${
                activeIndex * (64 + 12)
              }px) scale(${isPressing ? 1.25 : 1.0})`,
            }}
          >
            <div className="absolute top-1 left-3 right-3 h-0.5 bg-white rounded-full opacity-60" />
          </div>
        )}

        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
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
              className={`relative z-10 w-[64px] h-[56px] flex items-center justify-center rounded-[32px] transition-colors duration-300 ${
                isActive
                  ? 'text-[#007AFF]'
                  : 'text-gray-400/80 hover:text-gray-600'
              }`}
              style={{ mixBlendMode: isActive ? 'normal' : 'multiply' }}
            >
              <div
                className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isActive
                    ? isPressing
                      ? 'scale-110 drop-shadow-md'
                      : 'scale-100 drop-shadow-sm'
                    : 'scale-90'
                }`}
              >
                {tab.icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
