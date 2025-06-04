# OpenRouter Automation Scripts

This folder contains scripts to interact with the OpenRouter API for generating drug configuration JSONs from natural language prompts.

## Setup

**Set your OpenRouter API key**
   - Create a `.env` file in the `automation/` folder or project root with the following content:
     ```env
     OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```
   - Or export it in your shell before running the script:
     ```sh
     export OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```

## Usage

Run the script with your drug prompt as a single argument (quotes recommended):

```sh
sh query_openrouter.sh "Chemical expires by 1 each day, and gets 3 less benefit every day but before benefit reaches zero it resets to 50 benefit"
```

### Example

**Input:**
```
Chemical expires by 1 each day, and gets 3 less benefit every day but before benefit reaches zero it resets to 50 benefit
```

**Output:**
```json
{
  "Chemical": {
    "expiresIn": {
      "change": -1
    },
    "benefit": [
      {
        "when": "benefit > 0",
        "change": -3
      },
      {
        "when": "benefit <= 0",
        "set": 50
      }
    ]
  }
}
```

## How it works

- The `query_openrouter.sh` script reads your API key and passes your prompt to `openrouterClient.mjs`.
- The client script sends your request to OpenRouter, which returns a JSON config for the drug described in your prompt.
- The drug name is automatically detected from your prompt (no need to specify it separately).

## Troubleshooting
- Ensure your API key is set in `.env` or your environment.
- If you see errors, check your network connection and API key validity.

---

For more details, see the comments in each script.
