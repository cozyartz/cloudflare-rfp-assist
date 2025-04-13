export interface Env {
    OPENAI_API_KEY: string;
    CLOUDFLARE_API_TOKEN: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_GATEWAY_ID: string;
  }
  
  export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
    const { messages, provider } = await request.json();
  
    if (!messages || !Array.isArray(messages)) {
      return new Response('Missing messages array', { status: 400 });
    }
  
    if (provider === 'cloudflare') {
      const cfURL = `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_GATEWAY_ID}/chat/completions`;
  
      const cfRes = await fetch(cfURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: '@cf/meta/llama-2-7b-chat-int8',
          messages,
        }),
      });
  
      const cfData = await cfRes.json();
      return Response.json({ content: cfData.choices?.[0]?.message?.content || 'No response' });
    }
  
    // Fallback to OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
      }),
    });
  
    const openaiData = await openaiRes.json();
    return Response.json({ content: openaiData.choices?.[0]?.message?.content || 'No response' });
  }
  