import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

export function NavItem({ icon: Icon, label, active = false, loading = false, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={!loading ? onClick : undefined}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left',
        active ? 'bg-slate-700 text-slate-50' : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800',
        loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-brand" /> : <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}
