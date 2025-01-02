from functions.main import KTPaul

if __name__ == "__main__":

    # Initializes the chatbot
    chatbot = KTPaul()
    query = input("\nHi, I'm KTPaul! How can I help you?\n\n")

    # Runs chatbot interaction loop
    while True:
        response = chatbot.query_chatbot(query=query)
        print(response)
        query = input("\n")
