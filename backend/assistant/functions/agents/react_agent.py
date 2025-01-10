from dotenv import load_dotenv
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
