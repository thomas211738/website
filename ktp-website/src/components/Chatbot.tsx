import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { DialogActions, Popover } from "@mui/material";
import ChatbotDialog from "./ChatbotDialog";
import InfoIcon from "@mui/icons-material/Info";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { ChatbotContext } from "../contexts/ChatbotContext";

const rag_agent_url = import.meta.env.VITE_RAG_AGENT_FUNCTION_URL;

const Chatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("Chatbot must be used within a ChatbotProvider");
    }
    const [state, dispatch] = context;
    const [loading, setLoading] = useState(false);

    /* Handles the info menu */
    const [infoMenuAnchorEl, setInfoMenuAnchorEl] =
        useState<null | HTMLElement>(null);
    const infoOpen = Boolean(infoMenuAnchorEl);
    const handleInfoMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setInfoMenuAnchorEl(event.currentTarget);
    };
    const handleInfoMenuClose = () => {
        setInfoMenuAnchorEl(null);
    };

    /* Handles chatbot architecture dialog */
    const [architectureDialogOpen, setArchitectureDialogOpen] = useState(false);

    /* Handles chatbot feedback dialog */
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

    /* Queries the chatbot */
    const queryChatbot = async () => {
        try {
            if (state.query.trim() === "") {
                return;
            }
            setSubmitAnchorEl(null);
            setLoading(true);

            const response = await axios.post(`${rag_agent_url}`, {
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
                type: "appendHistory",
                payload: { history: response.data.history.slice(-2) },
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
            {/* Chatbot drawer header */}
            <div className="p-2 flex justify-between align-middle sticky top-0 z-10 bg-ktp-darkblue">
                <button
                    onClick={() =>
                        dispatch({
                            type: "closeChatbotDrawer",
                        })
                    }
                >
                    <CloseIcon
                        className="my-auto text-white hover:text-ktp-lightgreen"
                        fontSize="large"
                    />
                </button>
                <div className="flex">
                    <h2 className="my-auto px-1 text-3xl text-white">KTPaul</h2>
                    <span className="mt-auto px-1 text-lg text-ktp-lightgreen font-semibold uppercase rounded-lg">
                        Beta
                    </span>
                </div>

                {/* Chatbot info menu */}
                <button onClick={handleInfoMenuOpen}>
                    <InfoIcon
                        className={`my-auto ${
                            infoOpen ||
                            architectureDialogOpen ||
                            feedbackDialogOpen
                                ? "text-ktp-lightgreen"
                                : "text-white"
                        } hover:text-ktp-lightgreen`}
                        fontSize="large"
                    />
                </button>
                <Menu
                    id="settings-menu"
                    anchorEl={infoMenuAnchorEl}
                    open={infoOpen}
                    onClose={handleInfoMenuClose}
                    MenuListProps={{
                        "aria-labelledby": "info-button",
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleInfoMenuClose();
                            setArchitectureDialogOpen(true);
                        }}
                    >
                        Architecture
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleInfoMenuClose();
                            setFeedbackDialogOpen(true);
                        }}
                    >
                        Feedback
                    </MenuItem>
                </Menu>

                {/* Chatbot architecture dialog */}
                <Dialog
                    open={architectureDialogOpen}
                    onClose={() => setArchitectureDialogOpen(false)}
                    aria-labelledby="architecture-dialog-title"
                    aria-describedby="architecture-dialog-description"
                >
                    <DialogTitle id="architecture-dialog-title">
                        Architecture
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="architecture-dialog-description">
                            <p>
                                This chatbot was created using Retrieval
                                Augmented Generation (RAG). At its core, the
                                methodology follows 3 basic steps.
                            </p>
                            <ol className="mt-4 px-3 py-2 flex flex-col text-white bg-ktp-darkblue rounded-md">
                                <li className="my-1">
                                    1. KTP information is converted into vector
                                    embeddings offline and stored in Pinecone's
                                    vector database.
                                </li>
                                <li className="my-1">
                                    2. The user query is used to retrieve
                                    contextual information from Pinecone
                                    utilizing cosine similarity to determine
                                    semantic relevance.
                                </li>
                                <li className="my-1">
                                    3. The retrieved context and the user query
                                    are both passed into the Llama-3-8B-Instruct
                                    model to generate the correct response.
                                </li>
                            </ol>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>

                {/* Chatbot feedback dialog */}
                <Dialog
                    open={feedbackDialogOpen}
                    onClose={() => setFeedbackDialogOpen(false)}
                    aria-labelledby="feedback-dialog-title"
                    aria-describedby="feedback-dialog-description"
                >
                    <DialogTitle id="feedback-dialog-title">
                        Feedback
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="feedback-dialog-description">
                            Thank you for using the chatbot assistant! Please
                            consider leaving feedback to help improve the user
                            experience.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <a
                            className="mx-auto mb-4 p-2 text-white rounded-md bg-ktp-darkblue hover:bg-ktp-lightgreen"
                            href="https://docs.google.com/forms/d/e/1FAIpQLSenMJRjHgStxIEUa4k1C7q5sUo6osj7an06USiaAvmcpAUQDA/viewform?usp=header"
                            target="_blank"
                        >
                            Click to provide feedback
                        </a>
                    </DialogActions>
                </Dialog>
            </div>

            <p className="w-fit mx-auto mt-4 text-red-500">
                Experimental - please double check responses.
            </p>

            {/* Chatbot drawer conversation history */}
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
