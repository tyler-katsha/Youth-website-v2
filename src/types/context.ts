import type { lightTheme } from "../theme/theme";

export interface ThemeContextType{
    theme: typeof lightTheme;
    toggleTheme: () => void;
    isDark:boolean;
}

export interface LoadingContextType{
    isLoading:boolean;
    setLoading: (value:boolean) => void;
}