import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useContext, useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useSWR from 'swr';
import { CgProfile } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoLanguageOutline } from 'react-icons/io5';
import { IoMdNotifications } from 'react-icons/io';
import { LanguageContext } from './context/LanguageContext';
import { LanguageDialogContext } from './context/LanguageDialogContext';
import { LoginDialogContext } from './context/LoginDialogContext';
import { MessageDataList } from '../types/messages';
import { SidebarContext } from './context/SidebarContext';
import { ThemeContext } from './context/ThemeContext';
import { ToastContext } from './context/ToastContext';
import { UpdateSettings } from '../lib/settings';
import { VscColorMode } from 'react-icons/vsc';
import { getData } from '../lib/axiosRequest';
import { useSession } from 'next-auth/react';
import { getSystemMessage } from '../lib/language';



const Navbar = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const profilePictureUrl = publicUrl + '/images/profiles/';

    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { isLoginDialogOpen, setLoginDialogOpen } = useContext(LoginDialogContext);
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode, setPrefersDarkMode } = useContext(ThemeContext);
    const { setToast } = useContext(ToastContext);
    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);

    const { direction } = language.settings;
    const { notification, settings } = language;
    const session = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isUserValid, setUserValid] = useState(false);
    const [messages, setMessages] = useState<MessageDataList | undefined>(undefined);

    const open = Boolean(anchorEl);

    const UpdateTheme = () => {
        setPrefersDarkMode(!prefersDarkMode);
        UpdateSettings('darkMode', (!prefersDarkMode).toString());
        setToast({ id: Date.now(), message: !prefersDarkMode ? notification.darkModeEnabled : notification.darkModeDisabled, alertColor: 'info' });
    };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const fetcher = async (url: string) => {
        if (session.status !== 'authenticated')
            return undefined;
        const data = await getData(url);
        if (!data)
            return undefined;
        if (data.status !== 200)
            throw new Error(data.statusText);
        return data.data;
    };
    const { data } = useSWR(process.env.NEXT_PUBLIC_WEB_URL + '/api/messages/retrieve', fetcher);
    useEffect(() => {
        if (session.data)
            setUserValid(true);
        else
            setUserValid(false);
    }, [session]);
    useEffect(() => {
        if (session.data && data) {
            const messages = data as MessageDataList;
            setMessages(messages);
        }
    }, [session, data]);
    const getUnreadMessages = () => {
        return messages?.filter(message => message.isRead === false).length || 0;
    };
    const unreadMessages = messages?.slice(0, 4);

    const redirectToInbox = () => {
        setAnchorEl(null);
    };

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
                        <>
                            <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }} onClick={handleClick}>
                                <Badge badgeContent={getUnreadMessages()} color='warning' sx={{
                                    '& .MuiBadge-standard': {
                                        left: 0,
                                        right: 'auto',
                                    }
                                }}>
                                    <IoMdNotifications />
                                </Badge>
                        </IconButton>
                        {unreadMessages && unreadMessages.length > 0 &&
                            <Menu dir={settings.direction} open={open} anchorEl={anchorEl} onClose={handleClose}>
                                {unreadMessages.map(message => {
                                    return (
                                        <MenuItem key={message.id} onClick={redirectToInbox}>
                                            <Link href={'/user/messages/inbox'}>
                                                <Typography component={'ul'} sx={{ display: 'contents' }}>
                                                    <ListItemAvatar>
                                                        <Avatar alt={message.title} src={profilePictureUrl + message.senderProfilePicture}
                                                            sx={{ width: 32, height: 32 }} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={getSystemMessage(message.title, language)} sx={{ gap: '1rem' }} />
                                                </Typography>
                                            </Link>
                                        </MenuItem>
                                    );
                                })}
                            </Menu>
                        }
                        </>

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