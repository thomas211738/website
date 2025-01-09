from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import pandas as pd
from pinecone import Pinecone

load_dotenv()


def get_info() -> pd.DataFrame:
    """Reads the source data.

    Returns:
        info (pd.DataFrame): the source data, formatted as a dataframe with columns "id", "sources", and "metadata".
    """

    info = pd.read_json("./info.json")

    return info


def create_document_embeddings(info: pd.DataFrame, pc: Pinecone) -> tuple[list, list]:
    """Converts the source data into vector embeddings for Pinecone.

    Args:
        info (pd.DataFrame): the source data, formatted as a dataframe with columns "id", "sources", and "metadata".
        pc (Pinecone): an instance of the Pinecone class.

    Returns:
        tuple: A tuple containing two elements:
            - records (list): the vector embeddings of the source data.
    """

    # Chunks the source data
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,
        chunk_overlap=20,
    )

    # Reformats the source data
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

    # Creates vector embeddings of the source data
    embeddings = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[d["text"] for d in data],
        parameters={"input_type": "passage", "truncate": "END"},
    )

    # Reformats the embeddings for Pinecone
    records = []
    for d, e in zip(data, embeddings):
        d["metadata"].update({"text": d["text"]})
        records.append(
            {
                "id": d["name"],
                "values": e["values"],
                "metadata": d["metadata"],
            }
        )

    return records


def update_pinecone(records: list, pc: Pinecone):
    """Updates the vector embeddings in Pinecone.

    Args:
        records (list): the vector embeddings of the source data.
        pc: (Pinecone): an instance of the Pinecone class.

    Returns:
        None: no return value.
    """

    try:
        # Connects to Pinecone
        index = pc.Index(host=os.environ["PINECONE_HOST"])

        # Deletes the old vector embeddings in Pinecone
        index.delete(delete_all=True)
        print("Successfully deleted old vector embeddings in Pinecone")

        # Upserts the new vector embeddings in Pinecone
        upsert_response = index.upsert(vectors=records)
        print(
            f'Successfully upserted {upsert_response["upserted_count"]} vector embeddings in Pinecone'
        )
    except Exception as e:
        print(f"Failed to update vector embeddings in Pinecone: {e}")
        raise e


if __name__ == "__main__":

    # Reads the document source data
    info = get_info()

    # Creates vector embeddings for Pinecone
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    records = create_document_embeddings(info=info, pc=pc)

    # Updates the vector embeddings in Pinecone
    update_pinecone(records=records, pc=pc)
