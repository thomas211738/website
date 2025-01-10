import { createContext, useReducer, Dispatch } from "react";

type ChatbotContext = [State, Dispatch<Action>];

export const ChatbotContext = createContext<ChatbotContext | undefined>(
    undefined
);

type Message = {
    role: string;
    content: string;
};

type State = {
    query: string;
    agent: "rag" | "react";
    rag_history: Message[];
    react_history: Message[];
    openChatbotDrawer: boolean;
};

const initialState: State = {
    query: "",
    agent: "rag",
    rag_history: [
        { role: "assistant", content: "Hi, I'm KTPaul! How can I help you?" },
    ],
    react_history: [
        {
            role: "system",
            content:
                "You are a helpful chatbot assistant. Answer questions as related to Kappa Theta Pi (KTP) using the given tools. Do not answer questions that you do not have information about.",
        },
        { role: "assistant", content: "Hi, I'm KTPaul! How can I help you?" },
    ],
    openChatbotDrawer: false,
};

type Action =
    | { type: "setQuery"; payload: { query: string } }
    | { type: "setAgent"; payload: { agent: "rag" | "react" } }
    | { type: "setRAGHistory"; payload: { history: Message[] } }
    | { type: "setReActHistory"; payload: { history: Message[] } }
    | { type: "openChatbotDrawer" }
    | { type: "closeChatbotDrawer" }
    | { type: "clearConversation" }
    | { type: "reset" };

function ChatbotReducer(state: State, action: Action) {
    switch (action.type) {
        case "setQuery":
            return {
                ...state,
                query: action.payload.query,
            };
        case "setAgent":
            return {
                ...state,
                agent: action.payload.agent,
            };
        case "setRAGHistory":
            return {
                ...state,
                rag_history: action.payload.history,
            };
        case "setReActHistory":
            return {
                ...state,
                react_history: action.payload.history,
            };
        case "openChatbotDrawer":
            return {
                ...state,
                openChatbotDrawer: true,
            };
        case "closeChatbotDrawer":
            return {
                ...state,
                openChatbotDrawer: false,
            };
        case "clearConversation":
            return {
                ...initialState,
                query: "",
                openChatbotDrawer: true,
            };
        case "reset":
            return initialState;
        default:
            return state;
    }
}

interface ChatbotProviderProps {
    children: React.ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
    const [state, dispatch] = useReducer(ChatbotReducer, initialState);

    return (
        <ChatbotContext.Provider value={[state, dispatch]}>
            {children}
        </ChatbotContext.Provider>
    );
};

export default ChatbotProvider;
