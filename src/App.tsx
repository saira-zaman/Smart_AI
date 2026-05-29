import { useState } from 'react';
import { Brain } from 'lucide-react';
import { analyzeResume, evaluateAnswer, fixAndApply, getCareerStrategy, getInterviewQuestion } from './services/geminiService';
import { Sidebar } from './components/layout/Sidebar';
import { AppMain } from './components/layout/AppMain';
import { ApplicationModal } from './components/modals/ApplicationModal';
import { LoginModal } from './components/modals/LoginModal';
import { UploadView } from './components/views/UploadView';
import { AnalysisView } from './components/views/AnalysisView';
import { InterviewView } from './components/views/InterviewView';
import { StrategyView } from './components/views/StrategyView';
import { SettingsView } from './components/views/SettingsView';
import { SkillRadarView } from './components/views/SkillRadarView';
import type { AppStep, SettingsState, ToastState } from './types';

export default function SmartHireApp() {
  const [step, setStep] = useState<AppStep>('upload');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [improvement, setImprovement] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');

  const [interviewPersona, setInterviewPersona] = useState('Startup Founder');
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [loginInput, setLoginInput] = useState({ name: '', email: 'sairazaman101@gmail.com' });
  const [toast, setToast] = useState<ToastState | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    ghostingProtection: true,
    privacyMode: false,
    autoOutreach: true
  });

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const getErrorMessage = (fallback: string, caught: unknown) =>
    caught instanceof Error ? caught.message : fallback;

  const startAnalysis = async () => {
    if (!resumeText || !jobDesc) return;

    setIsLoading(true);
    setError('');
    try {
      const result = await analyzeResume(resumeText, jobDesc, interests.split(','));
      setAnalysis(result);
      setStep('analysis');
    } catch (caught) {
      setError(getErrorMessage('Failed to analyze resume. Make sure GEMINI_API_KEY is set.', caught));
      console.error(caught);
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
    } catch (caught) {
      setError(getErrorMessage('Failed to improve resume. Make sure GEMINI_API_KEY is set.', caught));
      console.error(caught);
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
    } catch (caught) {
      setError(getErrorMessage('Failed to generate interview question. Make sure GEMINI_API_KEY is set.', caught));
      console.error(caught);
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
    } catch (caught) {
      setError(getErrorMessage('Failed to evaluate answer. Make sure GEMINI_API_KEY is set.', caught));
      console.error(caught);
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
    } catch (caught) {
      setError(getErrorMessage('Failed to generate strategy. Make sure GEMINI_API_KEY is set.', caught));
      console.error(caught);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginInput.name.trim()) return;

    setIsLoading(true);
    window.setTimeout(() => {
      const finalName = loginInput.name.trim();
      setUserName(finalName);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setIsLoading(false);
      console.log(`Welcome back, ${finalName}`);
    }, 800);
  };

  const renderStep = () => {
    if (step === 'upload') {
      return (
        <UploadView
          resumeText={resumeText}
          jobDesc={jobDesc}
          interests={interests}
          isLoading={isLoading}
          setResumeText={setResumeText}
          setJobDesc={setJobDesc}
          setInterests={setInterests}
          setIsLoading={setIsLoading}
          onAnalyze={startAnalysis}
          showToast={showToast}
        />
      );
    }

    if (step === 'analysis' && analysis) {
      return (
        <AnalysisView
          analysis={analysis}
          improvement={improvement}
          isLoading={isLoading}
          onFixResume={handleFixResume}
          onApply={() => setIsApplying(true)}
          onStartInterview={() => startInterview()}
          onGenerateStrategy={generateStrategy}
          onShowRadar={() => setStep('radar')}
        />
      );
    }

    if (step === 'radar' && analysis) {
      return <SkillRadarView analysis={analysis} onBack={() => setStep('analysis')} />;
    }

    if (step === 'strategy') {
      return (
        <StrategyView
          strategy={strategy}
          isLoading={isLoading}
          onBack={() => setStep('analysis')}
          onStartInterview={() => startInterview()}
        />
      );
    }

    if (step === 'interview' && currentQuestion) {
      return (
        <InterviewView
          currentQuestion={currentQuestion}
          evaluation={evaluation}
          interviewPersona={interviewPersona}
          userAnswer={userAnswer}
          isLoading={isLoading}
          setUserAnswer={setUserAnswer}
          onStartInterview={startInterview}
          onSubmitAnswer={submitAnswer}
        />
      );
    }

    if (step === 'settings') {
      return (
        <SettingsView
          settings={settings}
          setSettings={setSettings}
          onLogout={() => {
            setIsLoggedIn(false);
            setStep('upload');
          }}
        />
      );
    }

    return <UploadView resumeText={resumeText} jobDesc={jobDesc} interests={interests} isLoading={isLoading} setResumeText={setResumeText} setJobDesc={setJobDesc} setInterests={setInterests} setIsLoading={setIsLoading} onAnalyze={startAnalysis} showToast={showToast} />;
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800 selection:bg-brand/10">
      <Sidebar
        step={step}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        userName={userName}
        hasAnalysis={Boolean(analysis)}
        hasStrategy={Boolean(strategy)}
        setStep={setStep}
        onStartInterview={() => startInterview()}
        onGenerateStrategy={generateStrategy}
        onShowLogin={() => setShowLoginModal(true)}
        onLogout={() => setIsLoggedIn(false)}
        showToast={showToast}
      />

      <AppMain
        error={error}
        toast={toast}
        isLoggedIn={isLoggedIn}
        onClearError={() => setError('')}
        onShowLogin={() => setShowLoginModal(true)}
      >
        {renderStep()}
      </AppMain>

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

      <ApplicationModal
        isApplying={isApplying}
        hasApplied={hasApplied}
        setIsApplying={setIsApplying}
        setHasApplied={setHasApplied}
        setIsLoading={setIsLoading}
        onViewStrategy={() => setStep('strategy')}
      />

      <LoginModal
        open={showLoginModal}
        isLoading={isLoading}
        loginInput={loginInput}
        setLoginInput={setLoginInput}
        onClose={() => setShowLoginModal(false)}
        onSubmit={handleLogin}
      />
    </div>
  );
}
