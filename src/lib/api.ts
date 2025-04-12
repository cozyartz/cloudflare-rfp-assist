export async function fetchChatResponse(messages: { role: string, content: string }[]) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messages)
  });

  const data = await response.json();
  return data.response as string;
}
