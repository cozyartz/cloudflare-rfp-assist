export async function onRequestPost(context) {
    const formData = await context.request.formData();
    const file = formData.get("file");
  
    const key = `uploads/${Date.now()}-${file.name}`;
  
    await context.env.R2.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type }
    });
  
    return new Response(JSON.stringify({ key }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  