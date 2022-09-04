import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CgProfile } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoLanguageOutline } from 'react-icons/io5';
import { IoMdNotifications } from 'react-icons/io';
import { LanguageContext } from './context/LanguageContext';
import { LanguageDialogContext } from './context/LanguageDialogContext';
import { LoginDialogContext } from './context/LoginDialogContext';
import { SidebarContext } from './context/SidebarContext';
import { ThemeContext } from './context/ThemeContext';
import { ToastContext } from './context/ToastContext';
import { UpdateSettings } from '../lib/settings';
import { VscColorMode } from 'react-icons/vsc';
import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
const Navbar = () => {

    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { isLoginDialogOpen, setLoginDialogOpen } = useContext(LoginDialogContext);
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode, setPrefersDarkMode } = useContext(ThemeContext);
    const { setToast } = useContext(ToastContext);
    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);

    const { direction } = language.settings;
    const notification = language.notification;

    const session = useSession();
    const [isUserValid, setUserValid] = useState(false);

    const UpdateTheme = () => {
        setPrefersDarkMode(!prefersDarkMode);
        UpdateSettings('darkMode', (!prefersDarkMode).toString());
        setToast({ id: Date.now(), message: !prefersDarkMode ? notification.darkModeEnabled : notification.darkModeDisabled, alertColor: 'info' });
    };

    useEffect(() => {
        if (session.data)
            setUserValid(true);
        else
            setUserValid(false);
    }, [session]);

    return (
        <AppBar position='fixed' dir={direction} sx={{ top: 0, zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }}>
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
                    {isUserValid &&
                        <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }}
                        >
                            <Badge badgeContent={4} color='warning' sx={{
                                '& .MuiBadge-standard': {
                                    left: 0,
                                    right: 'auto',
                                }
                            }}>
                                <IoMdNotifications />
                            </Badge>
                        </IconButton>
                    }
                    <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }}
                        onClick={() => setLoginDialogOpen(!isLoginDialogOpen)} >
                        <CgProfile />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;