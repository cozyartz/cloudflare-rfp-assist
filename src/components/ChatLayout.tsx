// src/components/ChatLayout.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import MessageInput from './MessageInput';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeThread, setActiveThread] = useState('thread-default');

  // Load chat history from R2 based on the active thread ID
  const loadChat = async (threadId: string) => {
    try {
      const res = await fetch(`/functions/load-chat?threadId=${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  // Save updated messages list to R2
  const saveChat = async (threadId: string, messages: Message[]) => {
    try {
      await fetch(`/functions/save-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, messages })
      });
    } catch (err) {
      console.error('Failed to save chat:', err);
    }
  };

  // Handle sending user input and optional file
  const handleSend = async (text: string, file: File | null) => {
    if (!text.trim() && !file) return;

    const userMessage: Message = {
      role: 'user',
      content: text.trim() || `Uploaded file: ${file?.name}`
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    let fileContent = '';
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      fileContent = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }

    const response = await fetch('/functions/run-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessContext: 'Cozyartz Media Group',
        documentContent: fileContent || text,
        fileName: file?.name,
        fileType: file?.type
      })
    });

    const data = await response.json();

    const assistantMsg: Message = {
      role: 'assistant',
      content: data.choices?.[0]?.message?.content || '⚠️ No response received.'
    };

    const newChat = [...updatedMessages, assistantMsg];
    setMessages(newChat);
    setLoading(false);
    saveChat(activeThread, newChat);
  };

  // Force dark mode theme globally
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    loadChat(activeThread);
  }, [activeThread]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        threads={[activeThread]}
        activeThread={activeThread}
        onSelectThread={(thread) => {
          setActiveThread(thread);
          setMessages([]);
        }}
      />
      <div className="flex flex-col flex-1">
        <header className="p-4 bg-gray-800 flex justify-between items-center shadow">
          <span className="text-lg font-semibold">RFP Assistant</span>
        </header>
        <main className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>{msg.content}</div>
          ))}
          {loading && <div className="text-gray-400">Thinking...</div>}
        </main>
        <MessageInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
