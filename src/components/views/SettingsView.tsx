import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import type { SettingsState } from '../../types';

type SettingsViewProps = {
  settings: SettingsState;
  setSettings: (settings: SettingsState) => void;
  onLogout: () => void;
};

export function SettingsView({ settings, setSettings, onLogout }: SettingsViewProps) {
  const toggle = (key: keyof SettingsState) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Settings</h2>
        <p className="text-sm text-slate-500 mt-2">Configure candidate workflow automation.</p>
      </div>

      <Card title="Automation">
        <div className="space-y-5">
          <SettingToggle label="Ghosting Protection" description="Follow up when recruiter activity drops." checked={settings.ghostingProtection} onChange={() => toggle('ghostingProtection')} />
          <SettingToggle label="Privacy Mode" description="Limit local strategy and session persistence." checked={settings.privacyMode} onChange={() => toggle('privacyMode')} />
          <SettingToggle label="Auto Outreach" description="Prepare messages for high-fit roles." checked={settings.autoOutreach} onChange={() => toggle('autoOutreach')} />
        </div>
      </Card>

      <button type="button" onClick={onLogout} className="w-full py-4 text-white font-black rounded-2xl bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500 transition-all uppercase tracking-widest text-sm shadow-lg">
        Destroy All Local Strategy Data & Logout
      </button>
    </motion.div>
  );
}

function SettingToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="w-full flex items-center justify-between gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
      <div>
        <div className="font-bold text-slate-900">{label}</div>
        <div className="text-xs text-slate-500 mt-1">{description}</div>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-brand' : 'bg-slate-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}
