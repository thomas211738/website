import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Popover from "@mui/material/Popover";

import { ChatbotContext } from "../contexts/ChatbotContext";

const chatbot_backend = import.meta.env.VITE_CHATBOT_FUNCTION_URL;

const Chatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("Chatbot must be used within a ChatbotProvider");
    }
    const [state, dispatch] = context;
    const [loading, setLoading] = useState(false);

    const queryChatbot = async () => {
        try {
            if (query.trim() === "") {
                return;
            }
            setLoading(true);
            const response = await axios.post(`${chatbot_backend}`, {
                query: query,
                history: state.history,
            });
            console.log(response);
            setQuery("");
            setLoading(false);

            dispatch({
                type: "setHistory",
                payload: { history: response.data.history },
            });
            console.log(state.history);
        } catch (error) {
            setLoading(false);
            console.error("Error querying the chatbot:", error);
        }
    };

    const [query, setQuery] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to content's scrollHeight
        }
    }, [query]);
    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            queryChatbot();
        }
    };

    const clearConversation = () => {
        dispatch({
            type: "clearConversation",
        });
        setQuery("");
        console.log("Cleared chatbot conversation");
    };

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const clearConversationPopover = Boolean(anchorEl);

    return (
        <div>
            <div className="p-2 flex justify-between align-middle bg-[#234c8b]">
                <button
                    onClick={() =>
                        dispatch({
                            type: "closeDrawer",
                        })
                    }
                >
                    <ArrowBackIcon sx={{ color: "white" }} />
                </button>
                <h2 className="text-xl text-white">KTPaul</h2>
                <SmartToyIcon sx={{ color: "white" }} />
            </div>

            <div className={`mx-8 ${loading ? "mt-4" : "my-4"}`}>
                {state.history.map((message, index) => (
                    <div
                        key={index}
                        className={`w-fit max-w-sm my-1 py-1 flex ${
                            message.role === "user" &&
                            "ml-auto px-2 justify-end rounded-md bg-[#8bb9ff]"
                        } columns-1`}
                    >
                        {message.role === "assistant" && (
                            <SmartToyIcon className="mr-2" />
                        )}
                        {message.content}
                    </div>
                ))}
            </div>

            {!loading ? (
                <div className="mx-8 my-4 flex flex-col rounded-md bg-gray-100">
                    <textarea
                        ref={textareaRef}
                        id="chatbot-query"
                        className="w-full px-3 py-2 resize-none overflow-hidden border-top rounded-md focus:outline-none focus:border-none bg-gray-100"
                        placeholder="Message KTPaul"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    >
                        <ArrowUpwardIcon />
                    </textarea>

                    <div className="px-2 flex justify-between">
                        <button
                            className="w-fit m-1 rounded-md hover:bg-gray-300"
                            type="reset"
                            onClick={clearConversation}
                            aria-owns={
                                clearConversationPopover
                                    ? "mouse-over-popover"
                                    : undefined
                            }
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        >
                            <DeleteSweepIcon />
                        </button>
                        <Popover
                            id="mouse-over-popover"
                            sx={{ pointerEvents: "none" }}
                            open={clearConversationPopover}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <p className="p-2">Clear conversation</p>
                        </Popover>
                        <button
                            className="w-fit m-1 rounded-md hover:bg-gray-300"
                            type="submit"
                            onClick={queryChatbot}
                        >
                            <ArrowUpwardIcon />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mx-8 mb-4">
                    <div className="w-fit max-w-sm ml-auto my-1 px-2 py-1 flex justify-end rounded-md bg-[#8bb9ff]">
                        {query}
                    </div>
                    <div className="w-fit max-w-sm my-1 py-1 flex align-top">
                        <SmartToyIcon className="mr-2" />
                        <ThreeDots
                            visible={true}
                            height="25"
                            width="50"
                            color="#000000"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
