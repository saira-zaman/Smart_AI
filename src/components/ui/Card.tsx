import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type CardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  headerAction?: ReactNode;
};

export function Card({ children, title, className, headerAction }: CardProps) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-2xl p-6 shadow-sm', className)}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
