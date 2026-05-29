import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import type { ToastState } from '../../types';

type AppMainProps = {
  children: ReactNode;
  error: string;
  toast: ToastState | null;
  isLoggedIn: boolean;
  onClearError: () => void;
  onShowLogin: () => void;
};

export function AppMain({ children, error, toast, isLoggedIn, onClearError, onShowLogin }: AppMainProps) {
  return (
    <main className="flex-1 overflow-y-auto relative h-full hide-scrollbar">
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b-2 border-red-400 p-4">
          <div className="flex items-start gap-4 max-w-7xl mx-auto">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">Error</h3>
              <p className="text-red-800 text-sm mt-1">{error}</p>
            </div>
            <button type="button" onClick={onClearError} className="text-red-500 hover:text-red-700 font-bold">
              X
            </button>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="absolute top-6 right-8 z-30">
          <button type="button" onClick={onShowLogin} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-black transition-all shadow-lg">
            Sign In
          </button>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'fixed left-1/2 -translate-x-1/2 top-6 z-50 px-4 py-2 rounded-full text-sm font-bold shadow-lg',
              toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
            )}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ marginTop: error ? '80px' : '0' }}>
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </main>
  );
}
