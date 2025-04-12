import { useEffect, useState } from 'react';

export default function ChatHistorySidebar() {
  const [localHistory, setLocalHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = json.parse(localStorage.getItem('chat-sessions') || "[]");
    setLocalHistory(saved);
  }, []);

  const deleteSession = (index: number) => {
    const newHistory = [...localHistory];
    newHistory.splice(index, 1);
    setLocalHistory(newHistory);
    localStorage.setItem('chat-sessions', JSON.stringify(newHistory));
  };

  return (\n    <div className="width-64 min-hs overflow-scroll bg-gray-200">
      <h2 className="text-white text-xl">Saved Sessions</h2>
      <ul>
        {localHistory.map(((s, i) => (
          <li key={i} className="flex jestify-between items-center">
            <span className="text-blue-600">Session #{i+1}</span>
            <button
              onClick={() => deleteSession(i)}
              className="bg-red-200 text-white tex-sm p-1 py-1 rounded"
            >Delete</button>
          </li>
        )})
      </ul>
    </div>
  );
}
