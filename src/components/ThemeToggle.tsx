// File: src/components/ThemeToggle.tsx

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enabled = stored === 'dark' || (!stored && prefersDark);
    document.documentElement.classList.toggle('dark', enabled);
    setDarkMode(enabled);
  }, []);

  const toggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
