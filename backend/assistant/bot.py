from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import pandas as pd
from pinecone import Pinecone
from pymongo import MongoClient


load_dotenv()


class KTPaul:

    def __init__(
        self,
        huggingface_token: str = os.environ["huggingface_token"],
        pinecone_api_key: str = os.environ["pinecone_api_key"],
        pinecone_host: str = os.environ["pinecone_host"],
    ):

        self.pc = Pinecone(api_key=pinecone_api_key)
        self.embedding_model = "multilingual-e5-large"
        self.index = self.pc.Index(host=pinecone_host)
        self.chat_client = InferenceClient(
            token=huggingface_token, model="meta-llama/Meta-Llama-3-8B-Instruct"
        )
        self.messages = []

    def create_document_embeddings(self, info: pd.DataFrame):

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=512,
            chunk_overlap=20,
        )

        data = []

        for _, row in info.iterrows():
            docs = text_splitter.create_documents(texts=row["sources"])
            for index, doc in enumerate(docs):
                data.append(
                    {
                        "name": f'{row["id"]}_{index}',
                        "text": doc.page_content,
                        "metadata": row["metadata"],
                    }
                )

        embeddings = self.pc.inference.embed(
            model="multilingual-e5-large",
            inputs=[d["text"] for d in data],
            parameters={"input_type": "passage", "truncate": "END"},
        )

        records = []
        for d, e in zip(data, embeddings):
            records.append(
                {
                    "id": d["name"],
                    "values": e["values"],
                    "metadata": d["metadata"],
                }
            )

        return data, records

    def update_mongodb(self, data: pd.DataFrame):

        try:
            with MongoClient(host=os.environ["assistant_mongoDBURL"]) as mongo_client:
                database = mongo_client["assistant"]
                rag_documents = database["rag_documents"]
                rag_documents.delete_many(filter={})
                print("Successfully deleted old documents in MongoDB")
                rag_documents.insert_many(data)
                print(f"Successfully inserted {len(data)} documents in MongoDB")
        except Exception as e:
            print(f"Failed to update documents in MongoDB: {e}")
            raise e

    def update_pinecone(self, records: list):

        try:
            self.index.delete(delete_all=True)
            print("Successfully deleted old vectors in Pinecone")
            upsert_response = self.index.upsert(vectors=records)
            print(
                f'Successfully upserted {upsert_response["upserted_count"]} vectors in Pinecone'
            )
        except Exception as e:
            print(f"Failed to update vectors in Pinecone: {e}")
            raise e

    def retrieve_context(self, query: str, top_k: int = 3):

        query_embedding = self.pc.inference.embed(
            model=self.embedding_model,
            inputs=[query],
            parameters={"input_type": "query"},
        )

        results = self.index.query(
            vector=query_embedding[0].values,
            top_k=top_k,
        )

        context_document_ids = [i["id"] for i in results["matches"]]
        try:
            with MongoClient(host=os.environ["assistant_mongoDBURL"]) as mongo_client:
                database = mongo_client["assistant"]
                rag_documents = database["rag_documents"]
                context_documents = rag_documents.find(
                    {"name": {"$in": context_document_ids}}
                )
                context = ""
                for c in context_documents:
                    context += f'\n{c["text"]}\n'
        except Exception as e:
            print(f"Failed to retrieve contextual documents from MongoDB: {e}")

        return context

    def generate_response(self, query: str, context: str):

        enhanced_query = f"""
                        Only answer the query as related to Kappa Theta Pi (KTP), the professional technology fraternity. No need to cite the context.
                        \nQUERY:\n {query}\n
                        \nCONTEXT:\n {context}
                        """

        message = {"role": "user", "content": enhanced_query}
        self.messages.append(message)
        response = self.chat_client.chat_completion(self.messages, max_tokens=250)

        return response


if __name__ == "__main__":

    chatbot = KTPaul()
    query = input("\nHi, I'm KTPaul! How can I help you?\n\n")

    while True:
        context = chatbot.retrieve_context(query=query)
        response = chatbot.generate_response(query=query, context=context)
        print(response.choices[0].message.content)
        query = input("\n")
