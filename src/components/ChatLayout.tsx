import { useState } from 'react';
import ChatBubble from './ChatBubble';
import FileUpload from './FileUpload';
import ChatHistorySidebar from './ChatHistorySidebar';
import ProjectFitQuestions from './ProjectFitQuestions';
import { fetchChatResponse } from '../lib/api';
import { Message, Role } from '../lib/types';

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [fitStarted, setFitStarted] = useState(false);

  const handleFitAnswers = (result: { oldQuestion: string[], answers: string[] }) => {
    setFitStarted(true);
    const chatMsg: Message = {
      role: 'user',
      content: `**Summary of Fit Questions**\n\n${result.answers
        .map((s, i) => `**${result.oldQuestion[i]}**\n${s}`)
        .join('\n\n')}`,
    };
    setMessages((m) => [...m, chatMsg]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    try {
      const response = await fetchChatResponse(newMessages);
      setMessages([...newMessages, { role: 'ai', name: 'GPT', content: response }]);
    } catch (error) {
      console.error('Error talking to AI', error);
      setMessages([...newMessages, { role: 'ai', content: 'Error contacting AI.' }]);
    }

    setInput('');
  };

  const handleFileExt = (text: string) => {
    const systemMessage: Message = {
      role: 'ai',
      content: `**Results from uploaded file**\n\n${text}`,
    };
    setMessages((m) => [...m, systemMessage]);
  };

  return (
    <div className="mx-auto flex min-h-screen bg-gray-900 text-white">
      <ChatHistorySidebar />

      {!fitStarted && (
        <ProjectFitQuestions onComplete={handleFitAnswers} />
      )}

      <div className="flex flex-col flex-1 overflow-y-auto space-y-2 p-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg.content} from={msg.role} />
        ))}

        <div className="mt-4 flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="bg-zinc-800 border border-gray-700 rounded px-4 py-2 flex-1"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Send
          </button>
        </div>

        <FileUpload onExtracted={handleFileExt} />
      </div>
    </div>
  );
}
