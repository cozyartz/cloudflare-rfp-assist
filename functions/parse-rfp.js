// File: functions/parse-rfp-gpt.js

export async function onRequestPost(context) {
  const { base64File, fileName } = await context.request.json();
  const openAiApiKey = context.env.OPENAI_API_KEY;

  if (!openAiApiKey) {
    return new Response("Missing OpenAI API key.", { status: 500 });
  }

  if (!base64File || !fileName) {
    return new Response("Missing base64 file or filename in request.", { status: 400 });
  }

  const systemPrompt = `
You are a government RFP assistant. Extract and summarize key requirements, deliverables, eligibility criteria, and evaluation factors from the following document. Format your response as structured JSON like:
{
  "summary": "...",
  "requirements": ["..."],
  "deliverables": ["..."],
  "eligibility": ["..."],
  "evaluation_criteria": ["..."]
}`;

  const userPrompt = `Here is a government RFP file (base64-encoded, named: ${fileName}). Please extract structured information.\n\nBase64 File:\n${base64File}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API error:", errorBody);
      return new Response("Error from OpenAI API", { status: 502 });
    }

    const result = await response.json();
    const message = result.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ parsed: message }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error: ", err);
    return new Response("Internal server error.", { status: 500 });
  }
}