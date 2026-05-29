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
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5", className)}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.24em]">{title}</h3>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
