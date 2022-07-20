import { createContext, Dispatch } from 'react';

export const LoginDialogContext = createContext<{ isLoginDialogOpen: boolean; setLoginDialogOpen: Dispatch<boolean>; }>
    ({
        isLoginDialogOpen: false,
        setLoginDialogOpen: () => { },
    });