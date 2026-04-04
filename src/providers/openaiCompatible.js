async function analyzeWithOpenAICompatible({
  model,
  prompt,
  providerConfig,
  env
}) {
  const selectedModel =
    model ||
    providerConfig.model ||
    env.DEFAULT_OPENAI_COMPATIBLE_MODEL ||
    "gpt-4.1-mini";

  const baseURL =
    providerConfig.baseURL?.trim() ||
    env.DEFAULT_OPENAI_COMPATIBLE_BASE_URL ||
    "https://api.openai.com/v1";

  const apiKey =
    providerConfig.apiKey?.trim() ||
    env.DEFAULT_OPENAI_COMPATIBLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API key is required for OpenAI-compatible provider."
    );
  }

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI-compatible request failed: ${text}`);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content?.trim();

  if (!result) {
    throw new Error("Provider returned an empty response.");
  }

  return result;
}

module.exports = { analyzeWithOpenAICompatible };