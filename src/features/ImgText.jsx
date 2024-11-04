import React, { useState, useEffect, useContext } from "react";
import Tesseract from 'tesseract.js';
import { Variables } from "../components/variables";
import ExtractedText from "./ExtractedText";

function ImgText({ image }) {
    const [extText, setExtText] = useContext(Variables);

    useEffect(() => {
        if (image.length > 0) {
            // Process each image and extract text
            Promise.all(
                image.map((imgUrl) =>
                    Tesseract.recognize(imgUrl, "eng", {
                        logger: (m) => console.log(m),
                    }).then(({ data: { text } }) => text)
                )
            ).then((texts) => setExtText(texts));
        } else {
            setExtText([]); // Clear text if no image is provided
        }
    }, [image, setExtText]);

    return (
        <div className="flex-row justify-start">
            {extText && extText.some(text => text.trim() !== "") && (
                <ExtractedText extText={extText} />
            )}
        </div>
    );
}

export default ImgText;
