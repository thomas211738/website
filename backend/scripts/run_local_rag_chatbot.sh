#!/bin/bash

# Stops if any command fails
set -e
set -o pipefail

# Navigates to the assistant directory if necessary
cd "$(dirname "$0")/../assistant"

# Checks if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose could not be found - please install it first"
    exit 1
fi

# Builds the local chatbot container
docker-compose -f ./docker-compose.yaml build local_chatbot

# Runs the local chatbot script
docker-compose -f ./docker-compose.yaml run --rm local_chatbot python local_chatbot.py --mode rag