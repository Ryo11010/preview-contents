import React from 'react';
import { SectionHeader } from '../SectionHeader';
import type { IconComponent } from '@/data/types';

type SectionShellProps = {
  id: string;
  title?: string;
  align?: 'left' | 'center';
  widthClassName?: string;
  className?: string;
  headerIcon?: IconComponent;
  children: React.ReactNode;
};

export const SectionShell: React.FC<SectionShellProps> = ({
  id,
  title,
  align = 'left',
  widthClassName = 'max-w-7xl',
  className = '',
  headerIcon,
  children,
}) => (
  <div id={id} className={`${widthClassName} mx-auto px-6 py-24 ${className}`}>
    {title ? <SectionHeader title={title} align={align} icon={headerIcon} /> : null}
    {children}
  </div>
);
