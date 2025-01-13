import argparse
import os
import sys

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_path not in sys.path:
    sys.path.append(backend_path)

from assistant.functions.main import KTPaul

if __name__ == "__main__":

    # Initializes the script arguments
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--top_k",
        choices=[str(i) for i in range(1, 9)],
        default=4,
        help="Choose top k for semantic context vector retrieval (1-8)",
    )
    parser.add_argument(
        "-m", "--memory", help="Track memory usage", action="store_true"
    )
    parser.add_argument(
        "-v", "--verbose", help="Increase chatbot verbosity", action="store_true"
    )
    args = parser.parse_args()

    # Initializes the chatbot
    chatbot = KTPaul(top_k=int(args.top_k), memory=args.memory, verbose=args.verbose)
    query = input("\nHi, I'm KTPaul! How can I help you?\n\n")

    # Runs the RAG interaction loop
    while True:
        response, history = chatbot.query_agent(query=query)
        if args.verbose:
            print("\nResponse:")
        print(response)
        query = input("\n")
