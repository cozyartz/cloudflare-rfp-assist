// File: functions/zap.js

export async function onRequestPost(context) {
  const { CLOUDFLARE_AI_TOKEN } = context.env;
  const body = await context.request.json();

  const { businessContext, userQuestion } = body;

  const systemMessage = `You are an expert RFP assistant who supports three businesses:

1. Cozyartz Media Group
- Multimedia and eLearning
- Services: video, animation, instructional design, LMS setup

2. AstroPraxis
- Legal support and automation
- Services: process serving, court filing, legal automation

3. Battle Creek Drone
- Aerial media and environmental services
- Services: drone mapping, inspection, surveying

Use these services to evaluate questions or RFP content. Tailor responses to the business and only use what is retrieved from the vector database.`;

  const response = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/51826042d6e31c694331efeb1be34123/ai/run/@cf/meta/llama-3-8b-instruct",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_AI_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userQuestion }
        ],
        rag: {
          index: "company-profiles-index",
          query_type: "auto"
        }
      })
    }
  );

  const result = await response.json();

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}