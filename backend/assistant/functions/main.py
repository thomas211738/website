from dotenv import load_dotenv
from firebase_functions import https_fn, options
from huggingface_hub import InferenceClient
import json
from llama_index.core import VectorStoreIndex
from llama_index.core.agent import ReActAgent
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.tools import ToolMetadata, QueryEngineTool
from llama_index.core.vector_stores.types import (
    FilterCondition,
    FilterOperator,
    MetadataFilter,
    MetadataFilters,
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI
from llama_index.vector_stores.pinecone import PineconeVectorStore
import os
from pinecone import Pinecone


load_dotenv()


class CustomRAGAgent:

    def __init__(
        self,
        huggingface_token: str = None,
        pinecone_api_key: str = None,
        pinecone_host: str = None,
        top_k: int = None,
        history: list = None,
    ):

        self.huggingface_token = huggingface_token or os.environ.get(
            "HUGGINGFACE_TOKEN"
        )
        self.pinecone_api_key = pinecone_api_key or os.environ.get("PINECONE_API_KEY")
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        self.pinecone_host = pinecone_host or os.environ.get("PINECONE_HOST")
        self.index = self.pc.Index(host=self.pinecone_host)
        self.chat_client = InferenceClient(
            token=self.huggingface_token, model="meta-llama/Meta-Llama-3-8B-Instruct"
        )
        self.embed_model = "multilingual-e5-large"
        self.top_k = top_k or 5
        self.history = (
            history[-10:]
            if history
            else [
                {"role": "assistant", "content": "Hi, I'm KTPaul! How can I help you?"}
            ]
        )

    def retrieve_context(self, query: str) -> str:

        try:
            query_embedding = self.pc.inference.embed(
                model=self.embed_model,
                inputs=[query],
                parameters={"input_type": "query"},
            )
            results = self.index.query(
                vector=query_embedding[0].values,
                top_k=self.top_k,
                include_metadata=True,
            )

            context_documents = [
                document["metadata"]["text"] for document in results["matches"]
            ]
            context = ""
            for c in context_documents:
                context += f"\n{c}\n"
        except Exception as e:
            print(f"Failed to retrieve contextual documents from Pinecone: {e}")
            raise e

        return context

    def generate_response(self, query: str, context: str) -> str:

        enhanced_query = f"""Only answer the query as related to Kappa Theta Pi (KTP), \
                            the professional technology fraternity, based on the included \
                            context if possible. Do not include information that is not \
                            related to KTP. No need to cite the context. Do not use any \
                            special formatting like bullets or markdown. Provide the \
                            response as plain text only.\n \
                            \nQUERY:\n{query}\n\nCONTEXT:\n{context}"""

        prompt_history = self.history.copy()
        prompt_history.append({"role": "user", "content": enhanced_query})

        response = self.chat_client.chat_completion(
            messages=prompt_history, max_tokens=200
        )

        self.history.extend(
            [
                {"role": "user", "content": query},
                {
                    "role": "assistant",
                    "content": response.choices[0].message.content,
                },
            ]
        )

        return response.choices[0].message.content

    def query_agent(self, query: str) -> str:

        try:
            context = self.retrieve_context(query=query)
            response = self.generate_response(query=query, context=context)

            return response, self.history
        except Exception as e:
            print(e)
            return (
                "I am struggling to come up with an appropriate response. Please try again.",
                self.history,
            )


class CustomReActAgent:

    def __init__(
        self,
        huggingface_token: str = None,
        pinecone_api_key: str = None,
        pinecone_host: str = None,
        top_k: int = None,
        history: list = None,
        verbose: bool = False,
    ):

        self.huggingface_token = huggingface_token or os.environ.get(
            "HUGGINGFACE_TOKEN"
        )
        self.llm = HuggingFaceInferenceAPI(
            model_name="meta-llama/Meta-Llama-3-8B-Instruct",
            token=os.environ.get("HUGGINGFACE_TOKEN"),
        )

        self.pinecone_api_key = pinecone_api_key or os.environ.get("PINECONE_API_KEY")
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        self.pinecone_host = pinecone_host or os.environ.get("PINECONE_HOST")
        self.index = self.pc.Index(host=self.pinecone_host)
        self.vector_store = PineconeVectorStore(pinecone_index=self.index)
        self.embed_model = HuggingFaceEmbedding(
            model_name="intfloat/multilingual-e5-large"
        )
        self.query_index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store, embed_model=self.embed_model
        )
        self.top_k = top_k or 4

        self.history = (
            history[-10:]
            if history
            else [
                ChatMessage(
                    role=MessageRole.SYSTEM,
                    content="You are a helpful chatbot assistant. Answer questions as related to Kappa Theta Pi (KTP) using the given tools. Do not answer questions that you do not have information about.",
                ),
                ChatMessage(
                    role=MessageRole.CHATBOT,
                    content="Hi, I'm KTPaul! How can I help you?",
                ),
            ]
        )

        self.verbose = verbose

        self.accomplishments_query_tool = self.create_query_tool(
            name="accomplishments_tool",
            description=(
                "Provides detailed information about KTP accomplishments"
                "Use this tool for queries about KTP accomplishments."
                "Use a detailed plain text question as input to the tool, based on the user query."
            ),
            filter_params=[{"key": "topic", "value": "accomplishments_info"}],
        )
        self.events_query_tool = self.create_query_tool(
            name="events_tool",
            description=(
                "Provides detailed information about KTP events"
                "Use this tool for queries about KTP events."
                "Use a detailed plain text question as input to the tool, based on the user query."
            ),
            filter_params=[{"key": "topic", "value": "events_info"}],
        )
        self.fraternity_info_query_tool = self.create_query_tool(
            name="fraternity_info_tool",
            description=(
                "Provides general information about Kappa Theta Pi (KTP)."
                "Use this tool for general queries about KTP."
                "Use a detailed plain text question as input to the tool, based on the user query."
            ),
            filter_params=[{"key": "topic", "value": "fraternity_info"}],
        )
        self.recruitment_query_tool = self.create_query_tool(
            name="recruitment_tool",
            description=(
                "Provides detailed information about KTP recruitment"
                "Use this tool for queries about KTP recruitment."
                "Use a detailed plain text question as input to the tool, based on the user query."
            ),
            filter_params=[{"key": "topic", "value": "recruitment_info"}],
        )
        self.tools = [
            self.accomplishments_query_tool,
            self.events_query_tool,
            self.fraternity_info_query_tool,
            self.recruitment_query_tool,
        ]

    def create_query_tool(self, name, description, filter_params):

        filters = MetadataFilters(
            filters=[
                MetadataFilter(
                    key=param["key"],
                    value=param["value"],
                    operator=param.get("operator", FilterOperator.EQ),
                )
                for param in filter_params
            ],
            condition=FilterCondition.AND,
        )

        query_engine = self.query_index.as_query_engine(
            llm=self.llm,
            verbose=self.verbose,
            filters=filters,
            similarity_top_k=self.top_k,
        )

        return QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(name=name, description=description),
        )

    def create_react_agent(self, tools, llm):

        return ReActAgent.from_tools(
            tools=tools,
            llm=llm,
            verbose=self.verbose,
        )

    def query_agent(self, query: str) -> str:

        try:
            agent = self.create_react_agent(tools=self.tools, llm=self.llm)
            response = agent.chat(chat_history=self.history, message=query)

            self.history.extend(
                [
                    ChatMessage(
                        role=MessageRole.USER,
                        content=query,
                    ),
                    ChatMessage(
                        role=MessageRole.CHATBOT,
                        content=response,
                    ),
                ]
            )

            return response, self.history
        except Exception as e:
            print(e)
            return (
                "I am struggling to come up with an appropriate response. Please try again.",
                self.history,
            )


class KTPaul:

    def __init__(
        self,
        huggingface_token: str = None,
        pinecone_api_key: str = None,
        pinecone_host: str = None,
        top_k: int = None,
        rag_history: list = None,
        react_history: list = None,
        verbose: bool = False,
    ):
        self.huggingface_token = huggingface_token or os.environ.get(
            "HUGGINGFACE_TOKEN"
        )
        self.pinecone_api_key = pinecone_api_key or os.environ.get("PINECONE_API_KEY")
        self.pinecone_host = pinecone_host or os.environ.get("PINECONE_HOST")

        self.top_k = top_k or 5

        self.rag_history = (
            rag_history[-5:]
            if rag_history
            else [
                {"role": "assistant", "content": "Hi, I'm KTPaul! How can I help you?"}
            ]
        )
        self.react_history = (
            react_history[-5:]
            if react_history
            else [
                ChatMessage(
                    role=MessageRole.SYSTEM,
                    content="You are a helpful chatbot assistant. Answer questions as related to Kappa Theta Pi (KTP) using the given tools. Do not answer questions that you do not have information about.",
                ),
                ChatMessage(
                    role=MessageRole.CHATBOT,
                    content="Hi, I'm KTPaul! How can I help you?",
                ),
            ]
        )

        self.rag_agent = None
        self.react_agent = None

        self.verbose = verbose

    def initialize_agent(self, agent_type):

        assert agent_type in ["rag", "react"]

        if agent_type == "rag" and self.rag_agent is None:
            self.rag_agent = CustomRAGAgent(
                huggingface_token=self.huggingface_token,
                pinecone_api_key=self.pinecone_api_key,
                pinecone_host=self.pinecone_host,
                top_k=self.top_k,
                history=self.rag_history,
            )
        elif agent_type == "react" and self.react_agent is None:
            self.react_agent = CustomReActAgent(
                huggingface_token=self.huggingface_token,
                pinecone_api_key=self.pinecone_api_key,
                pinecone_host=self.pinecone_host,
                top_k=self.top_k,
                history=self.react_history,
                verbose=self.verbose,
            )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["get", "post"],
    ),
    memory=512,
)
def firebase_handler(req: https_fn.Request) -> https_fn.Response:

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

        chatbot = KTPaul(rag_history=history)
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
