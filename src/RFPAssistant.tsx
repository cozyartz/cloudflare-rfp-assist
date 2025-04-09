import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageInput from './components/MessageInput';
import ThemeToggle from './components/ThemeToggle';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function RFPAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [businessContext, setBusinessContext] = useState('Cozyartz Media Group');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = async (text: string, file: File | null) => {
    if (!text.trim() && !file) return;

    const userMessage: Message = {
      role: 'user',
      content: text.trim() || `Uploaded file: ${file?.name}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    localStorage.setItem('currentMessages', JSON.stringify([...messages, userMessage]));
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

    const res = await fetch('/functions/run-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessContext,
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

    const fullChat = [...messages, userMessage, assistantMsg];
    setMessages(fullChat);
    localStorage.setItem('currentMessages', JSON.stringify(fullChat));
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        businessContext={businessContext}
        setBusinessContext={setBusinessContext}
        setMessages={setMessages}
        collapsed={!sidebarOpen}
        toggleCollapse={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-col flex-1">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sm bg-gray-700 px-3 py-1 rounded"
            >
              {sidebarOpen ? 'Hide' : 'Show'} Menu
            </button>
            <ThemeToggle />
          </div>
          <span className="text-lg font-semibold">RFP Assistant</span>
        </header>

        <main className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-400 animate-pulse">
              Generating response...
            </div>
          )}
        </main>

        <MessageInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}

export default RFPAssistant;
