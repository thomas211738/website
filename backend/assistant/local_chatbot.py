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
        "--mode",
        choices=["rag", "react"],
        default="rag",
        help="Choose the chatbot architecture (rag or react)",
        required=True,
    )
    parser.add_argument(
        "--top_k",
        choices=[i for i in range(1, 11)],
        default=5,
        help="Choose the top k similarity vectors (1-10)",
    )
    parser.add_argument(
        "-v", "--verbose", help="Increase chatbot verbosity", action="store_true"
    )
    args = parser.parse_args()

    # Initializes the chatbot
    chatbot = KTPaul(top_k=args.top_k, verbose=args.verbose)
    query = input("\nHi, I'm KTPaul! How can I help you?\n\n")

    # Runs the RAG interaction loop
    if args.mode == "rag":
        chatbot.initialize_agent(agent_type="rag")
        while True:
            response, history = chatbot.rag_agent.query_agent(query=query)
            print(response)
            query = input("\n")

    # Runs the ReAct interaction loop
    elif args.mode == "react":
        chatbot.initialize_agent(agent_type="react")
        while True:
            response, history = chatbot.react_agent.query_agent(query=query)
            print(response)
            query = input("\n")
