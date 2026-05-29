export type AppStep = 'upload' | 'analysis' | 'strategy' | 'interview' | 'radar' | 'settings';

export type ToastState = {
  message: string;
  type?: 'info' | 'error';
};

export type SettingsState = {
  ghostingProtection: boolean;
  privacyMode: boolean;
  autoOutreach: boolean;
};
