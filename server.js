const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const { analyzeCode } = require("./src/services/analyzeCode");
const { buildPrompt } = require("./src/utils/buildPrompt");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/config", (_req, res) => {
  res.json({
    defaults: {
      ollamaModel: process.env.DEFAULT_OLLAMA_MODEL || "qwen2.5-coder",
      openAICompatibleModel:
        process.env.DEFAULT_OPENAI_COMPATIBLE_MODEL || "gpt-4.1-mini",
      openAICompatibleBaseURL:
        process.env.DEFAULT_OPENAI_COMPATIBLE_BASE_URL || "https://api.openai.com/v1"
    },
    supportedProviders: [
      {
        id: "ollama",
        name: "Ollama"
      },
      {
        id: "openai-compatible",
        name: "OpenAI-compatible"
      }
    ]
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      provider,
      model,
      mode,
      language,
      code,
      providerConfig
    } = req.body;

    if (!provider || typeof provider !== "string") {
      return res.status(400).json({
        error: "Provider is required."
      });
    }

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        error: "Code input is required."
      });
    }

    if (code.length > 12000) {
      return res.status(400).json({
        error: "Code is too long. Please keep it under 12,000 characters."
      });
    }

    const prompt = buildPrompt({
      code: code.trim(),
      mode,
      language
    });

    const result = await analyzeCode({
      provider,
      model,
      prompt,
      providerConfig: providerConfig || {},
      env: process.env
    });

    return res.json({
      result
    });
  } catch (error) {
    console.error("Analyze error:", error);

    return res.status(500).json({
      error: "Something went wrong while analyzing the code.",
      details: error?.message || "Unknown error"
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});