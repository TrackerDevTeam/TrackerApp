import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("test_user");
    const [date, setDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const dateString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
        setDate(dateString);
    }, []);

    return (
        <UserContext.Provider value={{ userId, date }}>
            {children}
        </UserContext.Provider>
    );
};
