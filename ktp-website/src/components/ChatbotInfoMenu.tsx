import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import chatbotDiagram from "../img/chatbot_diagram.png";

const ChatbotInfoMenu = () => {
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

    return (
        <div>
            <button onClick={handleInfoMenuOpen}>
                <InfoIcon
                    className={`my-auto ${
                        infoOpen || architectureDialogOpen || feedbackDialogOpen
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
                className="m-auto max-h-112 sm:max-h-128"
            >
                <DialogTitle
                    className="text-ktp-darkblue"
                    id="architecture-dialog-title"
                >
                    Architecture
                </DialogTitle>
                <DialogContent>
                    <p>
                        This chatbot was created using Retrieval Augmented
                        Generation (RAG). At its core, the implementation
                        follows 3 basic steps.
                    </p>
                    <span className="mt-4 px-3 py-2 flex flex-col text-black bg-gray-200 rounded-md shadow-sm">
                        <p className="my-1 text-sm">
                            1. KTP information is converted into vector
                            embeddings and stored in Pinecone's vector database
                            (offline).
                        </p>
                        <p className="my-1 text-sm">
                            2. The user query is used to retrieve contextual
                            information from Pinecone utilizing cosine
                            similarity to determine semantic relevance.
                        </p>
                        <p className="my-1 text-sm">
                            3. The retrieved context and the user query are both
                            passed into the Llama-3-8B-Instruct model to
                            generate the correct response.
                        </p>
                    </span>

                    <img
                        className="w-4/5 mx-auto mt-2"
                        src={chatbotDiagram}
                        alt="Error displaying chatbot diagram"
                    />
                </DialogContent>
            </Dialog>

            {/* Chatbot feedback dialog */}
            <Dialog
                open={feedbackDialogOpen}
                onClose={() => setFeedbackDialogOpen(false)}
                aria-labelledby="feedback-dialog-title"
                aria-describedby="feedback-dialog-description"
            >
                <DialogTitle
                    className="text-ktp-darkblue"
                    id="feedback-dialog-title"
                >
                    Feedback
                </DialogTitle>
                <DialogContent>
                    Thank you for using the chatbot assistant! Please consider
                    leaving feedback to help improve the user experience.
                </DialogContent>
                <DialogActions>
                    <a
                        className="mx-auto mb-4 p-2 text-black rounded-md bg-gray-200 hover:bg-ktp-lightgreen"
                        href="https://docs.google.com/forms/d/e/1FAIpQLSenMJRjHgStxIEUa4k1C7q5sUo6osj7an06USiaAvmcpAUQDA/viewform?usp=header"
                        target="_blank"
                    >
                        Click to provide feedback
                    </a>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChatbotInfoMenu;
