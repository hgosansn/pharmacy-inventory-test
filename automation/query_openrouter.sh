#!/bin/bash

# Usage: ./query_openrouter.sh <CLIENT_REQUEST>
# Example: ./query_openrouter.sh "Aspirin: Benefit increases by 2 each day until expiresIn < 0, then decreases by 1"

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <CLIENT_REQUEST>"
  exit 1
fi

# Read OPENROUTER_API_KEY from .env file if present
if [ -f .env ]; then
  export $(grep -E '^OPENROUTER_API_KEY=' .env | xargs)
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
  echo "OPENROUTER_API_KEY is not set. Please set it in your .env file."
  exit 1
fi

CLIENT_REQUEST="$*"

node ./openrouterClient.mjs "$CLIENT_REQUEST"
