import { createContext, Dispatch } from 'react';

export const SidebarContext = createContext<{
    sidebarOpen: boolean; setSidebarOpen: Dispatch<boolean>;
}>({
    sidebarOpen: false,
    setSidebarOpen: () => void 0,
});
