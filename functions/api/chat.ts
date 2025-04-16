export interface Env {
  OPENAI_API_KEY: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_GATEWAY_ID: string;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  try {
    const { messages, provider } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Missing messages array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
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
          model: '@cf/meta/llama-2-7b-chat-int8', // Make sure this is a valid deployed model
          messages,
        }),
      });

      if (!cfRes.ok) {
        const errorText = await cfRes.text();
        console.error('❌ Cloudflare model error:', errorText);
        return new Response(JSON.stringify({
          error: 'Cloudflare AI model failed',
          detail: errorText,
        }), {
          status: cfRes.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await cfRes.json();
      const content = data.choices?.[0]?.message?.content ?? '⚠️ No content returned from Cloudflare model';

      return new Response(JSON.stringify({ content }), {
        headers: { 'Content-Type': 'application/json' },
      });
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

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error('❌ OpenAI model error:', errorText);
      return new Response(JSON.stringify({
        error: 'OpenAI model failed',
        detail: errorText,
      }), {
        status: openaiRes.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content ?? '⚠️ No content returned from OpenAI';

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    console.error('🚨 Server error:', err);
    return new Response(JSON.stringify({
      error: 'Server error',
      detail: (err as Error).message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

