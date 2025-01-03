import { useContext } from "react";
import { Box, Drawer } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Chatbot from "./Chatbot";

import { ChatbotContext } from "../contexts/ChatbotContext";

const ChatWidget = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("Chatbot must be used within a ChatbotProvider");
    }
    const [state, dispatch] = context;
    return (
        <div className="w-fit">
            <button
                className="p-1 border-2 rounded-xl border-ktp-darkblue bg-ktp-darkblue fixed bottom-8 right-8 z-10 hover:scale-105 hover:shadow-md"
                onClick={() =>
                    dispatch({
                        type: "openDrawer",
                    })
                }
            >
                <div className="w-fit p-1 flex justify-around">
                    <QuestionAnswerIcon sx={{ color: "white", fontSize: 25 }} />
                    <p className="hidden sm:inline ml-2 text-white">
                        QUESTIONS?
                    </p>
                </div>
            </button>
            <Drawer
                anchor="right"
                open={state.openDrawer}
                onClose={() =>
                    dispatch({
                        type: "closeDrawer",
                    })
                }
            >
                <Box className="w-screen max-w-[600px]">
                    <Chatbot />
                </Box>
            </Drawer>
        </div>
    );
};

export default ChatWidget;
