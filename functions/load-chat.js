export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const threadId = url.searchParams.get("threadId");
  
    if (!threadId) {
      return new Response("Missing threadId", { status: 400 });
    }
  
    const key = `chat-history/${threadId}.json`;
  
    const object = await context.env.R2.get(key);
    if (!object) return new Response("Thread not found", { status: 404 });
  
    const body = await object.text();
  
    return new Response(body, {
      headers: { "Content-Type": "application/json" }
    });
  }
  