export async function onRequestGet(context) {
    const { R2_BUCKET } = context.env;
  
    const listResponse = await context.env[R2_BUCKET].list();
  
    const files = listResponse.objects.map(obj => obj.key);
  
    return new Response(JSON.stringify({ files }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  