'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';

type Stage = 'preloading' | 'lanyard' | 'cinematic' | 'home';

interface AppContextProps {
  stage: Stage;
  setStage: (s: Stage) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { isTouchDevice } = useDeviceType();

  // Touch devices (mobile / tablet) skip the lanyard entirely — jump straight
  // to 'home' so they never load the heavy WebGL physics scene.
  const [stage, setStage] = useState<Stage>('preloading');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (isTouchDevice) {
      setStage('home');
    }
  }, [isTouchDevice]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppContext.Provider value={{ stage, setStage, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
