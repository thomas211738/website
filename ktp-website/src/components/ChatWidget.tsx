import { useContext } from "react";
import { Box, Drawer } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import Chatbot from "./Chatbot";

import { ChatbotContext } from "../contexts/ChatbotContext";

const ChatbotWidget = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("Chatbot must be used within a ChatbotProvider");
    }
    const [state, dispatch] = context;
    return (
        <div>
            <button
                onClick={() =>
                    dispatch({
                        type: "openDrawer",
                    })
                }
            >
                <ChatIcon />
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
                <Box sx={{ width: 500 }}>
                    <Chatbot />
                </Box>
            </Drawer>
        </div>
    );
};

export default ChatbotWidget;
