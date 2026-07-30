import { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../theme/theme";
interface ThemeContextType{
    theme: typeof lightTheme;
    toggleTheme: () => void;
    isDark:boolean;
}
const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    toggleTheme: () => {},
    isDark:false
});

export const ThemeProvider = ({children}:{children:React.ReactNode}) => {
    const [isDark, setIsDark] = useState(() => {return localStorage.getItem("theme") === 'dark'});

    const toggleTheme = () => setIsDark((prev) => !prev);
    
    const theme = isDark ? darkTheme : lightTheme

    useEffect(() => {
        const currentTheme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute("data-theme", isDark ? "dark":"light")
        localStorage.setItem('theme',currentTheme)
    },[isDark])
    return (
        <ThemeContext.Provider value={{theme,toggleTheme,isDark}}>{children}</ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);