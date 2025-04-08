// placeholder_chatwindow// File: src/components/ChatBox.tsx

import { useState } from 'react';

export default function ChatBox() {
  const [business, setBusiness] = useState('Cozyartz Media Group');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/functions/zap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessContext: business,
          userQuestion: input
        })
      });

      const result = await res.json();
      const content = result?.result?.response || result?.result?.choices?.[0]?.message?.content || JSON.stringify(result);

      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error getting response.' }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Business:</label>
        <select
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
        >
          <option>Cozyartz Media Group</option>
          <option>AstroPraxis</option>
          <option>Battle Creek Drone</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto bg-white border rounded p-4 space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'} text-sm`}>{msg.content}</div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">Streaming response...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded text-sm"
          placeholder="Ask the assistant..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
