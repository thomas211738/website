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
    history: Message[];
    openChatbotDrawer: boolean;
};

const initialState: State = {
    query: "",
    history: [
        { role: "assistant", content: "Hi, I'm KTPaul! How can I help you?" },
    ],
    openChatbotDrawer: false,
};

type Action =
    | { type: "setQuery"; payload: { query: string } }
    | { type: "setHistory"; payload: { history: Message[] } }
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
        case "setHistory":
            return {
                ...state,
                history: action.payload.history,
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
