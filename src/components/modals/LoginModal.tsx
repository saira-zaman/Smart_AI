import { FormEvent } from 'react';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type LoginInput = {
  name: string;
  email: string;
};

type LoginModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  loginInput: LoginInput;
  onChange: (loginInput: LoginInput) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
};

export function LoginModal({ isOpen, isLoading, loginInput, onChange, onClose, onSubmit }: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-200 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 border border-slate-200"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-brand w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Candidate_Portal</h3>
              <p className="text-sm text-slate-500 mt-2">Sign in to save your 60-day strategy.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand focus:bg-white outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                  placeholder="Enter your name"
                  value={loginInput.name}
                  onChange={(e) => onChange({ ...loginInput, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand focus:bg-white outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                  placeholder="name@example.com"
                  value={loginInput.email}
                  onChange={(e) => onChange({ ...loginInput, email: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-14 py-4 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:cursor-wait disabled:bg-indigo-400 transition-all shadow-[0_18px_34px_-18px_rgba(79,70,229,0.75)] uppercase tracking-widest text-xs"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>{isLoading ? "AUTHENTICATING..." : "SIGN IN NOW"}</span>
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-4 rounded-xl py-3 text-[11px] font-black text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest"
            >
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
