import React from 'react';
import { buttonSizes, buttonVariants } from '@/config/tokens';
import type { IconComponent } from '@/data/types';

interface LiquidButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
  icon?: IconComponent;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'flex items-center justify-center font-bold rounded-2xl transition-all active:scale-95 shadow-sm relative overflow-hidden group';

  const buttonClass = [
    baseStyles,
    buttonVariants[variant] || buttonVariants.glass,
    buttonSizes[size] || buttonSizes.md,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].join(' ');

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buttonClass} {...props}>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      )}
      {Icon && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} className={children ? 'mr-2.5' : ''} />
      )}
      {children}
    </button>
  );
};
