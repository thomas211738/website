from bot import KTPaul
import pandas as pd


def get_info():

    info = pd.read_json("./info.json")

    return info


if __name__ == "__main__":

    info = get_info()

    chatbot = KTPaul()
    data, records = chatbot.create_document_embeddings(info=info)

    chatbot.update_mongodb(data=data)

    chatbot.update_pinecone(records=records)
