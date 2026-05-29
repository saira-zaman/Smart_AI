import { ArrowRight, CheckCircle2, Rocket, ShieldCheck, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type ApplicationModalProps = {
  isApplying: boolean;
  hasApplied: boolean;
  setIsApplying: (value: boolean) => void;
  setHasApplied: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  onViewStrategy: () => void;
};

export function ApplicationModal({ isApplying, hasApplied, setIsApplying, setHasApplied, setIsLoading, onViewStrategy }: ApplicationModalProps) {
  return (
    <AnimatePresence>
      {isApplying && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            {!hasApplied ? (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                    <Rocket className="text-brand w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Confirm Application</h3>
                    <p className="text-xs text-slate-500">Target: High Probability Selection</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-semibold">AI-optimized resume attached</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-semibold">Tailored cover letter generated</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Target className="text-brand w-5 h-5" />
                    <span className="text-sm font-semibold font-mono">ATS Compatibility: 100%</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsApplying(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      window.setTimeout(() => {
                        setIsLoading(false);
                        setHasApplied(true);
                      }, 2000);
                    }}
                    className="flex-1 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand/90 transition-all shadow-lg"
                  >
                    Send Smart Application
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                  <ShieldCheck className="text-green-600 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">APPLICATION SENT!</h3>
                <p className="text-slate-500 mb-8 max-w-[280px] mx-auto text-sm">Your profile has been prepared for the recruiter's shortlisting workflow.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsApplying(false);
                    setHasApplied(false);
                    onViewStrategy();
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  View Next Strategic Steps <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
