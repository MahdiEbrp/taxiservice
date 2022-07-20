import { createContext, Dispatch } from 'react';

export const ThemeContext = createContext<{
    prefersDarkMode: boolean; setPrefersDarkMode: Dispatch<boolean>;
}>({
    prefersDarkMode: false,
    setPrefersDarkMode: () => { },
});
