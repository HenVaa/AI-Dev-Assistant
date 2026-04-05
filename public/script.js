const form = document.getElementById("analyzeForm");
const providerInput = document.getElementById("provider");
const modelInput = document.getElementById("model");
const languageInput = document.getElementById("language");
const modeInput = document.getElementById("mode");
const codeInput = document.getElementById("code");
const providerSettings = document.getElementById("providerSettings");
const resultOutput = document.getElementById("result");
const statusText = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

let appConfig = {
  defaults: {
    ollamaModel: "qwen2.5-coder",
    openAICompatibleModel: "gpt-4.1-mini",
    openAICompatibleBaseURL: "https://api.openai.com/v1"
  }
};

marked.setOptions({
  breaks: true,
  gfm: true
});

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Analyzing..." : "Analyze";
}

function renderMarkdownResult(markdownText) {
  const safeMarkdown = markdownText || "";
  resultOutput.innerHTML = marked.parse(safeMarkdown);

  resultOutput.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    const data = await response.json();
    appConfig = data;
    updateProviderUI(true);
  } catch (error) {
    console.error("Failed to load config:", error);
    updateProviderUI(true);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProviderPanelHTML(provider) {
  if (provider === "ollama") {
    return `
      <div class="provider-panel">
        <h3>Ollama settings</h3>
        <div class="grid two-columns">
          <div class="field">
            <label for="ollamaBaseURL">Base URL</label>
            <input
              id="ollamaBaseURL"
              type="text"
              placeholder="http://127.0.0.1:11434"
              value="http://127.0.0.1:11434"
            />
            <div class="helper-text">Default local Ollama server address.</div>
          </div>
        </div>
      </div>
    `;
  }

  if (provider === "openai-compatible") {
    return `
      <div class="provider-panel">
        <h3>OpenAI-compatible settings</h3>
        <div class="grid two-columns">
          <div class="field">
            <label for="openaiBaseURL">Base URL</label>
            <input
              id="openaiBaseURL"
              type="text"
              placeholder="https://api.openai.com/v1"
              value="${escapeHtml(appConfig.defaults.openAICompatibleBaseURL || "https://api.openai.com/v1")}"
            />
            <div class="helper-text">Example: https://api.openai.com/v1</div>
          </div>

          <div class="field">
            <label for="openaiApiKey">API Key</label>
            <input
              id="openaiApiKey"
              type="password"
              placeholder="Paste your API key"
            />
            <div class="helper-text">Used only for the current request.</div>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

function updateModelDefault(provider) {
  if (provider === "ollama") {
    modelInput.value = appConfig.defaults.ollamaModel || "qwen2.5-coder";
  } else if (provider === "openai-compatible") {
    modelInput.value =
      appConfig.defaults.openAICompatibleModel || "gpt-4.1-mini";
  }
}

function updateProviderUI(keepModel = false) {
  const provider = providerInput.value;
  providerSettings.innerHTML = getProviderPanelHTML(provider);

  if (!keepModel || !modelInput.value.trim()) {
    updateModelDefault(provider);
  }
}

function buildProviderConfig(provider) {
  if (provider === "ollama") {
    return {
      baseURL: document.getElementById("ollamaBaseURL")?.value?.trim() || ""
    };
  }

  if (provider === "openai-compatible") {
    return {
      baseURL: document.getElementById("openaiBaseURL")?.value?.trim() || "",
      apiKey: document.getElementById("openaiApiKey")?.value?.trim() || ""
    };
  }

  return {};
}

providerInput.addEventListener("change", () => {
  updateProviderUI(false);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const provider = providerInput.value;
  const model = modelInput.value.trim();
  const language = languageInput.value.trim();
  const mode = modeInput.value;
  const code = codeInput.value.trim();
  const providerConfig = buildProviderConfig(provider);

  if (!code) {
    statusText.textContent = "Please paste some code first.";
    resultOutput.textContent = "No code provided.";
    return;
  }

  setLoading(true);
  statusText.textContent = `Sending request to ${provider}...`;
  resultOutput.textContent = "Waiting for response...";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        provider,
        model,
        mode,
        language,
        code,
        providerConfig
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || "Request failed.");
    }

    renderMarkdownResult(data.result);
    statusText.textContent = `Analysis complete with ${provider}.`;
  } catch (error) {
    console.error(error);
    statusText.textContent = "Something went wrong.";
    resultOutput.textContent = error.message || "Unknown error.";
  } finally {
    setLoading(false);
  }
});

clearBtn.addEventListener("click", () => {
  codeInput.value = "";
  resultOutput.textContent = "Your AI response will appear here.";
  statusText.textContent = "Cleared.";
});

copyBtn.addEventListener("click", async () => {
  const text = resultOutput.innerText;

  if (!text || text === "Your AI response will appear here.") {
    statusText.textContent = "Nothing to copy yet.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    statusText.textContent = "Result copied to clipboard.";
  } catch (error) {
    statusText.textContent = "Copy failed.";
  }
});

loadConfig();