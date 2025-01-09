import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Popover } from "@mui/material";
import ChatbotDialog from "./ChatbotDialog";

import { ChatbotContext } from "../contexts/ChatbotContext";

const chatbot_backend = import.meta.env.VITE_CHATBOT_FUNCTION_URL;

const Chatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("Chatbot must be used within a ChatbotProvider");
    }
    const [state, dispatch] = context;
    const [loading, setLoading] = useState(false);

    /* Queries the chatbot */
    const queryChatbot = async () => {
        try {
            if (state.query.trim() === "") {
                return;
            }
            setSubmitAnchorEl(null);
            setLoading(true);
            const response = await axios.post(`${chatbot_backend}`, {
                query: state.query,
                history: state.history,
            });
            console.log(response);
            dispatch({
                type: "setQuery",
                payload: { query: "" },
            });
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

    /* Adjusts query input textbox sizing */
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to content's scrollHeight
        }
    }, [state.query]);

    /* Adjusts auto-scroll to end of conversation */
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [state.history]);

    /* Return key to submit, shift key + return key to go to new line */
    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            queryChatbot();
        }
    };

    /* Handles submit button popover */
    const [submitAnchorEl, setSubmitAnchorEl] = useState<HTMLElement | null>(
        null
    );
    const handleSubmitPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
            return;
        }
        setSubmitAnchorEl(event.currentTarget);
    };
    const handleSubmitPopoverClose = () => {
        setSubmitAnchorEl(null);
    };
    const submitPopover = Boolean(submitAnchorEl);

    return (
        <div>
            {/* Chatbot window header */}
            <div className="p-2 flex justify-between align-middle sticky top-0 z-10 bg-ktp-darkblue">
                <button
                    onClick={() =>
                        dispatch({
                            type: "closeDrawer",
                        })
                    }
                >
                    <CloseIcon fontSize="large" sx={{ color: "white" }} />
                </button>
                <h2 className="my-auto text-3xl text-white">KTPaul</h2>
                <span className="my-auto px-2 text-lg text-ktp-lightgreen font-semibold uppercase rounded-lg">
                    Beta
                </span>
            </div>

            <p className="w-fit mx-auto mt-4 text-red-500">
                Experimental - please double check responses.
            </p>

            {/* Chatbot window conversation history */}
            <div className={`mx-8 ${loading ? "mt-4" : "my-4"}`}>
                {state.history.map((message, index) => (
                    <div
                        key={index}
                        className={`w-fit max-w-4/5 my-1 py-1 flex ${
                            message.role === "user" &&
                            "ml-auto px-2 justify-end rounded-md bg-ktp-lightblue"
                        }`}
                    >
                        {message.role === "assistant" && (
                            <SmartToyIcon className="mr-2" />
                        )}
                        {message.content}
                    </div>
                ))}
            </div>

            {!loading ? (
                /* Displays query input textbox and chatbot actions if not loading response */
                <div className="mx-8 my-4 flex flex-col sticky bottom-4 z-10 rounded-md bg-gray-100">
                    {/* Query input textbox */}
                    <textarea
                        ref={textareaRef}
                        id="chatbot-query"
                        className="w-full px-3 py-2 resize-none overflow-hidden border-top rounded-md focus:outline-none focus:border-none bg-gray-100"
                        placeholder="Message KTPaul"
                        value={state.query}
                        onChange={(e) =>
                            dispatch({
                                type: "setQuery",
                                payload: { query: e.target.value },
                            })
                        }
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    {/* Chatbot actions */}
                    <div className="px-2 flex justify-between">
                        <div className="flex">
                            <ChatbotDialog action="clearConversation" />
                            <ChatbotDialog action="downloadTranscript" />
                        </div>

                        {/* Displays submit action if query present */}
                        {state.query !== "" && (
                            <>
                                <button
                                    className="w-fit m-1 rounded-md hover:bg-gray-300"
                                    type="submit"
                                    onClick={queryChatbot}
                                    aria-owns={
                                        submitPopover
                                            ? "mouse-over-popover"
                                            : undefined
                                    }
                                    aria-haspopup="true"
                                    onMouseEnter={handleSubmitPopoverOpen}
                                    onMouseLeave={handleSubmitPopoverClose}
                                    onTouchStart={(e) => e.preventDefault()}
                                >
                                    <ArrowUpwardIcon />
                                </button>
                                <Popover
                                    id="mouse-over-popover"
                                    sx={{ pointerEvents: "none" }}
                                    open={submitPopover}
                                    anchorEl={submitAnchorEl}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    onClose={handleSubmitPopoverClose}
                                    disableRestoreFocus
                                >
                                    <p className="p-2">Submit</p>
                                </Popover>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                /* Displays loading icon if loading response */
                <div className="mx-8 mb-4">
                    <div className="w-fit max-w-sm ml-auto my-1 px-2 py-1 flex justify-end rounded-md bg-ktp-lightblue">
                        {state.query}
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

            <div ref={messagesEndRef} />
        </div>
    );
};

export default Chatbot;
