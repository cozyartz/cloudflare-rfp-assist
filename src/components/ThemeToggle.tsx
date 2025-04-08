// src/components/ThemeToggle.tsx
import React from 'react';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
    >
      Toggle Theme
    </button>
  );
}