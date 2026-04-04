const { analyzeWithOllama } = require("../providers/ollama");
const { analyzeWithOpenAICompatible } = require("../providers/openaiCompatible");

async function analyzeCode({ provider, model, prompt, providerConfig, env }) {
  switch (provider) {
    case "ollama":
      return analyzeWithOllama({
        model,
        prompt,
        providerConfig,
        env
      });

    case "openai-compatible":
      return analyzeWithOpenAICompatible({
        model,
        prompt,
        providerConfig,
        env
      });

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

module.exports = { analyzeCode };