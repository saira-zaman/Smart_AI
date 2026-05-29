import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import type { ToastState } from '../../types';

type UploadViewProps = {
  resumeText: string;
  jobDesc: string;
  interests: string;
  isLoading: boolean;
  setResumeText: (value: string) => void;
  setJobDesc: (value: string) => void;
  setInterests: (value: string) => void;
  setIsLoading: (value: boolean) => void;
  onAnalyze: () => void;
  showToast: (message: string, type?: ToastState['type']) => void;
};

export function UploadView({
  resumeText,
  jobDesc,
  interests,
  isLoading,
  setResumeText,
  setJobDesc,
  setInterests,
  setIsLoading,
  onAnalyze,
  showToast
}: UploadViewProps) {
  const parseFile = async (file: File) => {
    setIsLoading(true);
    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i += 1) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const strings = textContent.items.map((item: any) => item.str);
            fullText += `${strings.join(' ')}\n`;
          }
          setResumeText(fullText);
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
        return;
      }

      if (file.name.endsWith('.docx')) {
        showToast('DOCX support is limited. Try PDF if it fails.', 'info');
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer });
            setResumeText(result.value);
          } catch (caught) {
            console.error(caught);
            showToast('DOCX Parse Error', 'error');
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
        return;
      }

      showToast('Unsupported file format.', 'error');
      setIsLoading(false);
    } catch (caught) {
      console.error(caught);
      showToast('Error parsing file. Try pasting text.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <motion.div key="upload" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Recruiter-Grade Resume Intelligence</h1>
        <p className="text-slate-500">Stop applying blindly. Calculate your exact rejection probability before you hit submit.</p>
      </div>

      <Card className="p-10 border-slate-300 shadow-xl">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">Resume Content</label>
              <div className="flex gap-2">
                <label className="cursor-pointer text-[10px] font-bold text-brand hover:opacity-80 transition-opacity bg-brand/5 px-2 py-1 rounded">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) parseFile(file);
                    }}
                  />
                  UPLOAD FILE
                </label>
                <span className="text-[10px] text-slate-400">OR PASTE MARKDOWN</span>
              </div>
            </div>
            <textarea className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none font-mono text-[13px]" placeholder="Paste your resume content here..." value={resumeText} onChange={(event) => setResumeText(event.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Description</label>
              <div className="bg-white rounded-xl border border-slate-200 p-2">
                <textarea className="w-full h-32 p-4 rounded-md border-0 bg-transparent focus:outline-none text-[13px]" placeholder="Paste the job requirements..." value={jobDesc} onChange={(event) => setJobDesc(event.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Specific Interests</label>
              <div className="bg-white rounded-xl border border-slate-200 p-2">
                <textarea className="w-full h-32 p-4 rounded-md border-0 bg-transparent focus:outline-none text-[13px]" placeholder="e.g. Remote, Fintech, $120k+..." value={interests} onChange={(event) => setInterests(event.target.value)} />
              </div>
            </div>
          </div>

          <button type="button" onClick={onAnalyze} disabled={isLoading || !resumeText || !jobDesc} className="w-full py-4 bg-brand text-white rounded-xl font-bold text-lg hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-50">
            {isLoading ? 'CALCULATING SELECTION RATE...' : 'EXTRACT JOB MATCH SCORE'}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
