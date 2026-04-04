function buildPrompt({ code, mode, language }) {
  const safeMode = ["explain", "improve", "bugs"].includes(mode)
    ? mode
    : "explain";

  const safeLanguage = language?.trim() || "Unknown";

  let taskInstruction = "";

  if (safeMode === "explain") {
    taskInstruction = `
Explain what the code does in plain, developer-friendly language.
Include:
1. Overall purpose
2. Step-by-step explanation
3. Important functions or logic
4. Anything that may confuse a junior developer
`;
  } else if (safeMode === "improve") {
    taskInstruction = `
Suggest practical improvements to the code.
Include:
1. What works well
2. What should be improved
3. Improved version of the code
4. Short explanation of why the changes are better
`;
  } else if (safeMode === "bugs") {
    taskInstruction = `
Identify possible bugs, edge cases, or bad practices.
Include:
1. Potential issues
2. Why they are problematic
3. Suggested fixes
4. Safer or cleaner code example if relevant
`;
  }

  return `
You are a senior software developer helping a junior developer.

Programming language: ${safeLanguage}
Task mode: ${safeMode}

${taskInstruction}

Rules:
- Be concise but useful
- Use markdown formatting
- Use code blocks when needed
- Do not invent behavior that is not visible in the code
- If something is uncertain, say so clearly

Code to analyze:
\`\`\`${safeLanguage.toLowerCase()}
${code}
\`\`\`
`;
}

module.exports = { buildPrompt };