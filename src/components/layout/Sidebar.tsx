import { LayoutDashboard, LogIn, LogOut, Map, Radar, Settings, Video, X, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AppStep } from '../../types';
import { NavItem } from '../navigation/NavItem';

type SidebarProps = {
  step: AppStep;
  analysis: any;
  strategy: any;
  isLoading: boolean;
  isLoggedIn: boolean;
  isMobileMenuOpen: boolean;
  userName: string;
  onCloseMobileMenu: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSetStep: (step: AppStep) => void;
  onStartInterview: () => void;
  onGenerateStrategy: () => void;
  onShowToast: (message: string, type?: 'info' | 'error') => void;
};

export function Sidebar({
  step,
  analysis,
  strategy,
  isLoading,
  isLoggedIn,
  isMobileMenuOpen,
  userName,
  onCloseMobileMenu,
  onOpenLogin,
  onLogout,
  onSetStep,
  onStartInterview,
  onGenerateStrategy,
  onShowToast,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[280px] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 shrink-0 z-50 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:m-4 md:rounded-[28px] md:shadow-2xl md:shadow-slate-950/25 md:border md:border-white/10",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <button
        className="md:hidden absolute top-6 right-6 text-slate-400 hover:text-white"
        onClick={onCloseMobileMenu}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-10 px-2 text-slate-50 cursor-pointer" onClick={() => { onSetStep('upload'); onCloseMobileMenu(); }}>
        <div className="w-9 h-9 bg-linear-to-br from-brand to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <span className="font-extrabold text-lg tracking-tight uppercase">SmartHire AI<span className="text-brand">++</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" active={step === 'analysis'} onClick={() => analysis ? onSetStep('analysis') : onSetStep('upload')} />
        <NavItem icon={Radar} label="Skill Radar" active={step === 'radar'} onClick={() => analysis ? onSetStep('radar') : onShowToast("Please upload and analyze a resume first.", 'error')} />
        <NavItem
          icon={Video}
          label="Interview Sim"
          active={step === 'interview'}
          loading={isLoading && step === 'interview'}
          onClick={() => analysis ? onStartInterview() : onShowToast("Please analyze a resume first.", 'error')}
        />
        <NavItem
          icon={Map}
          label="Career Strategy"
          active={step === 'strategy'}
          loading={isLoading && step === 'strategy'}
          onClick={() => {
            if (strategy) onSetStep('strategy');
            else if (analysis) {
              onSetStep('strategy');
              onGenerateStrategy();
            } else {
              onShowToast("Please analyze a resume first.", 'error');
            }
          }}
        />
        <NavItem icon={Settings} label="Settings" active={step === 'settings'} onClick={() => onSetStep('settings')} />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Logged In As</div>
        <div className="flex items-center justify-between">
          {isLoggedIn ? (
            <>
              <div className="text-sm font-semibold text-white">{userName}</div>
              <LogOut className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" onClick={onLogout} />
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] font-black text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-widest"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-300" />
              Sign In to Sync
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
