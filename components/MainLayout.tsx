import CenterBox from './controls/CenterBox';
import getSettings from '../lib/settings';
import Image from 'next/image';
import LanguageDialog from './dialogs/LanguageDialog';
import LoginDialog from './dialogs/LoginDialog';
import InformationDialog, { InformationDialogProps } from './dialogs/InformationDialog';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ThemePresenter from './ThemePresenter';
import ToastHandler, { EmptyToast, ToastProps } from './controls/Toast';
import importLanguage from '../lib/language';
import { LanguageContext } from './context/LanguageContext';
import { LanguageDialogContext } from './context/LanguageDialogContext';
import { LocalizationInfoContext } from './context/LocalizationInfoContext';
import { LoginDialogContext } from './context/LoginDialogContext';
import { InformationDialogContext } from './context/InformationDialogContext';
import { ReactElement, useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SidebarContext } from './context/SidebarContext';
import { ThemeContext } from './context/ThemeContext';
import { ToastContext } from './context/ToastContext';
import { defaultLocalizationInfo, LocalizationInfoType } from '../lib/geography';
import { useRouter } from 'next/router';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { Settings } from '../types/settings';
import { AllSettingsContext } from './context/AllSettingsContext';
import { MessageDialogContext } from './context/MessageDialogContext';
import english from '../lib/languages/english';

const GeneralContextHolder = (props: { children: ReactElement | ReactElement[]; }) => {

    const [isLanguageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [isMessageDialogOpen, setMessageDialogOpen] = useState(false);
    const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
    const [messageDialogInfo, setInformationDialog] = useState<InformationDialogProps>({ isInformationDialogOpen: false, message: '', title: '' });
    const [prefersDarkMode, setPrefersDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [localizationInfo, setLocalizationInfo] = useState<LocalizationInfoType>(defaultLocalizationInfo);
    const [toast, setToast] = useState<ToastProps>(EmptyToast);
    const router = useRouter();
    const [language, setLanguage] = useState(english);
    const [userSettings, setUserSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const settings = getSettings('darkMode', 'false') as string;
        setPrefersDarkMode(settings === 'true' ? true : false);
    }, [prefersDarkMode]);

    useEffect(() => {
        const loadLanguage = async () => {
            const data = await importLanguage(router.locale);
            setLanguage(data);
        };
        loadLanguage();
    }, [router.locale]);

    return (
        <SessionProvider >
            <ThemeContext.Provider value={{ prefersDarkMode, setPrefersDarkMode }}>
                <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
                    <LanguageDialogContext.Provider value={{ isLanguageDialogOpen, setLanguageDialogOpen }}>
                        <LanguageContext.Provider value={{ language: language }}>
                            <LoginDialogContext.Provider value={{ isLoginDialogOpen, setLoginDialogOpen }}>
                                <ToastContext.Provider value={{ toast, setToast }} >
                                    <InformationDialogContext.Provider value={{ messageDialogInfo, setInformationDialog }}>
                                        <LocalizationInfoContext.Provider value={{ localizationInfo, setLocalizationInfo }}>
                                            <AllSettingsContext.Provider value={{ userSettings, setUserSettings }}>
                                                <MessageDialogContext.Provider value={{ isMessageDialogOpen, setMessageDialogOpen }}>
                                                    {props.children}
                                                </MessageDialogContext.Provider>
                                            </AllSettingsContext.Provider>
                                        </LocalizationInfoContext.Provider>
                                    </InformationDialogContext.Provider>
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
    const breakpoints = createBreakpoints({});
    const appbarHeight = [breakpoints.up('md')] ? '64px' : '56px';
    return (
        <GeneralContextHolder>
            <ThemePresenter>
                <Navbar />
                <LanguageDialog />
                <LoginDialog />
                <Sidebar />
                <CenterBox bgcolor='background.paper' className='main-content' sx={{ marginTop: appbarHeight + ' !important', position: 'relative' }} >
                    <Image src='/images/background.jpg' alt='Background' layout='fill' objectFit='cover' objectPosition='left' />
                    <CenterBox sx={{ zIndex: 70 }}>
                        {props.children}
                    </CenterBox>
                </CenterBox >
                <ToastHandler />
                <InformationDialog />
            </ThemePresenter>
        </GeneralContextHolder >
    );
};

export default MainLayout;
