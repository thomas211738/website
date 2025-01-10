import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Popover from "@mui/material/Popover";
import DownloadIcon from "@mui/icons-material/Download";

import { ChatbotContext } from "../contexts/ChatbotContext";
import GenerateChatbotTranscript from "../utils/GenerateChatbotTranscript.ts";

type Action = "clearConversation" | "downloadTranscript";

interface ChatbotDialogProps {
    action: Action;
}

interface DialogItem {
    icon: React.ReactElement;
    popover: boolean;
    popoverAnchor: HTMLElement | null;
    popoverProp: "conversation" | "transcript";
    popoverMessage: string;
    title: string;
    content: string;
    actionFunction: () => void;
}

const ChatbotDialog = (props: ChatbotDialogProps) => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error("Chatbot must be used within a ChatbotProvider");
    }
    const [state, dispatch] = context;

    /* Handles popovers */
    const [popoverState, setPopoverState] = useState<{
        conversation: HTMLElement | null;
        transcript: HTMLElement | null;
    }>({
        conversation: null,
        transcript: null,
    });

    const handlePopoverOpen =
        (popoverType: "conversation" | "transcript") =>
        (event: React.MouseEvent<HTMLElement>) => {
            if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
                return;
            }
            setPopoverState((prevState) => ({
                ...prevState,
                [popoverType]: event.currentTarget,
            }));
        };

    const handlePopoverClose =
        (popoverType: "conversation" | "transcript") => () => {
            setPopoverState((prevState) => ({
                ...prevState,
                [popoverType]: null,
            }));
        };

    const clearConversationPopover = Boolean(popoverState.conversation);
    const downloadTranscriptPopover = Boolean(popoverState.transcript);

    /* Handles chatbot actions */
    const clearConversation = () => {
        dispatch({
            type: "clearConversation",
        });
        setDialogOpen(false);
        console.log("Cleared chatbot conversation");
    };

    const downloadTranscript = () => {
        if (state.agent === "rag") {
            GenerateChatbotTranscript(state.rag_history);
        } else if (state.agent === "react") {
            GenerateChatbotTranscript(state.react_history);
        }

        setDialogOpen(false);
        console.log("Downloaded chatbot transcript");
    };

    /* Handles chatbot action confirmation dialog*/
    const [dialogOpen, setDialogOpen] = useState(false);
    const dialogItems: Record<Action, DialogItem> = {
        clearConversation: {
            icon: <DeleteForeverIcon />,
            popover: clearConversationPopover,
            popoverAnchor: popoverState.conversation,
            popoverProp: "conversation",
            popoverMessage: "Clear conversation",
            title: "Clear Conversation",
            content:
                "Clear the chatbot conversation. This action is irreversible.",
            actionFunction: clearConversation,
        },
        downloadTranscript: {
            icon: <DownloadIcon />,
            popover: downloadTranscriptPopover,
            popoverAnchor: popoverState.transcript,
            popoverProp: "transcript",
            popoverMessage: "Download Transcript",
            title: "Download Transcript",
            content: "Download the chatbot conversation as a PDF.",
            actionFunction: downloadTranscript,
        },
    };

    return (
        <div>
            {/* Chatbot action icon display */}
            <button
                className="w-fit m-1 rounded-md hover:bg-gray-300"
                type="reset"
                onClick={() => setDialogOpen(true)}
                aria-owns={
                    dialogItems[props.action].popover
                        ? "mouse-over-popover"
                        : undefined
                }
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen(
                    dialogItems[props.action].popoverProp
                )}
                onMouseLeave={handlePopoverClose(
                    dialogItems[props.action].popoverProp
                )}
                onTouchStart={(e) => e.preventDefault()}
            >
                {dialogItems[props.action].icon}
            </button>

            {/* Chatbot action popver */}
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: "none" }}
                open={dialogItems[props.action].popover}
                anchorEl={dialogItems[props.action].popoverAnchor}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                onClose={handlePopoverClose("conversation")}
                disableRestoreFocus
            >
                <p className="p-2">
                    {dialogItems[props.action].popoverMessage}
                </p>
            </Popover>

            {/* Chatbot action confirmation dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogItems[props.action].title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogItems[props.action].content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={dialogItems[props.action].actionFunction}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChatbotDialog;
