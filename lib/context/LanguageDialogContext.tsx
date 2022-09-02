import { createContext, Dispatch } from 'react';

export const LanguageDialogContext = createContext<{
    isLanguageDialogOpen: boolean; setLanguageDialogOpen: Dispatch<boolean>;
}>({
    isLanguageDialogOpen: false,
    setLanguageDialogOpen: () => void 0,
});