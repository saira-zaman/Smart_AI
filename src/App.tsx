import { useState, useEffect } from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar as RechartsRadar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Rocket, 
  Upload, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Brain, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  LayoutDashboard,
  Radar,
  Video,
  Map,
  Settings,
  LogOut,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { analyzeResume, fixAndApply, getCareerStrategy, getInterviewQuestion, evaluateAnswer } from './services/geminiService';
import { cn } from './lib/utils';

// --- Components ---

const Card = ({ children, title, className, headerAction }: { children: React.ReactNode, title?: string, className?: string, headerAction?: React.ReactNode }) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl p-6 shadow-sm", className)}>
    {title && (
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
        {headerAction}
      </div>
    )}
    {children}
  </div>
);

const NavItem = ({ icon: Icon, label, active = false, onClick, loading = false }: { icon: any, label: string, active?: boolean, onClick?: () => void, loading?: boolean }) => (
  <div 
    onClick={!loading ? onClick : undefined}
    className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
      active ? "bg-slate-700 text-slate-50" : "text-slate-400 hover:text-slate-50 hover:bg-slate-800",
      loading ? "opacity-50 cursor-wait" : "cursor-pointer"
    )}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin text-brand" /> : <Icon className="w-4 h-4" />}
    {label}
  </div>
);

export default function SmartHireApp() {
  const [step, setStep] = useState<'upload' | 'analysis' | 'strategy' | 'interview' | 'radar' | 'settings'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [improvement, setImprovement] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState<string>('');
  const [apiReady, setApiReady] = useState<boolean | null>(null);

  // Interview state
  const [interviewPersona, setInterviewPersona] = useState<string>('Startup Founder');
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);

  // Check API health on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/gemini/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: 'test', jobDescription: 'test', interests: [] })
        });
        const data = await res.json();
        if (data.error && data.error.includes('GEMINI_API_KEY')) {
          setApiReady(false);
          setError('🔑 API Key Missing: Please set GEMINI_API_KEY in Vercel Environment Variables');
        } else {
          setApiReady(true);
        }
      } catch (err) {
        setApiReady(true); // Assume working if network error (might be dev)
      }
    };
    checkApi();
  }, []);

  const startAnalysis = async () => {
    if (!resumeText || !jobDesc) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await analyzeResume(resumeText, jobDesc, interests.split(','));
      setAnalysis(result);
      setStep('analysis');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to analyze resume. Make sure GEMINI_API_KEY is set.';
      setError(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixResume = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fixAndApply(resumeText, jobDesc, analysis);
      setImprovement(result);
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to improve resume. Make sure GEMINI_API_KEY is set.';
      setError(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async (persona?: string) => {
    const selectedPersona = persona || interviewPersona;
    setInterviewPersona(selectedPersona);
    setIsLoading(true);
    setError('');
    try {
      const question = await getInterviewQuestion(selectedPersona, jobDesc, resumeText);
      setCurrentQuestion(question);
      setStep('interview');
      setEvaluation(null);
      setUserAnswer('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to generate interview question. Make sure GEMINI_API_KEY is set.';
      setError(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer || !currentQuestion) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await evaluateAnswer(currentQuestion.question, userAnswer, interviewPersona);
      setEvaluation(result);
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to evaluate answer. Make sure GEMINI_API_KEY is set.';
      setError(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateStrategy = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getCareerStrategy(resumeText, jobDesc);
      setStrategy(result);
      setStep('strategy');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to generate strategy. Make sure GEMINI_API_KEY is set.';
      setError(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [loginInput, setLoginInput] = useState({ name: '', email: 'sairazaman101@gmail.com' });

  // Settings State
  const [settings, setSettings] = useState({
    ghostingProtection: true,
    privacyMode: false,
    autoOutreach: true
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.name) return;
    
    setIsLoading(true);
    // Mimic real auth
    setTimeout(() => {
      const finalName = loginInput.name.trim();
      setUserName(finalName);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setIsLoading(false);
      // Personalization
      console.log(`Welcome back, ${finalName}`);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800 selection:bg-brand/10">
      {/* Setup Screen if API not ready */}
      {apiReady === false && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
          <div className="max-w-2xl w-full mx-auto px-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-brand" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Setup Required</h1>
              <p className="text-slate-300 text-lg mb-8">
                SmartHire AI++ needs your Google Gemini API key to work
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Follow These Steps:</h2>
              
              <div className="space-y-6 text-left">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand text-white font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Get Your API Key</h3>
                    <p className="text-slate-300 text-sm">
                      Go to <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">aistudio.google.com/apikey</a>
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Create a free Google Gemini API key (takes 1 minute)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand text-white font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Go to Vercel Dashboard</h3>
                    <p className="text-slate-300 text-sm">
                      Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">vercel.com/dashboard</a>
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Find your SmartHire AI++ project</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand text-white font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Add Environment Variable</h3>
                    <p className="text-slate-300 text-sm">
                      Go to <strong>Settings → Environment Variables</strong>
                    </p>
                    <p className="text-slate-400 text-xs mt-2">Add:</p>
                    <div className="bg-slate-900 p-3 rounded mt-2 font-mono text-xs text-slate-200">
                      GEMINI_API_KEY = your_api_key_here
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand text-white font-bold">4</div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Redeploy</h3>
                    <p className="text-slate-300 text-sm">
                      Go to <strong>Deployments → Redeploy</strong> latest commit
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Wait 2-3 minutes for deploy to complete</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setApiReady(true)}
              className="px-8 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand/90 transition-all"
            >
              Refresh & Try Again
            </button>
          </div>
        </div>
      )}

      {apiReady !== false && (
        <>
      {/* Sidebar */}
      <aside className="w-[260px] bg-slate-950 flex flex-col p-6 shrink-0 z-20">
        <div className="flex items-center gap-2 mb-10 px-2 text-slate-50 cursor-pointer" onClick={() => setStep('upload')}>
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-lg tracking-tight uppercase">SmartHire AI<span className="text-brand">++</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={step === 'analysis'} onClick={() => analysis ? setStep('analysis') : setStep('upload')} />
          <NavItem icon={Radar} label="Skill Radar" active={step === 'radar'} onClick={() => analysis ? setStep('radar') : alert("Please upload and analyze a resume first.")} />
          <NavItem 
            icon={Video} 
            label="Interview Sim" 
            active={step === 'interview'} 
            loading={isLoading && step === 'interview'}
            onClick={() => analysis ? startInterview() : alert("Please analyze a resume first.")} 
          />
          <NavItem 
            icon={Map} 
            label="Career Strategy" 
            active={step === 'strategy'} 
            loading={isLoading && step === 'strategy'}
            onClick={() => {
              if (strategy) setStep('strategy');
              else if (analysis) {
                setStep('strategy'); // Set step early so loader shows in right place
                generateStrategy();
              }
              else alert("Please analyze a resume first.");
            }} 
          />
          <NavItem icon={Settings} label="Settings" active={step === 'settings'} onClick={() => setStep('settings')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Logged In As</div>
          <div className="flex items-center justify-between">
            {isLoggedIn ? (
              <>
                <div className="text-sm font-semibold text-white">{userName}</div>
                <LogOut className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" onClick={() => setIsLoggedIn(false)} />
              </>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-bold text-brand hover:text-brand/80 transition-colors uppercase tracking-tight"
              >
                Sign In to Sync
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-full">
        {/* Error Banner */}
        {error && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b-2 border-red-400 p-4">
            <div className="flex items-start gap-4 max-w-7xl mx-auto">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900">Error</h3>
                <p className="text-red-800 text-sm mt-1">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* Top Mini Nav */}
        {!isLoggedIn && (
           <div className="absolute top-6 right-8 z-30">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-black transition-all shadow-lg"
              >
                Sign In
              </button>
           </div>
        )}
        <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ marginTop: error ? '80px' : '0' }}>
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto py-12"
              >
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
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                setIsLoading(true);
                                try {
                                  // For PDF parsing in the browser without complex workers
                                  if (file.type === 'application/pdf') {
                                    const reader = new FileReader();
                                    reader.onload = async () => {
                                      const typedarray = new Uint8Array(reader.result as ArrayBuffer);
                                      const pdfjsLib = await import('pdfjs-dist');
                                      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
                                      
                                      const pdf = await pdfjsLib.getDocument(typedarray).promise;
                                      let fullText = '';
                                      for (let i = 1; i <= pdf.numPages; i++) {
                                        const page = await pdf.getPage(i);
                                        const textContent = await page.getTextContent();
                                        const strings = textContent.items.map((item: any) => item.str);
                                        fullText += strings.join(' ') + '\n';
                                      }
                                      setResumeText(fullText);
                                      setIsLoading(false);
                                    };
                                    reader.readAsArrayBuffer(file);
                                  } else if (file.name.endsWith('.docx')) {
                                    alert("DOCX support is limited. Try PDF if it fails.");
                                    const reader = new FileReader();
                                    reader.onload = async () => {
                                      try {
                                        const mammoth = await import('mammoth');
                                        const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer });
                                        setResumeText(result.value);
                                      } catch (e) { alert("DOCX Parse Error"); }
                                      finally { setIsLoading(false); }
                                    };
                                    reader.readAsArrayBuffer(file);
                                  } else {
                                    alert("Unsupported file format.");
                                    setIsLoading(false);
                                  }
                                } catch (err) {
                                  console.error(err);
                                  alert("Error parsing file. Try pasting text.");
                                  setIsLoading(false);
                                }
                              }}
                            />
                            UPLOAD FILE (PDF)
                          </label>
                          <span className="text-[10px] text-slate-400">OR PASTE MARKDOWN</span>
                        </div>
                      </div>
                      <textarea 
                        className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none font-mono text-[13px]"
                        placeholder="Paste your resume content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Description</label>
                        <textarea 
                          className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-[13px]"
                          placeholder="Paste the job requirements..."
                          value={jobDesc}
                          onChange={(e) => setJobDesc(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Specific Interests</label>
                        <textarea 
                          className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-[13px]"
                          placeholder="e.g. Remote, Fintech, $120k+..."
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={startAnalysis}
                      disabled={isLoading || !resumeText || !jobDesc}
                      className="w-full py-4 bg-brand text-white rounded-xl font-bold text-lg hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-50"
                    >
                      {isLoading ? "CALCULATING SELECTION RATE..." : "EXTRACT JOB MATCH SCORE"}
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 'analysis' && analysis && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Main Dashboard</h2>
                  <div className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-full">ACTIVE SESSION: RAHUL_V2</div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card title="Selection Probability">
                    <div className={cn(
                      "text-5xl font-black mb-2 transition-colors",
                      analysis.selectionProbability < 40 ? "text-red-500" : analysis.selectionProbability < 70 ? "text-amber-500" : "text-green-500"
                    )}>
                      {analysis.selectionProbability}%
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.selectionProbability}%` }}
                        className={cn(
                          "h-full transition-all duration-1000",
                          analysis.selectionProbability < 40 ? "bg-red-500" : "bg-brand"
                        )}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium">
                      High risk of automated rejection for target role at <span className="text-slate-900 font-bold">FAANG-tier</span> companies.
                    </p>
                  </Card>

                  <Card title="Current Skill Radar">
                    <div className="flex flex-wrap gap-2 mb-4 min-h-[100px]">
                      {analysis.skills.map((item: any, i: number) => (
                        <div key={i} className="group relative">
                          <span className={cn(
                            "px-3 py-1.5 border text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm",
                            item.level === 'Proficient' ? "bg-green-50 text-green-700 border-green-200" :
                            item.level === 'Intermediate' ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          )}>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              item.level === 'Proficient' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                              item.level === 'Intermediate' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                              "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            )} />
                            {item.name}
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                            {item.level} Proficiency
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Proficiency Legend</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <div className="w-2 h-2 rounded-full bg-green-500" /> PROFICIENT
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <div className="w-2 h-2 rounded-full bg-amber-500" /> INTERMEDIATE
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          <div className="w-2 h-2 rounded-full bg-red-500" /> BEGINNER
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Hidden Opportunities">
                    <div className="space-y-4">
                      <div className="pb-3 border-b border-slate-100">
                        <div className="text-[13px] font-bold text-slate-800">Zepto • Remote Internship</div>
                        <div className="text-[11px] text-green-500 font-bold uppercase">94% Probable Selection</div>
                      </div>
                      <div className="pb-3">
                        <div className="text-[13px] font-bold text-slate-800">Groww • Early SDE Role</div>
                        <div className="text-[11px] text-green-500 font-bold uppercase">88% Probable Selection</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Rejection Engine */}
                  <Card title="❌ Rejection Intelligence Engine">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 space-y-4 mb-6">
                      {analysis.rejectionIntelligence.map((reason: string, i: number) => (
                        <div key={i} className="flex gap-3 text-red-900 border-b border-red-100 last:border-0 pb-3 last:pb-0">
                          <span className="text-lg">⚠️</span>
                          <div className="text-[13px] leading-relaxed">
                            {reason}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="italic text-[13px] text-slate-500 border-l-4 border-slate-300 pl-4 py-1 leading-relaxed">
                      "I would reject this candidate because there's no evidence of working on distributed systems at scale. I'd interview them if they showed Redis caching strategies." — <strong className="text-slate-800">Recruiter Bot v4</strong>
                    </div>
                  </Card>

                  {/* Fix & Apply Side */}
                  {!improvement ? (
                    <div className="h-full bg-brand p-8 rounded-2xl flex flex-col items-center justify-center text-center text-white shadow-lg space-y-6">
                      <h3 className="text-2xl font-black italic tracking-tighter">AI TRANSFORMATION READY</h3>
                      <p className="text-white/80 text-sm max-w-xs">Boost selection probability from {analysis.selectionProbability}% → 89% in 5 seconds.</p>
                      <button 
                        onClick={handleFixResume}
                        className="px-8 py-3.5 bg-white text-brand rounded-full font-extrabold text-sm hover:scale-105 transition-all shadow-xl active:scale-95"
                      >
                        ⚡ FIX RESUME & APPLY SMARTLY
                      </button>
                    </div>
                  ) : (
                    <Card title="🚀 Improvement Metrics">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="text-center p-4 bg-green-50 border border-green-100 rounded-2xl">
                          <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Old Selection</div>
                          <div className="text-2xl font-black text-slate-400 line-through">{analysis.selectionProbability}%</div>
                        </div>
                        <ArrowRight className="text-slate-300 w-8 h-8" />
                        <div className="text-center p-4 bg-brand border border-brand/20 rounded-2xl">
                          <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">New Selection</div>
                          <div className="text-4xl font-black text-white">{improvement.boostedProbability}%</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <button 
                          onClick={() => setIsApplying(true)}
                          className="w-full py-4 bg-brand text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
                        >
                          <Rocket className="w-5 h-5" /> APPLY SMARTLY NOW
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all text-xs">
                            <FileText className="w-4 h-4" /> Export Resume
                          </button>
                          <button 
                            onClick={generateStrategy}
                            className="py-3 border-2 border-brand text-brand rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand/5 transition-all text-xs"
                          >
                            <Map className="w-4 h-4" /> Full Roadmap
                          </button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {improvement && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-2 gap-6"
                  >
                    <Card title="Optimized Resume Preview" className="h-[600px] flex flex-col">
                      <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                        <div className="prose prose-slate prose-sm max-w-none prose-headings:font-black prose-headings:text-slate-900">
                          <ReactMarkdown>{improvement.improvedResume}</ReactMarkdown>
                        </div>
                      </div>
                    </Card>

                    <Card title="Recruiter Outreach Suite">
                      <div className="space-y-6">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative pt-8">
                          <span className="absolute top-0 left-0 bg-slate-800 text-white text-[9px] font-bold px-3 py-1 rounded-br-xl">LINKEDIN DM</span>
                          <p className="text-[13px] text-slate-600 italic whitespace-pre-wrap">{improvement.outreachMessages?.linkedin}</p>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative pt-8">
                          <span className="absolute top-0 left-0 bg-brand text-white text-[9px] font-bold px-3 py-1 rounded-br-xl">COVER LETTER</span>
                          <p className="text-[13px] text-slate-600 whitespace-pre-wrap">{improvement.coverLetter}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 'radar' && analysis && (
              <motion.div 
                key="radar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">SKILL_ENGINE/RADAR_DYNAMICS</h2>
                  <button onClick={() => setStep('analysis')} className="text-brand font-bold text-sm">Dashboard</button>
                </div>

                <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                  <Card title="Multi-Dimensional Proficiency Map" className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={
                        analysis.skills.map((s: any) => ({
                          subject: s.name,
                          A: s.level === 'Proficient' ? 100 : s.level === 'Intermediate' ? 65 : 35,
                          fullMark: 100,
                        }))
                      }>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <RechartsRadar
                          name="Candidate"
                          dataKey="A"
                          stroke="#4f46e5"
                          fill="#4f46e5"
                          fillOpacity={0.5}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>

                  <div className="space-y-6">
                    <Card title="Skill Gap Protocol">
                      <div className="space-y-4">
                        <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider">Critical Missing Links</p>
                        <div className="grid grid-cols-1 gap-3">
                          {analysis.missingSkills?.map((item: any, i: number) => (
                            <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[13px] font-extrabold text-red-900">{item.skill}</span>
                                <span className="text-[10px] font-black text-red-400">{item.daysToLearn} DAYS</span>
                              </div>
                              <div className="flex gap-1">
                                {item.roadmap?.slice(0, 2).map((r: string, idx: number) => (
                                  <span key={idx} className="text-[9px] text-red-600 bg-red-100/50 px-1.5 py-0.5 rounded italic">↳ {r}</span>
                                ))}
                              </div>
                            </div>
                          )) || analysis.rejectionIntelligence.slice(0, 3).map((note: string, i: number) => (
                            <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-red-900 font-medium leading-tight">{note}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={generateStrategy}
                          className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                          GENERATE SYLLABUS
                        </button>
                      </div>
                    </Card>

                    <div className="p-6 bg-slate-900 rounded-2xl text-white">
                       <h4 className="text-xs font-black text-brand uppercase tracking-widest mb-2">Internal Benchmark</h4>
                       <p className="text-[11px] text-slate-400 mb-4">Your profile is currently <span className="text-white font-bold">outperforming 64%</span> of applicants for similar roles.</p>
                       <div className="w-full h-1 bg-slate-800 rounded-full">
                          <div className="w-[64%] h-full bg-brand rounded-full" />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">USER_CONTROL_CENTER/SYSTEM_CONFIG</h2>
                
                <div className="space-y-6">
                  <Card title="Profile Information">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Account Display Name</label>
                          <input 
                            type="text" 
                            disabled
                            value={userName || 'Rahul Sharma (Mock)'}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Connection</label>
                          <input 
                            type="text" 
                            disabled
                            value={loginInput.email || 'rahul@example.com'}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-400 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Preferences & Notifications">
                    <div className="divide-y divide-slate-100">
                      <div className="py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-800">Recruiter Ghosting Protection</div>
                          <div className="text-[11px] text-slate-400">Automatically follow up if no response within 72h.</div>
                        </div>
                        <div 
                          onClick={() => setSettings(s => ({ ...s, ghostingProtection: !s.ghostingProtection }))}
                          className={cn(
                            "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors",
                            settings.ghostingProtection ? "bg-brand" : "bg-slate-200"
                          )}
                        >
                          <motion.div 
                            animate={{ x: settings.ghostingProtection ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm" 
                          />
                        </div>
                      </div>
                      <div className="py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-800">Deep Profile Privacy</div>
                          <div className="text-[11px] text-slate-400">Anonymize work history identifiers for initial scrapers.</div>
                        </div>
                        <div 
                          onClick={() => setSettings(s => ({ ...s, privacyMode: !s.privacyMode }))}
                          className={cn(
                            "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors",
                            settings.privacyMode ? "bg-brand" : "bg-slate-200"
                          )}
                        >
                          <motion.div 
                            animate={{ x: settings.privacyMode ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm" 
                          />
                        </div>
                      </div>
                      <div className="py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-800">Direct Recruiter Messages</div>
                          <div className="text-[11px] text-slate-400">Allow AI to ping recruiters on LinkedIn automatically.</div>
                        </div>
                        <div 
                          onClick={() => setSettings(s => ({ ...s, autoOutreach: !s.autoOutreach }))}
                          className={cn(
                            "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors",
                            settings.autoOutreach ? "bg-brand" : "bg-slate-200"
                          )}
                        >
                          <motion.div 
                            animate={{ x: settings.autoOutreach ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm" 
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setStep('upload');
                    }}
                    className="w-full py-4 text-red-500 font-black border-2 border-red-100 rounded-2xl hover:bg-red-50 transition-all uppercase tracking-widest text-xs"
                  >
                    Destroy All Local Strategy Data & Logout
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'strategy' && !strategy && isLoading && (
              <motion.div 
                key="strategy-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full space-y-4"
              >
                <Loader2 className="w-12 h-12 animate-spin text-brand" />
                <h3 className="text-xl font-bold text-slate-800">Generating Your 60-Day War Room Strategy...</h3>
                <p className="text-slate-500 text-sm italic">Analyzing gaps and mapping market opportunities.</p>
              </motion.div>
            )}

            {step === 'strategy' && strategy && (
              <motion.div 
                key="strategy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic whitespace-nowrap">CAREER_WAR_ROOM/60_DAY_STRATEGY</h2>
                  <button 
                    onClick={() => setStep('analysis')}
                    className="text-brand font-bold text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                </div>

                <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                  <div className="space-y-6">
                    {strategy.plan.map((item: any, i: number) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center font-bold text-xs ring-4 ring-slate-100",
                            item.priority === 'High' ? "bg-red-500 text-white" : "bg-brand text-white"
                          )}>
                            {item.day}
                          </div>
                          <div className="flex-1 w-0.5 bg-slate-200 mt-2 mb-2 group-last:hidden" />
                        </div>
                        <div className="flex-1 pb-10">
                          <Card className="hover:border-brand transition-all">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                item.priority === 'High' ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                              )}>
                                {item.priority} PRIORITY
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 leading-snug">{item.task}</h4>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <Card title="Quick Actions">
                      <div className="space-y-3">
                        <button onClick={() => startInterview()} className="w-full py-3 bg-brand text-white rounded-xl text-[13px] font-bold hover:shadow-lg transition-all">Practice Interviews</button>
                        <button className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-all">Daily Skill Tracker</button>
                      </div>
                    </Card>
                    <div className="p-6 bg-slate-900 rounded-3xl text-white">
                      <Sparkles className="w-8 h-8 text-yellow-400 mb-4" />
                      <h4 className="font-bold text-lg mb-2 leading-tight">Selection Boost Mode Active</h4>
                      <p className="text-slate-400 text-xs">Probability locked at 89%. Practice interviews to reach 94%.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'interview' && currentQuestion && (
              <motion.div 
                key="interview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Interview_Simulator/Active_Session</h2>
                  <div className="flex gap-2">
                    {['Startup Founder', 'Strict HR', 'Technical Lead'].map((p) => (
                      <button 
                        key={p}
                        onClick={() => startInterview(p)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                          interviewPersona === p ? "bg-brand text-white border-brand shadow-md" : "bg-white text-slate-500 border-slate-200 hover:border-brand"
                        )}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                  <div className="space-y-6">
                    <Card className="border-l-4 border-l-brand relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[100px] font-black -mr-10 -mt-10 select-none">"</div>
                      <div className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Interviewer Persona: {interviewPersona}</div>
                      <h3 className="text-2xl font-bold text-slate-900 leading-snug mb-4">
                        {currentQuestion.question}
                      </h3>
                      <p className="text-slate-500 text-sm italic">{currentQuestion.context}</p>
                    </Card>

                    {!evaluation ? (
                      <div className="space-y-4">
                        <textarea 
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="w-full h-48 p-6 rounded-2xl border border-slate-200 bg-white shadow-inner focus:ring-2 focus:ring-brand outline-none text-slate-700 text-lg leading-relaxed"
                          placeholder="Speak or type your answer here..."
                        />
                        <button 
                          onClick={submitAnswer}
                          disabled={!userAnswer || isLoading}
                          className="w-full py-4 bg-brand text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          EVALUATE MY ANSWER
                        </button>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <Card title="Performance Feedback" className="border-t-4 border-t-amber-500 shadow-xl">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center font-black text-2xl text-slate-900">
                              {evaluation.score}
                            </div>
                            <div className="text-sm text-slate-600 italic">
                             {evaluation.feedback}
                            </div>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">AI Improved Version</h4>
                            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{evaluation.improvedAnswer}</p>
                          </div>
                          <button 
                            onClick={() => startInterview()}
                            className="w-full mt-6 py-3 border-2 border-brand text-brand rounded-xl font-bold hover:bg-brand/5 transition-all text-sm"
                          >
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
                           <p className="text-[11px] text-red-800 italic">Focuses on cultural alignment and strict procedural accuracy. Avoid informal jargon.</p>
                        </div>
                        <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl">
                           <div className="text-[10px] font-bold text-brand mb-1">FOUNDER BIAS</div>
                           <p className="text-[11px] text-brand italic">Values ownership, speed, and cross-functional scrappiness. Connect with the vision.</p>
                        </div>
                      </div>
                    </Card>
                    <div className="p-8 bg-slate-900 rounded-3xl text-white">
                      <MessageSquare className="w-8 h-8 text-indigo-400 mb-4" />
                      <h4 className="font-bold text-xl mb-2">Live Analysis Active</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">Our AI is analyzing your response for "Confidence Markers" and "Value Alignment".</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Prompt Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center border-t-4 border-brand">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-brand rounded-full animate-spin" />
              <Brain className="absolute inset-0 m-auto text-brand w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">AI Reasoning in Progress</h4>
              <p className="text-slate-500 text-sm mt-1">Cross-referencing recruiter bias markers and semantic skill patterns...</p>
            </div>
          </div>
        </div>
      )}

      {/* Application Simulation Modal */}
      <AnimatePresence>
        {isApplying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[110] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              {!hasApplied ? (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                      <Rocket className="text-brand w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic">Confirm Application</h3>
                      <p className="text-xs text-slate-500">Target: High Probability Selection (89%)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                      <span className="text-sm font-semibold">AI-Optimized "Google XYZ" Resume attached</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                      <span className="text-sm font-semibold">Tailored Cover Letter Generated</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Target className="text-brand w-5 h-5" />
                      <span className="text-sm font-semibold font-mono">ATS Compatibility: 100%</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsApplying(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
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
                  <p className="text-slate-500 mb-8 max-w-[280px] mx-auto text-sm">Our AI has successfully integrated your profile into the recruiter's shortlisting queue.</p>
                  
                  <button 
                    onClick={() => {
                      setIsApplying(false);
                      setHasApplied(false);
                      setStep('strategy');
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
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 border border-slate-200"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-brand w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Candidate_Portal</h3>
                <p className="text-sm text-slate-500 mt-2">Sign in to save your 60-day strategy.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand outline-none text-sm"
                    placeholder="Enter your name"
                    value={loginInput.name}
                    onChange={(e) => setLoginInput({ ...loginInput, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand outline-none text-sm"
                    placeholder="name@example.com"
                    value={loginInput.email}
                    onChange={(e) => setLoginInput({ ...loginInput, email: e.target.value })}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-brand text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-lg"
                >
                  {isLoading ? "AUTHENTICATING..." : "SIGN IN NOW"}
                </button>
              </form>
              
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-full mt-4 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                Skip for now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
