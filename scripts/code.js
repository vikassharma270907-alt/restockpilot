#!/usr/bin/env node

/**
 * MiniMax Coding Assistant CLI (via NVIDIA NIM)
 *
 * Usage:
 *   npm run code:minimax -- "Write a function to validate email addresses"
 *   npm run code:minimax -- "Add unit tests" lib/paypal.ts
 *   node scripts/code.js "Refactor this component" components/Docket.tsx
 */

const fs = require("fs");
const path = require("path");

// Load .env.local if present
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const apiKey = process.env.NVIDIA_API_KEY || process.env.MINIMAX_API_KEY;
if (!apiKey) {
  console.error("\x1b[31mError: NVIDIA_API_KEY is not set in .env.local\x1b[0m");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
\x1b[36m=== MiniMax Coding Assistant (via NVIDIA NIM) ===\x1b[0m
Model: \x1b[33m${process.env.MINIMAX_MODEL || "minimaxai/minimax-m3.1-flash"}\x1b[0m

Usage:
  npm run code:minimax -- "<prompt>" [optional_target_file]

Examples:
  npm run code:minimax -- "Create a helper to format ISO dates to locale string"
  npm run code:minimax -- "Explain and write unit tests" lib/paypal.ts
  npm run code:minimax -- "Refactor to use useCallback" components/Docket.tsx
`);
  process.exit(0);
}

const promptArg = args[0];
const fileArg = args[1];

let contextFromFile = "";
if (fileArg && fs.existsSync(fileArg)) {
  const content = fs.readFileSync(fileArg, "utf-8");
  contextFromFile = `\n\n--- Context File (${fileArg}) ---\n\`\`\`typescript\n${content}\n\`\`\``;
}

const { createOpenAI } = require("@ai-sdk/openai");
const { generateText } = require("ai");

const nvidia = createOpenAI({
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
  apiKey: apiKey,
});

const modelName = process.env.MINIMAX_MODEL || "minimaxai/minimax-m3.1-flash";

async function main() {
  process.stdout.write(`\x1b[36m[MiniMax ${modelName}]\x1b[0m Generating code...\n\n`);

  try {
    const result = await generateText({
      model: nvidia(modelName),
      system:
        "You are an elite principal software engineer and expert in TypeScript, Next.js, and PayPal integrations. " +
        "Provide direct, high quality, production-ready code with concise, actionable explanations.",
      prompt: `${promptArg}${contextFromFile}`,
    });

    console.log(result.text);
    console.log("\n\x1b[32m✔ Completed via MiniMax on NVIDIA NIM\x1b[0m");
  } catch (err) {
    console.error("\x1b[31mError querying MiniMax:\x1b[0m", err.message || err);
    process.exit(1);
  }
}

main();
