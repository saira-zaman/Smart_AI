import { LayoutDashboard, LogOut, Map, Radar, Settings, Video, Zap } from 'lucide-react';
import { NavItem } from '../ui/NavItem';
import type { AppStep, ToastState } from '../../types';

type SidebarProps = {
  step: AppStep;
  isLoading: boolean;
  isLoggedIn: boolean;
  userName: string;
  hasAnalysis: boolean;
  hasStrategy: boolean;
  setStep: (step: AppStep) => void;
  onStartInterview: () => void;
  onGenerateStrategy: () => void;
  onShowLogin: () => void;
  onLogout: () => void;
  showToast: (message: string, type?: ToastState['type']) => void;
};

export function Sidebar({
  step,
  isLoading,
  isLoggedIn,
  userName,
  hasAnalysis,
  hasStrategy,
  setStep,
  onStartInterview,
  onGenerateStrategy,
  onShowLogin,
  onLogout,
  showToast
}: SidebarProps) {
  return (
    <aside className="w-[260px] bg-slate-950 flex flex-col p-6 shrink-0 z-20">
      <button className="flex items-center gap-2 mb-10 px-2 text-slate-50 text-left" onClick={() => setStep('upload')} type="button">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <span className="font-extrabold text-lg tracking-tight uppercase">
          SmartHire AI<span className="text-brand">++</span>
        </span>
      </button>

      <nav className="flex-1 space-y-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" active={step === 'analysis'} onClick={() => setStep(hasAnalysis ? 'analysis' : 'upload')} />
        <NavItem icon={Radar} label="Skill Radar" active={step === 'radar'} onClick={() => (hasAnalysis ? setStep('radar') : showToast('Please upload and analyze a resume first.', 'error'))} />
        <NavItem icon={Video} label="Interview Sim" active={step === 'interview'} loading={isLoading && step === 'interview'} onClick={() => (hasAnalysis ? onStartInterview() : showToast('Please analyze a resume first.', 'error'))} />
        <NavItem
          icon={Map}
          label="Career Strategy"
          active={step === 'strategy'}
          loading={isLoading && step === 'strategy'}
          onClick={() => {
            if (hasStrategy) setStep('strategy');
            else if (hasAnalysis) {
              setStep('strategy');
              onGenerateStrategy();
            } else showToast('Please analyze a resume first.', 'error');
          }}
        />
        <NavItem icon={Settings} label="Settings" active={step === 'settings'} onClick={() => setStep('settings')} />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Logged In As</div>
        <div className="flex items-center justify-between">
          {isLoggedIn ? (
            <>
              <div className="text-sm font-semibold text-white">{userName}</div>
              <LogOut className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" onClick={onLogout} />
            </>
          ) : (
            <button type="button" onClick={onShowLogin} className="text-xs font-bold text-brand hover:text-brand/80 transition-colors uppercase tracking-tight">
              Sign In to Sync
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
