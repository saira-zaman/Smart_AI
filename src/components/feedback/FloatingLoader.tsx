import { Zap } from 'lucide-react';

type FloatingLoaderProps = {
  isLoading: boolean;
  loadingText: {
    title?: string;
    desc?: string;
  };
};

export function FloatingLoader({ isLoading, loadingText }: FloatingLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center border-t-4 border-brand">
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 w-full h-full border-4 border-slate-100 border-t-brand rounded-full animate-spin" />
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center z-10 shadow-inner">
            <Zap className="w-6 h-6 fill-white text-white" />
          </div>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{loadingText.title || 'Loading'}</h4>
          <p className="text-slate-500 text-sm mt-1">{loadingText.desc || 'Please wait a moment...'}</p>
        </div>
      </div>
    </div>
  );
}
