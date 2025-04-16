import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatBubble from './ChatBubble';
import FileUpload from './FileUpload';
import ModelToggle, { ModelProvider } from './ModelToggle';
import { sendMessage } from '../lib/sendMessage';
import { Message } from '../lib/types';

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [threads] = useState(['Thread A', 'Thread B']);
  const [activeThread, setActiveThread] = useState('Thread A');
  const [provider, setProvider] = useState<ModelProvider>('cloudflare');
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const reply = await sendMessage(newMessages, provider);
    if (reply) {
      setMessages([...newMessages, { role: 'ai', content: reply }]);
    }
  };

  const handleUpload = (text: string) => {
    const uploadMsg: Message = {
      role: 'ai',
      content: `📄 File uploaded and extracted:\n\n${text}`,
    };
    setMessages((prev) => [...prev, uploadMsg]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen text-white bg-zinc-900">
      {/* Sidebar */}
      <Sidebar threads={threads} activeThread={activeThread} onSelectThread={setActiveThread} />

      {/* Main Chat */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <h1 className="text-xl font-semibold">RFP Assistant</h1>
          <div className="flex items-center space-x-4">
            <FileUpload onExtracted={handleUpload} />
            <ModelToggle value={provider} onChange={setProvider} />
          </div>
        </header>

        {/* Chat Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} from={msg.role} message={msg.content} />
          ))}
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900 flex items-center gap-3">
          <input
            className="flex-1 px-4 py-2 rounded border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
