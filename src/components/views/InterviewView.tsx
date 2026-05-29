import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

type InterviewViewProps = {
  currentQuestion: any;
  evaluation: any;
  interviewPersona: string;
  userAnswer: string;
  isLoading: boolean;
  setUserAnswer: (value: string) => void;
  onStartInterview: (persona?: string) => void;
  onSubmitAnswer: () => void;
};

export function InterviewView({ currentQuestion, evaluation, interviewPersona, userAnswer, isLoading, setUserAnswer, onStartInterview, onSubmitAnswer }: InterviewViewProps) {
  return (
    <motion.div key="interview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Interview_Simulator/Active_Session</h2>
        <div className="flex gap-2">
          {['Startup Founder', 'Strict HR', 'Technical Lead'].map((persona) => (
            <button key={persona} type="button" onClick={() => onStartInterview(persona)} className={cn('px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border', interviewPersona === persona ? 'bg-brand text-white border-brand shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-brand')}>
              {persona.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <Card className="border-l-4 border-l-brand relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[100px] font-black -mr-10 -mt-10 select-none">"</div>
            <div className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Interviewer Persona: {interviewPersona}</div>
            <h3 className="text-2xl font-bold text-slate-900 leading-snug mb-4">{currentQuestion.question}</h3>
            <p className="text-slate-500 text-sm italic">{currentQuestion.context}</p>
          </Card>

          {!evaluation ? (
            <div className="space-y-4">
              <textarea value={userAnswer} onChange={(event) => setUserAnswer(event.target.value)} className="w-full h-48 p-6 rounded-2xl border border-slate-200 bg-white shadow-inner focus:ring-2 focus:ring-brand outline-none text-slate-700 text-lg leading-relaxed" placeholder="Speak or type your answer here..." />
              <button type="button" onClick={onSubmitAnswer} disabled={!userAnswer || isLoading} className="w-full py-4 bg-brand text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50">
                EVALUATE MY ANSWER
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card title="Performance Feedback" className="border-t-4 border-t-amber-500 shadow-xl">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center font-black text-2xl text-slate-900">{evaluation.score}</div>
                  <div className="text-sm text-slate-600 italic">{evaluation.feedback}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">AI Improved Version</h4>
                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{evaluation.improvedAnswer}</p>
                </div>
                <button type="button" onClick={() => onStartInterview()} className="w-full mt-6 py-3 border-2 border-brand text-brand rounded-xl font-bold hover:bg-brand/5 transition-all text-sm">
                  NEXT QUESTION
                </button>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Recruiter Bias Radar">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="text-[10px] font-bold text-red-600 mb-1">STRICT HR BIAS</div>
                <p className="text-[11px] text-red-800 italic">Focuses on cultural alignment and procedural accuracy. Avoid informal jargon.</p>
              </div>
              <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl">
                <div className="text-[10px] font-bold text-brand mb-1">FOUNDER BIAS</div>
                <p className="text-[11px] text-brand italic">Values ownership, speed, and cross-functional execution. Connect with the mission.</p>
              </div>
            </div>
          </Card>
          <div className="p-8 bg-slate-900 rounded-3xl text-white">
            <MessageSquare className="w-8 h-8 text-indigo-400 mb-4" />
            <h4 className="font-bold text-xl mb-2">Live Analysis Active</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Your answer is checked for confidence markers and value alignment.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
