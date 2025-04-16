import { Message } from './types';
import { ModelProvider } from '../components/ModelToggle';
// 🚫 Do not import sendMessage here — you're defining it below!
// import { sendMessage } from '../lib/sendMessage';

export async function sendMessage(
  messages: Message[],
  provider: ModelProvider
): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, provider }),
    });

    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      return `❌ Server responded with ${res.status}: ${res.statusText}`;
    }

    const data = await res.json();

    return typeof data.content === 'string'
      ? data.content
      : '⚠️ No valid content received from model.';
  } catch (err) {
    console.error('Fetch error:', err);
    return '❌ Unable to contact model server. Check your network or API status.';
  }
}
