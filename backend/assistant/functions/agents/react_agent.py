from dotenv import load_dotenv
import gc
from llama_index.core import Settings, VectorStoreIndex
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

        self.huggingface_token = huggingface_token or os.getenv("HUGGINGFACE_TOKEN")
        self.pinecone_api_key = pinecone_api_key or os.getenv("PINECONE_API_KEY")
        self.pinecone_host = pinecone_host or os.getenv("PINECONE_HOST")

        self.llm = None
        self.pc = None
        self.index = None
        self.vector_store = None
        self.embed_model = None
        self.query_index = None

        self.top_k = top_k or 4
        self.verbose = verbose

        self.history = tuple(
            history[-10:]
            if history
            else [
                {
                    "role": "system",
                    "content": "You are a helpful chatbot assistant. Answer questions as related to Kappa Theta Pi (KTP) using the given tools. Do not answer questions that you do not have information about.",
                },
                {"role": "assistant", "content": "Hi, I'm KTPaul! How can I help you?"},
            ]
        )

        self.fraternity_info_query_tool = None
        self.recruitment_query_tool = None
        self.tools = None

    def get_llm(self):

        if self.llm is None:
            self.llm = HuggingFaceInferenceAPI(
                model_name="meta-llama/Meta-Llama-3-8B-Instruct",
                token=self.huggingface_token,
            )
            Settings.llm = self.llm

        return self.llm

    def get_pc(self):

        if self.pc is None:
            self.pc = Pinecone(api_key=self.pinecone_api_key)

        return self.pc

    def get_index(self):

        if self.index is None:
            self.index = self.get_pc().Index(host=self.pinecone_host)

        return self.index

    def get_vector_store(self):

        if self.vector_store is None:
            self.vector_store = PineconeVectorStore(pinecone_index=self.get_index())

        return self.vector_store

    def get_embed_model(self):

        if self.embed_model is None:
            self.embed_model = HuggingFaceEmbedding(
                model_name="sentence-transformers/all-mpnet-base-v2"
            )

        return self.embed_model

    def get_query_index(self):

        if self.query_index is None:
            self.query_index = VectorStoreIndex.from_vector_store(
                vector_store=self.get_vector_store(), embed_model=self.get_embed_model()
            )

        return self.query_index

    def get_tools(self):

        if self.tools is None:
            self.fraternity_info_query_tool = self.create_query_tool(
                name="fraternity_info_tool",
                description=(
                    "Provides general information about Kappa Theta Pi (KTP)."
                    "Use this tool for general queries about KTP."
                    "Use a detailed plain text as input to the tool, based on the user query."
                ),
                filter_params=[{"key": "topic", "value": "fraternity_info"}],
            )
            self.recruitment_query_tool = self.create_query_tool(
                name="recruitment_tool",
                description=(
                    "Provides detailed information about KTP recruitment and rush"
                    "Use this tool only for queries about KTP recruitment, rush, and joining the frat."
                    "Use detailed plain text as input to the tool, based on the user query."
                ),
                filter_params=[{"key": "topic", "value": "recruitment_info"}],
            )

            self.tools = [
                self.fraternity_info_query_tool,
                self.recruitment_query_tool,
            ]

        return self.tools

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

        query_engine = self.get_query_index().as_query_engine(
            llm=self.get_llm(),
            verbose=self.verbose,
            filters=filters,
            similarity_top_k=self.top_k,
        )

        return QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(name=name, description=description),
        )

    def create_react_agent(self):

        return ReActAgent.from_tools(
            tools=self.get_tools(),
            llm=self.get_llm(),
            verbose=self.verbose,
        )

    def query_agent(self, query: str) -> str:

        try:
            agent = self.create_react_agent()

            history = [
                (
                    ChatMessage(
                        role=MessageRole.SYSTEM,
                        content=message["content"],
                    )
                    if message["role"] == "system"
                    else (
                        ChatMessage(
                            role=MessageRole.USER,
                            content=message["content"],
                        )
                        if message["role"] == "user"
                        else ChatMessage(
                            role=MessageRole.CHATBOT,
                            content=message["content"],
                        )
                    )
                )
                for message in self.history
            ]

            response = agent.chat(chat_history=history, message=query)

            self.history = tuple(
                list(self.history)
                + [
                    {"role": "user", "content": query},
                    {"role": "assistant", "content": response},
                ]
            )[-10:]

            del agent, history
            gc.collect()

            return response, self.history
        except Exception as e:
            print(e)
            return (
                "I am struggling to come up with an appropriate response. Please try again.",
                self.history,
            )
