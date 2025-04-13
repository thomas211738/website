import argparse
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import pandas as pd
from pinecone import Pinecone
from typing import Sequence

load_dotenv()


def get_info() -> pd.DataFrame:
    """Reads the source data.

    Returns:
        info (pd.DataFrame): the source data, formatted as a dataframe with columns "id", "sources", and "metadata".
    """

    info = pd.read_json("./info.json")

    return info


def create_document_embeddings(info: pd.DataFrame) -> Sequence[dict]:
    """Converts the source data into vector embeddings for Pinecone.

    Args:
        info (pd.DataFrame): the source data, formatted as a dataframe with columns "id", "sources", and "metadata".

    Returns:
        records (Sequence[dict]): the vector embeddings of the source data.
    """

    # Chunks the source data
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,
        chunk_overlap=20,
    )

    # Reformats the source data
    data = [
        {
            "name": f'{row["id"]}_{index}',
            "text": doc.page_content,
            "metadata": {
                **row["metadata"],
                "text": doc.page_content,
            },
        }
        for _, row in info.iterrows()
        for index, doc in enumerate(
            text_splitter.create_documents(texts=row["sources"])
        )
    ]

    # Creates the vector embeddings
    embeddings_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    embeddings = embeddings_model.embed_documents([d["text"] for d in data])

    # Reformats the embeddings for Pinecone
    records = []
    for d, e in zip(data, embeddings):
        d["metadata"]["text"] = d["text"]
        records.append(
            {
                "id": d["name"],
                "values": e,
                "metadata": d["metadata"],
            }
        )

    return records


def update_pinecone(records: Sequence, pc: Pinecone, insert_only: bool = False):
    """Updates the vector embeddings in Pinecone.

    Args:
        records (Sequence): the vector embeddings of the source data.
        pc: (Pinecone): an instance of the Pinecone class.
        insert_only (bool): specifies whether existing vectors should be deleted.

    Returns:
        None: no return value.
    """

    # Connects to Pinecone
    try:
        index = pc.Index(host=os.getenv("PINECONE_HOST"))
    except Exception as e:
        print("Failed to connect to Pinecone")
        raise e

    # Deletes the old vector embeddings in Pinecone
    try:
        if not insert_only:
            index.delete(delete_all=True)
            print("Successfully deleted old vector embeddings in Pinecone")
    except Exception as e:
        print(
            "Failed to delete old vector embeddings in Pinecone (if old embeddings do not exist, run the script with the -i flag)"
        )
        raise e

    # Upserts the new vector embeddings in Pinecone
    try:
        upsert_response = index.upsert(vectors=records)
        print(
            f'Successfully upserted {upsert_response["upserted_count"]} vector embeddings in Pinecone'
        )
    except Exception as e:
        print(f"Failed to upsert vector embeddings in Pinecone: {e}")
        raise e


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-i", "--insert-only", help="Only insert new vectors", action="store_true"
    )
    args = parser.parse_args()

    # Reads the document source data
    info = get_info()

    # Creates vector embeddings for Pinecone
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    records = create_document_embeddings(info=info)

    # Updates the vector embeddings in Pinecone
    update_pinecone(records=records, pc=pc, insert_only=args.insert_only)
