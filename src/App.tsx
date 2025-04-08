import React, { useState } from 'react';
import RFPAssistant from './RFPAssistant';
import ThemeToggle from './components/ThemeToggle';
import SidebarWithThreads from './components/SidebarWithThreads';
import './style.css';

// Define the shape of messages
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function Gold() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    const userMessage: Message = {
      role: 'user',
      content: text.trim() || `Uploaded file: ${file?.name}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setText('');
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

      setFile(null);
    }

    const res = await fetch('/functions/run-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessContext: 'Cozyartz Media Group',
        documentContent: fileText || text,
        fileName,
        fileType,
      }),
    });

    const data = await res.json();

    const assistantMsg: Message = {
      role: 'assistant',
      content: data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-gray-800 shadow-md p-4 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Businesses</h2>
        <ul className="space-y-2">
          <li className="text-gray-700 dark:text-gray-200">Cozyartz Media Group</li>
          <li className="text-gray-700 dark:text-gray-200">AstroPraxis</li>
          <li className="text-gray-700 dark:text-gray-200">Battle Creek Drone</li>
        </ul>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <header className="bg-gray-900 text-white p-4 text-lg font-semibold text-center flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sm bg-gray-700 px-3 py-1 rounded">
            {sidebarOpen ? 'Hide' : 'Show'} Menu
          </button>
          <span>RFP Assistant</span>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-sm text-gray-500 animate-pulse">Generating response...</div>}
        </main>

        {/* Message Input */}
        <footer className="chat-input p-4 border-t bg-white dark:bg-gray-800 flex gap-2">
          <label className="upload-btn bg-gray-100 px-3 py-2 rounded cursor-pointer">
            📎 Upload RFP
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </label>
          <textarea
            rows={2}
            placeholder="Ask something about this RFP..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Gold;
