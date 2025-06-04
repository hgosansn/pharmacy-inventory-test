# Project Specifics: Pharmacy Drug Management System

This document details the specifics of the codebase and business logic for the pharmacy drug management system in this repository.

## Core Concepts

- **Drug**: Each drug has two main properties:
  - `expiresIn`: Number of days until the drug expires.
  - `benefit`: A value representing the drug's effectiveness or power.

- **Daily Update**: At the end of each day, the system updates both `expiresIn` and `benefit` for every drug according to specific rules.

## Drug Rules

### General Rules
- All drugs decrease in `expiresIn` by 1 each day.
- All drugs decrease in `benefit` by 1 each day.
- Once the expiration date has passed (`expiresIn < 0`), `benefit` degrades twice as fast.
- The `benefit` of a drug is never negative.
- The `benefit` of a drug is never more than 50.

### Special Drugs

- **Herbal Tea**
  - Increases in `benefit` as it ages.
  - After expiration, `benefit` increases twice as fast.

- **Magic Pill**
  - Never expires (`expiresIn` does not change).
  - `benefit` does not decrease.

- **Fervex**
  - Increases in `benefit` as expiration approaches:
    - +2 when there are 10 days or less.
    - +3 when there are 5 days or less.
    - Drops to 0 after expiration.

- **Dafalgan**
  - Degrades in `benefit` twice as fast as normal drugs.

## Configuration Format (`drugUpdateConfigs.json`)

Drug update rules are defined in `drugUpdateConfigs.json`. Each drug is represented as a key with an object value describing how its `expiresIn` and `benefit` should be updated. The structure is as follows:

```json
{
  "Drug Name": {
    "expiresIn": { "change": "<number>" },
    "benefit": [
      { "when": "<condition>", "change": "<number>" },
      { "when": "<condition>", "set": "<number>" }
      // ...more rules as needed
    ]
  },
  // ...other drugs
}
```

### Field Details
- **expiresIn.change**: The amount to change `expiresIn` by each day (usually -1, 0 for Magic Pill).
- **benefit**: An array of rule objects, each with:
  - `when`: A condition (as a string) that is evaluated for the drug (e.g., `"true"`, `"expiresIn < 0"`, `"benefit > 0"`).
  - `change`: The amount to change `benefit` by if the condition is met (as a string, e.g., "-1", "1", "-2").
  - `set`: (Optional) Directly set `benefit` to a value if the condition is met (as a string, e.g., "0").

### Example

```json
{
  "Default": {
    "expiresIn": { "change": "-1" },
    "benefit": [
      { "when": "true", "change": "-1" },
      { "when": "expiresIn < 0", "change": "-1" }
    ]
  },
  "Herbal Tea": {
    "expiresIn": { "change": "-1" },
    "benefit": [
      { "when": "true", "change": "1" },
      { "when": "expiresIn < 0", "change": "1" }
    ]
  }
}
```

## Extending the System

- To add a new drug, define its rules in `drugUpdateConfigs.json` using the format above.
- The system can be extended to support new drugs and rules by updating the configuration and logic.

## Automation

- The repository includes a script (`openrouterClient.js`) to query OpenRouter for generating new drug configuration JSONs from natural language descriptions.

## Testing

- The output of the simulation is stored in `output.json`.
- Ensure your changes do not break the expected output by running the simulation and comparing results.

## Running the Project

- Use `pnpm start` or `docker-compose up` to run the simulation.

---

For more details, see the main [README.md](./README.md).
