// src/components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  threads: string[];
  activeThread: string;
  onSelectThread: (thread: string) => void;
}

export default function Sidebar({ threads, activeThread, onSelectThread }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700">
      <h2 className="text-lg font-bold mb-4">Chat History</h2>
      <ul className="space-y-2">
        {threads.map((thread, i) => (
          <li key={i}>
            <button
              className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${
                activeThread === thread ? 'bg-gray-700 font-semibold' : ''
              }`}
              onClick={() => onSelectThread(thread)}
            >
              {thread}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
