import { ArrowRight, CheckCircle2, Clock, FileText, Rocket, Target, TrendingUp, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

type AnalysisViewProps = {
  analysis: any;
  improvement: any;
  isLoading: boolean;
  onFixResume: () => void;
  onApply: () => void;
  onStartInterview: () => void;
  onGenerateStrategy: () => void;
  onShowRadar: () => void;
};

export function AnalysisView({ analysis, improvement, isLoading, onFixResume, onApply, onStartInterview, onGenerateStrategy, onShowRadar }: AnalysisViewProps) {
  return (
    <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Main Dashboard</h2>
        <div className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-full">ACTIVE SESSION</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Selection Probability">
          <div className={cn('text-5xl font-black mb-2 transition-colors', analysis.selectionProbability < 40 ? 'text-red-500' : analysis.selectionProbability < 70 ? 'text-amber-500' : 'text-green-500')}>
            {analysis.selectionProbability}%
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.selectionProbability}%` }} className={cn('h-full transition-all duration-1000', analysis.selectionProbability < 40 ? 'bg-red-500' : 'bg-brand')} />
          </div>
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium">{analysis.summary || 'AI-calculated fit based on the current resume and job description.'}</p>
        </Card>

        <Card title="Current Skill Radar">
          <div className="flex flex-wrap gap-2 mb-4 min-h-[100px]">
            {(analysis.skills || []).map((item: any, index: number) => (
              <span key={`${item.name}-${index}`} className={cn('px-3 py-1.5 border text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-2 shadow-sm', item.level === 'Proficient' ? 'bg-green-50 text-green-700 border-green-200' : item.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200')}>
                <span className={cn('w-2 h-2 rounded-full', item.level === 'Proficient' ? 'bg-green-500' : item.level === 'Intermediate' ? 'bg-amber-500' : 'bg-red-500')} />
                {item.name}
              </span>
            ))}
          </div>
          <button type="button" onClick={onShowRadar} className="text-brand font-bold text-xs flex items-center gap-1">
            Open radar <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        <Card title="Recruiter Signals">
          <div className="space-y-3">
            {(analysis.redFlags || analysis.gaps || []).slice(0, 3).map((item: string, index: number) => (
              <div key={index} className="flex gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <Card title="Resume Improvement Plan">
          {improvement ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{improvement.improvedResume || improvement.content || JSON.stringify(improvement, null, 2)}</ReactMarkdown>
            </div>
          ) : (
            <div className="space-y-4">
              {(analysis.recommendations || analysis.optimizations || []).map((item: string, index: number) => (
                <div key={index} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={onFixResume} disabled={isLoading} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50">
            {isLoading ? 'OPTIMIZING...' : 'FIX RESUME WITH AI'}
          </button>
        </Card>

        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <button type="button" onClick={onApply} className="w-full py-3 bg-brand text-white rounded-xl text-[13px] font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Rocket className="w-4 h-4" /> Smart Apply
              </button>
              <button type="button" onClick={onStartInterview} className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Practice Interview
              </button>
              <button type="button" onClick={onGenerateStrategy} className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" /> Build Strategy
              </button>
            </div>
          </Card>
          <div className="p-8 bg-slate-900 rounded-3xl text-white">
            <Target className="w-8 h-8 text-indigo-400 mb-4" />
            <h4 className="font-bold text-xl mb-2">ATS Compatibility</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Focus on the gaps and phrasing that affect automated shortlisting.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
