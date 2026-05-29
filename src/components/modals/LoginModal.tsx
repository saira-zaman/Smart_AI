import { ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type LoginInput = {
  name: string;
  email: string;
};

type LoginModalProps = {
  open: boolean;
  isLoading: boolean;
  loginInput: LoginInput;
  setLoginInput: (input: LoginInput) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function LoginModal({ open, isLoading, loginInput, setLoginInput, onClose, onSubmit }: LoginModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 border border-slate-200">
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
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand outline-none text-sm" placeholder="Enter your name" value={loginInput.name} onChange={(event) => setLoginInput({ ...loginInput, name: event.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand outline-none text-sm" placeholder="name@example.com" value={loginInput.email} onChange={(event) => setLoginInput({ ...loginInput, email: event.target.value })} />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-4 bg-brand text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-lg">
                {isLoading ? 'AUTHENTICATING...' : 'SIGN IN NOW'}
              </button>
            </form>

            <button type="button" onClick={onClose} className="w-full mt-4 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
