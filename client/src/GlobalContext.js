import { createContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider( {children} ) {
    
    var renderURL = "";
    if (process.env.NODE_ENV === "development") {
        renderURL = "http://localhost:8800";
    } else if (process.env.NODE_ENV === 'production') {
        renderURL = "https://nguyenstagram-backend.onrender.com";
    };

    const [currentUserState, setCurrentUserState] = useState(null);
    const [currentlyViewingProfile, setCurrentlyViewingProfile] = useState(null);
    const [isLoading, toggleIsLoading] = useState(false);

    return (
        <GlobalContext.Provider value={ {
            currentUserState,
            setCurrentUserState,
            currentlyViewingProfile,
            setCurrentlyViewingProfile,
            renderURL,
            isLoading,
            toggleIsLoading
        } }>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;