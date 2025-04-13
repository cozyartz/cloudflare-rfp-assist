interface ChatBubbleProps {
  from: 'user' | 'ai';
  message: string;
}

export default function ChatBubble({ from, message }: ChatBubbleProps) {
  return (
    <div className={`message ${from === 'user' ? 'user' : 'assistant'}`}>
      {message}
    </div>
  );
}
