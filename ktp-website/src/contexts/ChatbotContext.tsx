import { createContext, useReducer, Dispatch } from "react";

type ChatbotContext = [State, Dispatch<Action>];

export const ChatbotContext = createContext<ChatbotContext | undefined>(
    undefined
);

const initialState = {
    history: [
        { role: "assistant", content: "Hi, I'm KTPaul! How can I help you?" },
    ],
    openDrawer: false,
};

type Message = {
    role: string;
    content: string;
};

type State = {
    history: Message[];
    openDrawer: boolean;
};

type Action =
    | { type: "setHistory"; payload: { history: Message[] } }
    | { type: "openDrawer" }
    | { type: "closeDrawer" }
    | { type: "clearConversation" }
    | { type: "reset" };

function ChatbotReducer(state: State, action: Action) {
    switch (action.type) {
        case "setHistory":
            return {
                ...state,
                history: action.payload.history,
            };
        case "openDrawer":
            return {
                ...state,
                openDrawer: true,
            };
        case "closeDrawer":
            return {
                ...state,
                openDrawer: false,
            };
        case "clearConversation":
            return {
                ...initialState,
                openDrawer: true,
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
