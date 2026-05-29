import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

type ToastState = {
  message: string;
  type?: 'info' | 'error';
} | null;

export function Toast({ toast }: { toast: ToastState }) {
  return (
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
  );
}
