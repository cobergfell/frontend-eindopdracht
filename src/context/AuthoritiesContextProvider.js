import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

function AuthoritiesContextProvider({ children }) {

    const [isModerator, setIsModerator] = useState(false);
    const [isAdministrator, setIsAdministrator] = useState(false);
    const [username, setUsername] = useState("");

    console.log("Line 11 of AuthContextProvider: isModerator",isModerator);
    console.log("Line 12 of AuthContextProvider: isAdministrator",isAdministrator);


    const contextData = {
        isModerator: isModerator,
        isAdministrator: isAdministrator,
        setIsModerator: setIsModerator,
        setIsAdministrator: setIsAdministrator,
        username:username,
        setUsername:setUsername,
    }

    console.log("Line 25 of AuthContextProvider: contextData",contextData);



    return (
        <AuthContext.Provider value={contextData}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthoritiesContextProvider;