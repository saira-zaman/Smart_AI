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
    <div className={cn("rounded-[28px] border border-white/70 bg-white/85 backdrop-blur-xl p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/50", className)}>
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
