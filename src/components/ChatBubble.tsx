// src/components/ChatBubble.tsx
import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap break-words text-sm md:text-base ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-100 rounded-bl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
