import { createContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider( {children} ) {

    // var renderURL = "";
    // if (process.env.NODE_ENV === "development") {
    //     renderURL = "http://localhost:8800";
    // } else if (process.env.NODE_ENV === 'production') {
    //     renderURL = "https://galaxystays-backend.onrender.com";
    // };

    const [currentUserState, setCurrentUserState] = useState(null);
    
    return (
        <GlobalContext.Provider value={ {
            currentUserState,
            setCurrentUserState
        } }>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;