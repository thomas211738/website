import jsPDF from "jspdf";

type Message = {
    role: string;
    content: string;
};

const GenerateChatbotTranscript = (history: Message[]) => {
    const doc = new jsPDF();
    const datetime = new Date();

    let y = 20;
    const margin = 20;
    const pageWidth = 160;
    const pageHeight = doc.internal.pageSize.height;

    /* Adds transcript title to PDF */
    doc.setFontSize(20);
    doc.text("KTPaul Transcript", 105, y, {
        align: "center",
    });
    y += 6;

    /* Adds transcript date to PDF */
    doc.setFontSize(12);
    doc.text(datetime.toLocaleString(), 105, y, {
        align: "center",
    });
    y += 12;

    /* Adds transcript messages to PDF */
    doc.setFontSize(16);
    history.forEach((message) => {
        const role = message.role === "user" ? "User" : "KTPaul";

        /* Adds new page if necessary */
        if (y + 10 > doc.internal.pageSize.height) {
            doc.addPage();
            y = 20;
        }

        /* Adds role to PDF */
        doc.setFont("helvetica", "bold");
        doc.text(`${role}:`, margin, y);
        y += 6;

        /* Adds messages to PDF */
        doc.setFont("helvetica", "normal");
        const wrappedValue = doc.splitTextToSize(message.content, pageWidth);
        wrappedValue.forEach((line: string) => {
            /* Adds new page if necessary */
            if (y + 10 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += 5;
        });
        y += +6;
    });

    /* Saves PDF */
    doc.save("KTPaulTranscript.pdf");
};

export default GenerateChatbotTranscript;
