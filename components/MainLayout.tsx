import GetSettings from '../lib/Settings';
import LanguageDialog from './dialogs/LanguageDialog';
import LoginDialog from './dialogs/LoginDialog';
import MessageDialog, { MessageDialogProps } from './dialogs/MessageDialog';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ThemePresenter from '../lib/ThemePresenter';
import ToastHandler, { EmptyToast, ToastProps } from './controls/Toast';
import getLanguage from '../lib/Language';
import { LanguageContext } from '../lib/context/LanguageContext';
import { LanguageDialogContext } from '../lib/context/LanguageDialogContext';
import { LoginDialogContext } from '../lib/context/LoginDialogContext';
import { MessageDialogContext } from '../lib/context/MessageDialogContext';
import { Paper } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SidebarContext } from '../lib/context/SidebarContext';
import { ThemeContext } from '../lib/context/ThemeContext';
import { ToastContext } from '../lib/context/ToastContext';
import { useRouter } from 'next/router';
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
