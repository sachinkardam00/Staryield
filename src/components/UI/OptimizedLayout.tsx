'use client';

import { memo, ReactNode } from 'react';

interface OptimizedLayoutProps {
  children: ReactNode;
  className?: string;
}

const OptimizedLayoutComponent = ({ children, className }: OptimizedLayoutProps) => {
  return <div className={className}>{children}</div>;
};

export const OptimizedLayout = memo(OptimizedLayoutComponent);
