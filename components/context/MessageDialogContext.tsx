import { createContext, Dispatch } from 'react';

export const MessageDialogContext = createContext<{ isMessageDialogOpen: boolean; setMessageDialogOpen: Dispatch<boolean>; }>
    ({
        isMessageDialogOpen: false,
        setMessageDialogOpen: () => void 0,
    });