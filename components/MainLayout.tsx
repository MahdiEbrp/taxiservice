import { ReactElement, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { SidebarContext } from '../lib/context/SidebarContext';
import Sidebar from './Sidebar';
import { ThemeContext } from '../lib/context/ThemeContext';
import ThemePresenter from '../lib/ThemePresenter';
import LanguageDialog from './dialogs/LanguageDialog';
import { LanguageDialogContext } from '../lib/context/LanguageDialogContext';
import { LanguageContext } from '../lib/context/LanguageContext';
import GetSettings from '../lib/Settings';
import { LoginDialogContext } from '../lib/context/LoginDialogContext';
import LoginDialog from './dialogs/LoginDialog';
import { Paper } from '@mui/material';
import ToastHandler, { EmptyToast, ToastProps } from './controls/Toast';
import { ToastContext } from '../lib/context/ToastContext';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import getLanguage from '../lib/Language';
import MessageDialog, { MessageDialogProps } from './dialogs/MessageDialog';
import { MessageDialogContext } from '../lib/context/MessageDialogContext';
const ContextHolder = (props: { children: ReactElement | ReactElement[]; }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [prefersDarkMode, setPrefersDarkMode] = useState(false);
    const [isLanguageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
    const [toast, setToast] = useState<ToastProps>(EmptyToast);
    const router = useRouter();
    const [language, setLanguage] = useState(getLanguage(router.locale));
    const [messageDialogInfo, setMessageDialog] = useState<MessageDialogProps>({ isMessageDialogOpen: false, message: '', title: '' });
    useEffect(() => {
        const settings = GetSettings('darkMode', 'false') as string;
        setPrefersDarkMode(settings === 'true' ? true : false);
    }, [prefersDarkMode]);
    useEffect(() => {
        setLanguage(getLanguage(router.locale));
    }, [router.locale]);
    return (
        <SessionProvider >
            <ThemeContext.Provider value={{ prefersDarkMode, setPrefersDarkMode }}>
                <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
                    <LanguageDialogContext.Provider value={{ isLanguageDialogOpen, setLanguageDialogOpen }}>
                        <LanguageContext.Provider value={{ language: language }}>
                            <LoginDialogContext.Provider value={{ isLoginDialogOpen, setLoginDialogOpen }}>
                                <ToastContext.Provider value={{ toast, setToast }} >
                                    <MessageDialogContext.Provider value={{ messageDialogInfo, setMessageDialog }}>
                                        {props.children}
                                    </MessageDialogContext.Provider>
                                </ToastContext.Provider>
                            </LoginDialogContext.Provider>
                        </LanguageContext.Provider>
                    </LanguageDialogContext.Provider>
                </SidebarContext.Provider>
            </ThemeContext.Provider >
        </SessionProvider>
    );
};
const MainLayout = (props: { children: ReactElement; }) => {
    return (
        <ContextHolder>
            <ThemePresenter>
                <Navbar />
                <Sidebar />
                <LanguageDialog />
                <LoginDialog />
                <Paper className='main-content' sx={{ display: 'flex', gap: '1rem' }}>
                    {props.children}
                </Paper >
                <ToastHandler />
                <MessageDialog />
            </ThemePresenter>
        </ContextHolder>
    );
};

export default MainLayout;
