import { Message } from './types';
import { ModelProvider } from '../src/components/ModelToggle';

export async function sendMessage(
  messages: Message[],
  provider: ModelProvider
): Promise<string> {
  if (provider === 'cloudflare') {
    const res = await fetch('/api/ask-cloudflare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const text = await res.text();
    return text;
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    }),
  });

  const json = await res.json();
  return json.choices[0].message.content;
}
