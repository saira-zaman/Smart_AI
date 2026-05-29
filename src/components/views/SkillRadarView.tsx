import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar as RechartsRadar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';

type SkillRadarViewProps = {
  analysis: any;
  onBack: () => void;
};

export function SkillRadarView({ analysis, onBack }: SkillRadarViewProps) {
  const data = (analysis.skills || []).map((skill: any) => ({
    subject: skill.name,
    score: skill.score || (skill.level === 'Proficient' ? 85 : skill.level === 'Intermediate' ? 60 : 35)
  }));

  return (
    <motion.div key="radar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Skill Radar</h2>
        <button type="button" onClick={onBack} className="text-brand font-bold text-sm flex items-center gap-1 group">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      <Card className="h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <RechartsRadar name="Skill Score" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.35} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
