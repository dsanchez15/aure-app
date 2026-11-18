'use client';

import { useEffect } from 'react';

/**
 * Aplica el tema del usuario sin bloquear el render: los hijos se pintan
 * siempre (el HTML ya sale con `data-visual-theme="focus"` desde el layout).
 */
export default function ThemeLoader({ children }: { children: React.ReactNode }) {
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

        // Tema visual: Focus es el único tema desde Ola 5.
        localStorage.setItem('app-visual-theme', 'focus');
        document.documentElement.setAttribute('data-visual-theme', 'focus');
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  return <>{children}</>;
}
