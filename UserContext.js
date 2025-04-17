import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("Billy");
    const [date, setDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const dateString = `${today.getFullYear()}_${String(today.getMonth() + 1).padStart(2, '0')}_${String(today.getDate()).padStart(2, '0')}`;
        setDate(dateString);
    }, []);

    return (
        <UserContext.Provider value={{ userId, date }}>
            {children}
        </UserContext.Provider>
    );
};
