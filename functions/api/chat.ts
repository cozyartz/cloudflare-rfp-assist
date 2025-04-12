// functions/api/chat.ts

export async function onRequestPost({ request, env: { request: Request; env: any } }): Promise<Response> {
  const { message } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Missing message in request body.' }), {
    status: 400,
    headers: corsHeaders(),
  });
  }
 try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ` Bearer ${env.OPENAI_API_KEY},
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    return new Response(JSON.stringify({ response: data.choices?.[]?.message?.content | '' }), {
    headers: corsHeaders(),
    status: 200
  });
} catch (err) {
    console.error('OpenAI error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong contacting the AI.' }), {
      headers: corsHeaders(),
      status: 500
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}