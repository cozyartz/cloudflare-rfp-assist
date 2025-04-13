import { useState } from 'react';
import ChatBubble from './ChatBubble';
import Sidebar from './Sidebar';
import ModelToggle, { ModelProvider } from './ModelToggle';
import ProjectFitQuestions from './ProjectFitQuestions';
import FileUpload from './FileUpload';
import { sendMessage } from '../lib/sendMessage';
import { Message } from '../lib/types';

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [fitStarted, setFitStarted] = useState(false);
  const [provider, setProvider] = useState<ModelProvider>('cloudflare');
  const [threads] = useState(['Session A', 'Session B']);
  const [activeThread, setActiveThread] = useState('Session A');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const res = await sendMessage(newMessages, provider);
    setMessages([...newMessages, { role: 'ai', content: res }]);
  };

  const handleFitAnswers = (result: { oldQuestion: string[]; answers: string[] }) => {
    setFitStarted(true);
    const chatMsg: Message = {
      role: 'user',
      content: `**Fit Summary**\n\n${result.answers
        .map((s, i) => `**${result.oldQuestion[i]}**\n${s}`)
        .join('\n\n')}`,
    };
    setMessages((m) => [...m, chatMsg]);
  };

  const handleFileExtracted = (text: string) => {
    const aiMsg: Message = {
      role: 'ai',
      content: `📄 Extracted RFP Content:\n\n${text}`,
    };
    setMessages((m) => [...m, aiMsg]);
  };

  return (
    <div className="flex h-screen text-white bg-zinc-900">
      <Sidebar threads={threads} activeThread={activeThread} onSelectThread={setActiveThread} />

      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-3 border-b border-zinc-800 bg-zinc-900 shadow-sm">
          <h1 className="text-xl font-semibold text-white">RFP Assistant</h1>
          <div className="flex items-center space-x-4">
            <FileUpload onExtracted={handleFileExtracted} />
            <ModelToggle value={provider} onChange={setProvider} />
          </div>
        </header>

        {!fitStarted && (
          <div className="p-6 max-w-3xl mx-auto mt-6 bg-zinc-800 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">RFP Fit Evaluation</h2>
            <ProjectFitQuestions onComplete={handleFitAnswers} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.content} from={msg.role} />
          ))}
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900 flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
