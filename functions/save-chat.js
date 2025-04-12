export async function onRequestPost(context) {
    const { threadId, messages } = await context.request.json();
    const { R2 } = context.env;
  
    if (!threadId || !Array.isArray(messages)) {
      return new Response("Missing threadId or messages", { status: 400 });
    }
  
    const key = `chat-history/${threadId}.json`;
  
    await R2.put(key, JSON.stringify(messages, null, 2), {
      httpMetadata: {
        contentType: "application/json"
      }
    });
  
    return new Response("✅ Chat saved", { status: 200 });
  }
  