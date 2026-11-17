'use client';

import { useEffect, useState } from 'react';

export default function ThemeLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        const userTheme = data.user?.theme || 'system';
        if (['light', 'dark', 'system'].includes(userTheme)) {
          localStorage.setItem('app-theme', userTheme);

          const root = document.documentElement;
          let isDark: boolean;
          if (userTheme === 'dark') {
            isDark = true;
          } else if (userTheme === 'light') {
            isDark = false;
          } else {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          }

          if (isDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }

        // Tema visual: Focus es el único tema desde Ola 5. Se ignora cualquier
        // valor previo en localStorage o en el perfil.
        localStorage.setItem('app-visual-theme', 'focus');
        const root = document.documentElement;
        root.setAttribute('data-visual-theme', 'focus');
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
      setReady(true);
    };

    loadTheme();
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
