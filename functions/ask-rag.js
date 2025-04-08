export async function onRequestPost(context) {
  const body = await context.request.json()
  const userPrompt = body.query

  const aiGatewayUrl = `https://gateway.ai.cloudflare.com/v1/${context.env.CLOUDFLARE_ACCOUNT_ID}/${context.env.CLOUDFLARE_GATEWAY_ID}/chat/completions`

  const response = await fetch(aiGatewayUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${context.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "@cf/meta/llama-2-7b-chat-int8",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      rag: {
        index: "company-profiles-index",
        query_type: "auto",
        generation_prompt: GENERATION_PROMPT
      }
    })
  })

  if (!response.ok) {
    return new Response("Error from AI Gateway", { status: 500 })
  }

  const result = await response.json()
  return new Response(JSON.stringify(result.choices[0].message.content), {
    headers: { "Content-Type": "application/json" }
  })
}
