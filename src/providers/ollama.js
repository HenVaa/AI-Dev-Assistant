async function analyzeWithOllama({ model, prompt, providerConfig, env }) {
  const selectedModel =
    model ||
    providerConfig.model ||
    env.DEFAULT_OLLAMA_MODEL ||
    "qwen2.5-coder";

  const baseURL =
    providerConfig.baseURL?.trim() || "http://127.0.0.1:11434";

  console.log("Ollama request starting...");
  console.log("Base URL:", baseURL);
  console.log("Model:", selectedModel);

  const response = await fetch(`${baseURL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: selectedModel,
      prompt,
      stream: false,
      options: {
        temperature: 0
      }
    })
  });

  console.log("Ollama HTTP status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.log("Ollama error body:", text);
    throw new Error(`Ollama request failed: ${text}`);
  }

  const data = await response.json();
  console.log("Ollama response received.");

  const result = data.response?.trim();

  if (!result) {
    throw new Error("Ollama returned an empty response.");
  }

  return result;
}

module.exports = { analyzeWithOllama };