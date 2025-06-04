// Add this to suppress the MODULE_TYPELESS_PACKAGE_JSON warning when running as a script
// @ts-check
// esm

import fetch from "node-fetch";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"; // Example endpoint, update if needed
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Set your API key in env

/**
 * Query OpenRouter with a system prompt and user request, return formatted JSON for drug configs
 * @param {string} clientRequest - Text describing the drug's constraints
 * @returns {Promise<Object>} - JSON object for drugUpdateConfigs
 */
export async function queryOpenRouter(clientRequest) {
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not set");

  // The LLM will extract the drug name from the client request
  const systemPrompt = `You are an expert in pharmaceutical software. Given a client request describing a drug's constraints, identify the drug name from the request and output a JSON config for that drug in the following format:

<drugConfigs>
{
  "<DrugNameFromRequest>": {
    "expiresIn": { "change": <number> },
    "benefit": [
      { "when": <condition>, "change": <number> },
      { "when": <condition>, "set": <number> }
      // ...more rules as needed
    ]
  }
}
</drugConfigs>

- The key must be the drug name as it appears in the client request (case-sensitive).
- The \`expiresIn\` object must have a \`"change"\` field (integer) indicating how much to increment or decrement the \`expiresIn\` value each day.
- The \`benefit\` array contains rules for updating the drug's benefit. Each rule must have:
  - \`"when"\`: a condition string, which can be:
    - \`"true"\` (always applies)
    - or a comparison of the form: \`expiresIn <number>\`, \`expiresIn <= <number>\`, \`expiresIn > <number>\`, \`expiresIn >= <number>\`, \`expiresIn == <number>\`, \`expiresIn != <number>\`, \`benefit <number>\`, \`benefit <= <number>\`, \`benefit > <number>\`, \`benefit >= <number>\`, \`benefit == <number>\`, \`benefit != <number>\`
    - Example: \`"expiresIn < 0"\`, \`"benefit >= 10"\`
  - Either \`"change"\` (integer, how much to add/subtract from benefit if the condition matches) or \`"set"\` (integer, set benefit to this value if the condition matches).
- Rules are evaluated in order; the first matching \`"set"\` rule stops further processing for that day.
- The benefit value is always limited between 0 and 50 after all rules are applied.
- Only return the JSON object, inside the drugConfigs tags, nothing else.`;

  const body = {
    model: "meta-llama/llama-3.3-8b-instruct:free", // or another model available on OpenRouter
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: clientRequest },
    ],
    temperature: 0.2,
  };

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `OpenRouter API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  // Defensive: ensure data is an object and use optional chaining to avoid type errors
  let content;
  if (
    data &&
    typeof data === "object" &&
    data !== null &&
    Array.isArray(data["choices"]) &&
    data["choices"][0]?.["message"]?.["content"]
  ) {
    content = data["choices"][0]["message"]["content"];
  } else {
    throw new Error("Unexpected response format from OpenRouter API");
  }
  try {
    const cleaned = content.replace(/```[a-zA-Z]*[\r\n]+|```/g, "");
    const match = /<drugConfigs>([\s\S]*?)<\/drugConfigs>/.exec(cleaned);
    const jsonString = match ? match[1].trim() : cleaned;
    return JSON.parse(jsonString);
  } catch (e) {
    throw new Error(
      "Failed to parse JSON from OpenRouter response: " +
        content +
        "\nError: " +
        e.message,
    );
  }
}

// CLI handler
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , ...clientRequestArr] = process.argv;
  const clientRequest = clientRequestArr.join(" ");
  queryOpenRouter(clientRequest)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
