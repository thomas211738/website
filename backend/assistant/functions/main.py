from dotenv import load_dotenv
from firebase_functions import https_fn, options
from huggingface_hub import InferenceClient
import json
from langchain_huggingface import HuggingFaceEmbeddings
import os
from pinecone import Pinecone
import psutil


load_dotenv()


class KTPaul:

    def __init__(
        self,
        huggingface_token: str = None,
        pinecone_api_key: str = None,
        pinecone_host: str = None,
        history: list = None,
        memory: bool = False,
        verbose: bool = False,
    ):

        self.huggingface_token = huggingface_token or os.getenv("HUGGINGFACE_TOKEN")
        self.pinecone_api_key = pinecone_api_key or os.getenv("PINECONE_API_KEY")
        self.pinecone_host = pinecone_host or os.getenv("PINECONE_HOST")

        self.pc = None
        self.index = None
        self.chat_client = None
        self.embeddings_model = None

        self.embed_model = "sentence-transformers/all-MiniLM-L6-v2"
        self.top_k = 4

        self.history = (
            history[-10:]
            if history
            else [
                {"role": "assistant", "content": "Hi, I'm KTPaul! How can I help you?"}
            ]
        )

        self.memory = memory
        self.verbose = verbose

        if self.memory:
            self.check_memory_usage("after chatbot initialization")

    def check_memory_usage(self, stage: str = "Unknown stage"):

        process = psutil.Process()
        memory_info = process.memory_info()
        print(f"Memory usage {stage}: {memory_info.rss / (1024 ** 2)} MB")

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

        if self.memory:
            self.check_memory_usage("after chat client initialization")

        return self.chat_client

    def get_embeddings_model(self):

        if self.embeddings_model is None:
            self.embeddings_model = HuggingFaceEmbeddings(model_name=self.embed_model)

        if self.memory:
            self.check_memory_usage("after embeddings model initialization")

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

            if self.memory:
                self.check_memory_usage("after retrieving context")

            del results, query_embedding

            if self.verbose:
                print(f"\nContext: \n{context}\n")

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

        prompt_history = self.history[:]
        prompt_history.append({"role": "user", "content": enhanced_query})

        response = self.get_chat_client().chat_completion(
            messages=prompt_history, max_tokens=200
        )

        if self.memory:
            self.check_memory_usage("after generating response")

        del prompt_history

        response = response.choices[0].message.content

        self.history.extend(
            [
                {"role": "user", "content": query},
                {"role": "assistant", "content": response},
            ]
        )
        self.history = self.history[-10:]

        return response

    def query_agent(self, query: str) -> str:

        try:
            context = self.retrieve_context(query=query)
            response = self.generate_response(query=query, context=context)

            if self.memory:
                self.check_memory_usage("after querying agent")

            del context

            return response, self.history
        except Exception as e:
            print(e)
            return (
                "I am struggling to come up with an appropriate response. Please try again.",
                self.history,
            )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["get", "post"],
    ),
    timeout_sec=15,
    memory=options.MemoryOption.GB_1,
    min_instances=1,
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
        response, history = chatbot.query_agent(query=query)

        return https_fn.Response(
            json.dumps(
                {
                    "response": response,
                    "history": history,
                }
            ),
            content_type="application/json",
            status=200,
        )
    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}), status=500, content_type="application/json"
        )
