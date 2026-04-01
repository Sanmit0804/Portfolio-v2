'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Stage = 'preloading' | 'lanyard' | 'cinematic' | 'home';

interface AppContextProps {
  stage: Stage;
  setStage: (s: Stage) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [stage, setStage] = useState<Stage>('preloading');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Trigger home stage automatically for testing purposes if you don't want to test the lanyard each time
  // But since this is a production-grade portfolio, we follow the steps sequentially.

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
