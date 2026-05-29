import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type NavItemProps = {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  loading?: boolean;
};

export function NavItem({ icon: Icon, label, active = false, onClick, loading = false }: NavItemProps) {
  return (
    <div
      onClick={!loading ? onClick : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 border",
        active ? "bg-white/10 text-white border-white/10 shadow-lg shadow-black/10" : "text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10",
        loading ? "opacity-50 cursor-wait" : "cursor-pointer"
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-brand" /> : <Icon className="w-4 h-4" />}
      {label}
    </div>
  );
}
