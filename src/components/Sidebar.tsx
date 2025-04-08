// File: src/components/SidebarWithThreads.tsx

import { useState, useEffect } from 'react';

interface SidebarProps {
  businessContext: string;
  setBusinessContext: (value: string) => void;
  setMessages: (messages: { role: 'user' | 'assistant'; content: string }[]) => void;
  collapsed: boolean;
  toggleCollapse: () => void;
}

export default function SidebarWithThreads({ businessContext, setBusinessContext, setMessages, collapsed, toggleCollapse }: SidebarProps) {
  const [threads, setThreads] = useState<string[]>([]);
  const [selectedThread, setSelectedThread] = useState<string>('New Chat');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('chatThreads') || '[]');
    setThreads(saved);
  }, []);

  const handleNewThread = () => {
    const name = prompt('Name your new thread:');
    if (name) {
      const updated = [...threads, name];
      setThreads(updated);
      localStorage.setItem('chatThreads', JSON.stringify(updated));
      setSelectedThread(name);
      setMessages([]);
    }
  };

  const handleLoadThread = (name: string) => {
    setSelectedThread(name);
    const data = localStorage.getItem(`thread-${name}`);
    if (data) {
      setMessages(JSON.parse(data));
    } else {
      setMessages([]);
    }
  };

  const handleSaveThread = () => {
    const history = JSON.stringify(JSON.parse(localStorage.getItem('currentMessages') || '[]'));
    localStorage.setItem(`thread-${selectedThread}`, history);
  };

  return (
    <aside className={`bg-white dark:bg-gray-800 shadow-md transition-transform p-4 ${collapsed ? 'w-0 overflow-hidden' : 'w-72'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Threads</h2>
        <button onClick={toggleCollapse} className="text-xs text-blue-600 hover:underline">
          {collapsed ? 'Open' : 'Close'}
        </button>
      </div>

      <ul className="space-y-2 mb-4">
        {threads.map((thread) => (
          <li
            key={thread}
            className={`cursor-pointer p-2 rounded ${selectedThread === thread ? 'bg-blue-100 text-blue-800' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => handleLoadThread(thread)}
          >
            {thread}
          </li>
        ))}
      </ul>

      <button onClick={handleNewThread} className="w-full bg-green-500 text-white py-1 px-2 rounded mb-2">
        + New Chat
      </button>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Business</label>
        <select
          className="w-full border rounded p-2"
          value={businessContext}
          onChange={e => setBusinessContext(e.target.value)}
        >
          <option>Cozyartz Media Group</option>
          <option>AstroPraxis</option>
          <option>Battle Creek Drone</option>
        </select>
      </div>

      <button
        onClick={handleSaveThread}
        className="mt-4 w-full bg-blue-600 text-white py-1 px-2 rounded"
      >
        💾 Save Chat
      </button>
    </aside>
  );
}