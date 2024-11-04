import React, { createContext, useState } from "react";

export const Variables = createContext();

export const VariablesProvider = ({ children }) => {
    const [extText, setExtText] = useState([]);
    return (
        <Variables.Provider value={[extText, setExtText]}>
            {children}
        </Variables.Provider>
    );
};
