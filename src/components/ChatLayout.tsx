// components/ChatLayout.tsx
import { useState } from 'react';
import ChatBubble from './ChatBubble';

export default function ChatLayout() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the UI
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    // Send message to Cloudflare Worker
    try {
      const response = await fetch('https://cloudflare-rfp-assist-cozyartz.workers.dev/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages([...newMessages, { role: 'ai', content: data.response || 'No response received.' }]);
    } catch (error) {
      console.error('Error talking to AI:', error);
      setMessages([...newMessages, { role: 'ai', content: 'Error contacting AI.' }]);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg.content} from={msg.role} />
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded-l px-4 py-2"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
