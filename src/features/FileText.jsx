import React, { useEffect, useContext } from "react";
import mammoth from "mammoth"; // for DOCX
import { Variables } from "../components/variables";
import * as pdfjsLib from "pdfjs-dist";
import ExtractedText from "./ExtractedText";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function FileText({ file }) {
    const [extText, setExtText] = useContext(Variables);

    useEffect(() => {
        if (file && file instanceof Blob) {
            const fileType = file.type;

            if (fileType === "text/plain") {
                // Handle plain text files
                const reader = new FileReader();
                reader.onload = () => setExtText(reader.result);
                reader.onerror = () => console.error("Error reading file:", reader.error);
                reader.readAsText(file);
            } else if (fileType === "application/pdf") {
                // Handle PDF files
                extractPdfText(file);
            } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                // Handle DOCX files
                extractDocxText(file);
            } else {
                setExtText("Unsupported file type.");
            }
        } else {
            console.error("File is not defined or is not a Blob/File type.");
        }
    }, [file, setExtText]);

    // Function to extract text from PDF
    const extractPdfText = async (pdfFile) => {
        try {
            const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfFile)).promise;
            let textContent = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const text = await page.getTextContent();
                textContent += text.items.map((item) => item.str).join(" ");
            }
            setExtText(textContent);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
        }
    };

    // Function to extract text from DOCX
    const extractDocxText = async (docxFile) => {
        try {
            const arrayBuffer = await docxFile.arrayBuffer();
            const { value: text } = await mammoth.extractRawText({ arrayBuffer });
            setExtText(text);
        } catch (error) {
            console.error("Error extracting text from DOCX:", error);
            setExtText("Error reading DOCX file.");
        }
    };

    return (
        <>
            {extText ? (
                <ExtractedText extText={extText}/>
            ) : (
                <p>No content available to display.</p>
            )}
        </>
    );
}

export default FileText;
