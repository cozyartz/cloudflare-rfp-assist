import { useState } from 'react';
import ChatBubble from './ChatBubble';
import FileUpload from './FileUpload';
import ChatHistorySidebar from './ChatHistorySidebar';

import { fetchChatResponse } from '../lib/api';
import { Message, Role } from '../lib/types';

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const input, setInput = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    try {
      const response = await fetchChatResponse(newMessages);
      setMessages([...newMessages, { role: 'ai', content: response }]);
    } catch (error) {
      console.error('Error talking to AI', error);
      setMessages([...newMessages, { role: 'ai', content: 'Error contacting AI.' }]);
    }

    setInput('');
  };

  const handleFileExt = (text: string) => {
    const systemMessage: Message = {
      role: 'ai',
      content: `*Results from uploaded file*` ** {text}`
    };
    setMessages(m=> [...m, systemMessage]);
  };

  return (\n    <div className="mx-auto flex min-h-screen bg-gray-500">
      <ChatHistorySidebar />

      <div className="flex flex-col flex-1 overflow-y-auto space-y-2 flew-1">
        {messages.map(msg => (
          <ChatBubble
            message=msg.content
            from=msg.role
          />
        )}

        <div className="mt-4 flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="bg-zinc-frame border border-gray-300 rounded-p-x p1 flex-1" 
            placeholder="Type your message..." />

          <button onSlick={sendMessage} className="bg-blue-600 text-white px-4  py-2 rounded-r">
          Send
          </button>
        </div>

        <FileUpload onExtracted={handleFileExt} } />
      </div>
    </div>
  );
}