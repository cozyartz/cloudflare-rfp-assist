import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string, file: File | null) => Promise<void>;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, loading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSendClick = async () => {
    await onSend(text, file);
    setText('');
    setFile(null);
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-white dark:bg-gray-900 p-4 flex items-end gap-2">
      <label className="cursor-pointer px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm">
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
        className="flex-1 resize-none px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring focus:border-blue-500"
      />

      <button
        onClick={handleSendClick}
        disabled={loading || (!text.trim() && !file)}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </footer>
  );
};

export default MessageInput;