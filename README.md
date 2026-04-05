# AI Dev Assistant

A multi-provider AI tool for analyzing code through one interface.

Supports local models (Ollama) and OpenAI-compatible APIs.

---

## 🌐 Project showcase

View the project showcase here:

https://henvaa.github.io/AI-Dev-Assistant/showcase.html

## ✨ Features

- Explain code step-by-step
- Suggest improvements
- Detect potential bugs
- Works with multiple AI providers:
  - Ollama (local models)
  - OpenAI-compatible APIs
- Clean and simple UI

---

## 🧠 Why I built this

I wanted to explore how AI can be integrated into real development workflows — not just as a chat tool, but as part of an actual application.

This project focuses on:
- Practical AI usage in software development
- Multi-provider architecture
- Building a usable developer tool

---

## 🖼️ Screenshots

### Main view

![Main UI](./images/main_view.png)

### Generated explanation

![Explain code](./images/explain_code.png)

### Provider-specific settings

![Provider settings](./images/provider.png)

### Different analysis modes

![Analysis modes](./images/analysis_mode.png)

---

## 🧩 How it works

1. User inputs code
2. Selects:
   - provider
   - model
   - analysis mode
3. Backend builds a prompt
4. Sends request to selected AI provider
5. Response is rendered as formatted output

---

## 🏗️ Architecture

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Providers:
  - Ollama (local)
  - OpenAI-compatible API

The provider layer abstracts differences between APIs, allowing the same UI to work with multiple models.

---

## ⚙️ Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server
```bash
npm run dev
```

### 3. Open in browser

http://localhost:3000

---

### 🧪 Example use cases

- Understand unfamiliar code
- Debug small issues
- Learn how code works
- Improve code quality

---

### 🎯 What I learned

- How to integrate AI APIs into applications
- Handling multiple providers with different interfaces
- Prompt design for developer-focused use cases
- Building a simple but usable UI
- Debugging real integration issues (API, local models, etc.)

---

### 📌 Possible future improvements

- Add more providers
- Save history of analyses
- Better UI/UX
- Syntax-aware highlighting improvements

---

### 👤 Author

Henna Väätäinen