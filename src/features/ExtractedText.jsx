import React, { useContext, useState } from "react";
import { Variables } from "../components/variables";
function ExtractedText({ extText }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [,setExtText]=useContext(Variables);

    const speakText = () => {
        if ('speechSynthesis' in window && extText) {
            const utterance = new SpeechSynthesisUtterance(extText);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
            setIsPaused(false);

            // Reset speaking state when speaking ends
            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };
        } else {
            alert("Sorry, your browser does not support text-to-speech.");
        }
    };

    const pauseSpeech = () => {
        if (window.speechSynthesis.speaking && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeSpeech = () => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const cancelSpeech = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
            setExtText([]);
        }
    };

    return (
        <div className="flex flex-col items-start my-4">
            <h3 className="font-extrabold text-2xl">EXTRACTED TEXT : </h3>
            {extText ? (
                <div className="bg-transparent border border-black  p-4 h-64 w-full max-w-screen-md overflow-y-scroll mb-4">
                    <p className="font-bold text-black">{extText}</p>
                </div>
            ) : (
                <p>No content available to display.</p>
            )}
            {/* Control Buttons */}
            {extText && (
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={speakText}
                        disabled={isSpeaking}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Speak
                    </button>
                    <button
                        onClick={pauseSpeech}
                        disabled={!isSpeaking || isPaused}
                        className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700 transition duration-300"
                    >
                        Pause
                    </button>
                    <button
                        onClick={resumeSpeech}
                        disabled={!isSpeaking || !isPaused}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                    >
                        Resume
                    </button>
                    <button
                        onClick={cancelSpeech}
                        disabled={!isSpeaking}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default ExtractedText;
