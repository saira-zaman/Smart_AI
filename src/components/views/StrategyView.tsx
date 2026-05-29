import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

type StrategyViewProps = {
  strategy: any;
  isLoading: boolean;
  onBack: () => void;
  onStartInterview: () => void;
};

export function StrategyView({ strategy, isLoading, onBack, onStartInterview }: StrategyViewProps) {
  if (!strategy && isLoading) {
    return (
      <motion.div key="strategy-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full space-y-4 py-24">
        <Loader2 className="w-12 h-12 animate-spin text-brand" />
        <h3 className="text-xl font-bold text-slate-800">Generating Your 60-Day War Room Strategy...</h3>
        <p className="text-slate-500 text-sm italic">Analyzing gaps and mapping market opportunities.</p>
      </motion.div>
    );
  }

  if (!strategy) return null;

  return (
    <motion.div key="strategy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic whitespace-nowrap">CAREER_WAR_ROOM/60_DAY_STRATEGY</h2>
        <button type="button" onClick={onBack} className="text-brand font-bold text-sm flex items-center gap-1 group">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          {(strategy.plan || []).map((item: any, index: number) => (
            <div key={`${item.day}-${index}`} className="flex gap-6 group">
              <div className="flex flex-col items-center">
                <div className={cn('w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center font-bold text-xs ring-4 ring-slate-100', item.priority === 'High' ? 'bg-red-500 text-white' : 'bg-brand text-white')}>
                  {item.day}
                </div>
                <div className="flex-1 w-0.5 bg-slate-200 mt-2 mb-2 group-last:hidden" />
              </div>
              <div className="flex-1 pb-10">
                <Card className="hover:border-brand transition-all">
                  <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded', item.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600')}>
                    {item.priority} PRIORITY
                  </span>
                  <h4 className="text-lg font-bold text-slate-800 leading-snug mt-3">{item.task}</h4>
                </Card>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <button type="button" onClick={onStartInterview} className="w-full py-3 bg-brand text-white rounded-xl text-[13px] font-bold hover:shadow-lg transition-all">
                Practice Interviews
              </button>
              <button type="button" className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-all">
                Daily Skill Tracker
              </button>
            </div>
          </Card>
          <div className="p-6 bg-slate-900 rounded-3xl text-white">
            <Sparkles className="w-8 h-8 text-yellow-400 mb-4" />
            <h4 className="font-bold text-lg mb-2 leading-tight">Selection Boost Mode Active</h4>
            <p className="text-slate-400 text-xs">Practice interviews and resume fixes compound your selection score.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
