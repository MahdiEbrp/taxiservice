import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useContext } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { SidebarContext } from '../lib/context/SidebarContext';
import { IoLanguageOutline } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { VscColorMode } from 'react-icons/vsc';
import { ThemeContext } from '../lib/context/ThemeContext';
import { LanguageDialogContext } from '../lib/context/LanguageDialogContext';
import { UpdateSettings } from '../lib/Settings';
import { LoginDialogContext } from '../lib/context/LoginDialogContext';
import { ToastContext } from '../lib/context/ToastContext';
import { LanguageContext } from '../lib/context/LanguageContext';
const Navbar = () => {

    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
    const { prefersDarkMode, setPrefersDarkMode } = useContext(ThemeContext);
    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setToast } = useContext(ToastContext);

    const { language } = useContext(LanguageContext);
    const rightToLeft = language.settings.rightToLeft;
    const notification = language.notification;

    const UpdateTheme = () => {
        setPrefersDarkMode(!prefersDarkMode);
        UpdateSettings('darkMode', (!prefersDarkMode).toString());
        setToast({ id: Date.now(), message: !prefersDarkMode ? notification.darkModeEnabled : notification.darkModeDisabled, alertColor: 'info' });
    };

    return (
        <AppBar position='fixed' dir={rightToLeft ? 'rtl' : 'ltr'} sx={{ zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <GiHamburgerMenu />
                </IconButton>
                <Typography variant='h6' component='div' sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'end', flexGrow: 1 }}>
                    Taxi Service
                </Typography>
                <Box display='flex' flexGrow='1' justifyContent='end' alignItems='center' >
                    <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }}
                        onClick={() => UpdateTheme()} >
                        <VscColorMode />
                    </IconButton>
                    <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }}
                        onClick={() => setLanguageDialogOpen(!isLanguageDialogOpen)} >
                        <IoLanguageOutline />
                    </IconButton>
                    <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }}
                        onClick={() => setLoginDialogOpen(!isLanguageDialogOpen)} >
                        <CgProfile />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;