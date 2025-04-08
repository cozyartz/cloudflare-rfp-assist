import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string, file: File | null) => void;
  loading: boolean;
}

export default function MessageInput({ onSend, loading }: MessageInputProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSend = () => {
    if (!text.trim() && !file) return;
    onSend(text, file);
    setText('');
    setFile(null);
  };

  return (
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
  );
}
