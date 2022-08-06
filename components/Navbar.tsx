import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { CgProfile } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoLanguageOutline } from 'react-icons/io5';
import { IoMdNotifications } from 'react-icons/io';
import { LanguageContext } from '../lib/context/LanguageContext';
import { LanguageDialogContext } from '../lib/context/LanguageDialogContext';
import { LoginDialogContext } from '../lib/context/LoginDialogContext';
import { SidebarContext } from '../lib/context/SidebarContext';
import { ThemeContext } from '../lib/context/ThemeContext';
import { ToastContext } from '../lib/context/ToastContext';
import { UpdateSettings } from '../lib/Settings';
import { VscColorMode } from 'react-icons/vsc';
import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
const Navbar = () => {
    /* #region Context section */
    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { isLoginDialogOpen, setLoginDialogOpen } = useContext(LoginDialogContext);
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode, setPrefersDarkMode } = useContext(ThemeContext);
    const { setToast } = useContext(ToastContext);
    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
    /* #endregion */
    /* #region Language section */
    const {direction} = language.settings;
    const notification = language.notification;
    /* #endregion */
    const session = useSession();
    const [isUserValid, setUserValid] = useState(false);
    /* #region Functions section */
    const UpdateTheme = () => {
        setPrefersDarkMode(!prefersDarkMode);
        UpdateSettings('darkMode', (!prefersDarkMode).toString());
        setToast({ id: Date.now(), message: !prefersDarkMode ? notification.darkModeEnabled : notification.darkModeDisabled, alertColor: 'info' });
    };
    /* #endregion */
    /* #region Callback hook section */
    useEffect(() => {
        if (session.data)
            setUserValid(true);
        else
            setUserValid(false);
    }, [session]);
    /* #endregion */
    return (
        <AppBar position='sticky' dir={direction} sx={{ top: 0, zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }}>
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