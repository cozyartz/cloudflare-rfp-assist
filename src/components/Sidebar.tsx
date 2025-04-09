// src/components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  businessContext: string;
  setBusinessContext: (val: string) => void;
  setMessages: (val: any[]) => void;
  collapsed: boolean;
  toggleCollapse: () => void;
}

const businesses = [
  'Cozyartz Media Group',
  'AstroPraxis',
  'Battle Creek Drone'
];

export default function Sidebar({
  businessContext,
  setBusinessContext,
  setMessages,
  collapsed,
  toggleCollapse
}: SidebarProps) {
  return (
    <aside className={`bg-gray-800 text-white w-64 p-4 border-r border-gray-700 ${collapsed ? 'hidden md:block' : ''}`}>
      <h2 className="text-xl font-bold mb-4">Businesses</h2>
      <ul className="space-y-2">
        {businesses.map((biz) => (
          <li key={biz}>
            <button
              onClick={() => {
                setBusinessContext(biz);
                setMessages([]);
              }}
              className={`text-left w-full px-3 py-2 rounded hover:bg-gray-700 ${businessContext === biz ? 'bg-gray-700 font-semibold' : ''}`}
            >
              {biz}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button
          onClick={toggleCollapse}
          className="text-xs text-gray-400 hover:text-white"
        >
          {collapsed ? 'Show Sidebar' : 'Hide Sidebar'}
        </button>
      </div>
    </aside>
  );
}
