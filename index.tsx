// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/app'; // ✅ Must match the correct casing of the file
import './style.css';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
