from dotenv import load_dotenv
import gc
from huggingface_hub import InferenceClient
from langchain_huggingface import HuggingFaceEmbeddings
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

        self.huggingface_token = huggingface_token or os.getenv("HUGGINGFACE_TOKEN")
        self.pinecone_api_key = pinecone_api_key or os.getenv("PINECONE_API_KEY")
        self.pinecone_host = pinecone_host or os.getenv("PINECONE_HOST")

        self.pc = None
        self.index = None
        self.chat_client = None
        self.embeddings_model = None

        self.embed_model = "sentence-transformers/all-mpnet-base-v2"
        self.top_k = top_k or 4

        self.history = tuple(
            history[-10:]
            if history
            else [
                {"role": "assistant", "content": "Hi, I'm KTPaul! How can I help you?"}
            ]
        )

    def get_pc(self):

        if self.pc is None:
            self.pc = Pinecone(api_key=self.pinecone_api_key)

        return self.pc

    def get_index(self):

        if self.index is None:
            self.index = self.get_pc().Index(host=self.pinecone_host)

        return self.index

    def get_chat_client(self):

        if self.chat_client is None:
            self.chat_client = InferenceClient(
                token=self.huggingface_token,
                model="meta-llama/Meta-Llama-3-8B-Instruct",
            )

        return self.chat_client

    def get_embeddings_model(self):

        if self.embeddings_model is None:
            self.embeddings_model = HuggingFaceEmbeddings(model_name=self.embed_model)

        return self.embeddings_model

    def retrieve_context(self, query: str) -> str:

        try:
            query_embedding = self.get_embeddings_model().embed_query(text=query)

            results = self.get_index().query(
                vector=query_embedding,
                top_k=self.top_k,
                include_metadata=True,
            )

            context = "\n".join(
                document["metadata"]["text"] for document in results["matches"]
            )

            del results, query_embedding
            gc.collect()

            return context
        except Exception as e:
            print(f"Failed to retrieve contextual documents from Pinecone: {e}")
            raise e

    def generate_response(self, query: str, context: str) -> str:

        enhanced_query = f"""Answer the following query as related to Kappa Theta Pi (KTP), \
                            the professional technology fraternity. DO NOT INCLUDE \
                            INFORMATION THAT IS NOT PRESENT IN THE GIVEN CONTEXT. DO NOT \
                            INCLUDE INFORMATION NOT RELATED TO KTP. No need to cite the \
                            context. Do not use any special formatting like bullets or \
                            markdown. Provide the response as plain text only. PROVIDE
                            AS MUCH DETAIL AS POSSIBLE FROM THE CONTEXT.\n \
                            \nQUERY:\n{query}\n\nCONTEXT:\n{context}"""

        prompt_history = list(self.history)
        prompt_history.append({"role": "user", "content": enhanced_query})

        response = self.get_chat_client().chat_completion(
            messages=prompt_history, max_tokens=200
        )

        self.history = tuple(
            list(self.history)
            + [
                {"role": "user", "content": query},
                {"role": "assistant", "content": response.choices[0].message.content},
            ]
        )[-10:]

        response = response.choices[0].message.content

        del prompt_history
        gc.collect()

        return response

    def query_agent(self, query: str) -> str:

        try:
            context = self.retrieve_context(query=query)
            response = self.generate_response(query=query, context=context)

            del context
            gc.collect()

            return response, self.history
        except Exception as e:
            print(e)
            return (
                "I am struggling to come up with an appropriate response. Please try again.",
                self.history,
            )
