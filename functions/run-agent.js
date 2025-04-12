export async function onRequestPost(context) {
  try {
    const { businessContext, documentContent, fileName, fileType } = await context.request.json();
    const { AI } = context.env;

    if (!documentContent) {
      return new Response("Missing documentContent", { status: 400 });
    }

    const systemMessage = {
      role: 'system',
      content: `You are a helpful RFP assistant trained on data for ${businessContext}.`
    };

    const userMessage = {
      role: 'user',
      content: documentContent
    };

    // Use AI Gateway or direct LLM call
    const response = await AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [systemMessage, userMessage]
    });

    if (!response || !response.response) {
      throw new Error("No response from AI model");
    }

    // Wrap in OpenAI-style format for frontend compatibility
    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            role: 'assistant',
            content: response.response.trim()
          }
        }
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error("Error in run-agent:", err);

    // Always respond with fallback structure to avoid breaking frontend
    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            role: 'assistant',
            content: "❌ Sorry, there was an error processing your request."
          }
        }
      ]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
