// src/ChatGPTClone.tsx
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './components/ThemeToggle';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatGPTClone() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    const userMessage = {
      role: 'user',
      content: input.trim() || `Uploaded file: ${file?.name}`,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setFile(null);
    setLoading(true);

    let fileText = '';
    let fileName = null;
    let fileType = null;

    if (file) {
      fileName = file.name;
      fileType = file.type;

      if (fileType === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        fileText = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      } else {
        fileText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject('File read error');
          reader.readAsText(file);
        });
      }
    }

    try {
      const res = await fetch('/functions/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessContext: 'Cozyartz Media Group',
          documentContent: fileText || input,
          fileName,
          fileType,
        }),
      });
      const data = await res.json();
      const response = data.result?.choices?.[0]?.message?.content || data.result?.response || JSON.stringify(data);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error fetching response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center shadow-sm">
        <h1 className="text-lg font-semibold">ChatGPT Clone</h1>
        <ThemeToggle />
      </header>

      <main
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-3xl mx-auto space-y-4"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-3 whitespace-pre-line text-sm max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-auto'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="italic text-sm text-gray-500 dark:text-gray-400">Assistant is typing...</div>}
      </main>

      <footer className="w-full max-w-3xl mx-auto px-4 py-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row items-end gap-2">
          <div className="flex items-center gap-2 w-full">
            <label className="cursor-pointer text-xs px-3 py-2 rounded bg-gray-100 dark:bg-gray-700">
              📎 Upload
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </label>

            <textarea
              className="flex-1 resize-none px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none"
              rows={2}
              placeholder="Send a message or upload a file..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !file)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {file && <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">📄 {file.name}</span>}
        </div>
      </footer>
    </div>
  );
}
