// src/components/MessageInput.tsx
import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string, file: File | null) => void;
  loading: boolean;
}

export default function MessageInput({ onSend, loading }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (loading || (!input.trim() && !file)) return;
    onSend(input, file);
    setInput('');    // Clear the input field after sending
    setFile(null);   // Optional: clear file after send
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t bg-gray-900 flex gap-2 items-center">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-md border border-gray-700 p-2 bg-gray-800 text-white"
        rows={1}
        disabled={loading}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm text-white"
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
