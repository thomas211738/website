from dotenv import load_dotenv
from huggingface_hub import InferenceClient
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
