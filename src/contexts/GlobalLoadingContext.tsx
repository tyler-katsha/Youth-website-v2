import { createContext, useContext, useState } from "react";
import type { LoadingContextType } from "../utils/types";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [isLoading,setLoading] = useState(false);

    return <LoadingContext.Provider value={{isLoading,setLoading}}>
        {children}
    </LoadingContext.Provider>
}
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if(!context) throw new Error("useLoading must be used inside of LoadingProvider")
    return context;
}