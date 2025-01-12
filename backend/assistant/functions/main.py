from dotenv import load_dotenv
from firebase_functions import https_fn, options
import json
import os

from agents.rag_agent import CustomRAGAgent
from agents.react_agent import CustomReActAgent


load_dotenv()


class KTPaul:

    def __init__(
        self,
        huggingface_token: str = None,
        pinecone_api_key: str = None,
        pinecone_host: str = None,
        top_k: int = None,
        history: list = None,
        verbose: bool = False,
    ):
        self.huggingface_token = huggingface_token or os.getenv("HUGGINGFACE_TOKEN")
        self.pinecone_api_key = pinecone_api_key or os.getenv("PINECONE_API_KEY")
        self.pinecone_host = pinecone_host or os.getenv("PINECONE_HOST")
        self.top_k = top_k or 4
        self.history = history
        self.verbose = verbose

        self.rag_agent = None
        self.react_agent = None

    def initialize_agent(self, agent_type):

        assert agent_type in ["rag", "react"]

        if agent_type == "rag" and self.rag_agent is None:
            self.rag_agent = CustomRAGAgent(
                huggingface_token=self.huggingface_token,
                pinecone_api_key=self.pinecone_api_key,
                pinecone_host=self.pinecone_host,
                top_k=self.top_k,
                history=self.history,
            )
        elif agent_type == "react" and self.react_agent is None:
            self.react_agent = CustomReActAgent(
                huggingface_token=self.huggingface_token,
                pinecone_api_key=self.pinecone_api_key,
                pinecone_host=self.pinecone_host,
                top_k=self.top_k,
                history=self.history,
                verbose=self.verbose,
            )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["get", "post"],
    ),
    timeout_sec=30,
    memory=options.MemoryOption.GB_1,
)
def rag_handler(req: https_fn.Request) -> https_fn.Response:

    try:
        if req.method == "POST":
            body = req.get_json()
            query = body.get("query")
            history = body.get("history", [])
        else:
            query = req.args.get("query")
            history = req.args.get("history", [])

        if query is None or not isinstance(query, str) or not query.strip():
            return https_fn.Response("Invalid query parameter", status=400)
        if not isinstance(history, list):
            return https_fn.Response("Invalid history parameter", status=400)

        chatbot = KTPaul(history=history)
        chatbot.initialize_agent(agent_type="rag")
        response = chatbot.rag_agent.query_agent(query=query)

        return https_fn.Response(
            json.dumps(
                {
                    "response": response,
                    "history": chatbot.rag_agent.history,
                }
            ),
            content_type="application/json",
            status=200,
        )
    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}), status=500, content_type="application/json"
        )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["get", "post"],
    ),
    timeout_sec=30,
    memory=options.MemoryOption.GB_1,
)
def react_handler(req: https_fn.Request) -> https_fn.Response:

    try:
        if req.method == "POST":
            body = req.get_json()
            query = body.get("query")
            history = body.get("history", [])
        else:
            query = req.args.get("query")
            history = req.args.get("history", [])

        if query is None or not isinstance(query, str) or not query.strip():
            return https_fn.Response("Invalid query parameter", status=400)
        if not isinstance(history, list):
            return https_fn.Response("Invalid history parameter", status=400)

        chatbot = KTPaul(history=history)
        chatbot.initialize_agent(agent_type="react")
        response = chatbot.react_agent.query_agent(query=query)

        return https_fn.Response(
            json.dumps(
                {
                    "response": response,
                    "history": chatbot.react_agent.history,
                }
            ),
            content_type="application/json",
            status=200,
        )
    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}), status=500, content_type="application/json"
        )
