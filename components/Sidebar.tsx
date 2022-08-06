import SidebarItem from './SidebarItem';
import { AiFillHome } from 'react-icons/ai';
import { BiSupport } from 'react-icons/bi';
import { Box, Divider, Drawer, List } from '@mui/material';
import { FaCar, FaCarAlt, FaMoneyBillAlt } from 'react-icons/fa';
import { LanguageContext } from '../lib/context/LanguageContext';
import { RiSettings3Fill } from 'react-icons/ri';
import { SidebarContext } from '../lib/context/SidebarContext';
import { TbRoad } from 'react-icons/tb';
import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HiOutlineMail, HiUserGroup } from 'react-icons/hi';
const Sidebar = () => {
    /* #region context section */
    const { sidebarOpen } = useContext(SidebarContext);
    const { language } = useContext(LanguageContext);
    /* #endregion */
    /* #region language section */
    const { sidebar, settings } = language;
    const { direction } = settings;
    /* #endregion */
    const session = useSession();
    const [isUserValid, setUserValid] = useState(false);
    /* #region Callback hook section */
    useEffect(() => {
        if (session.data)
            setUserValid(true);
        else
            setUserValid(false);
    }, [session]);
    /* #endregion */
    return (
        <Drawer anchor={direction==='rtl' ? 'right' : 'left'} variant='persistent' open={sidebarOpen} PaperProps={{ sx: { top: 'auto' } }}>
            <Box>
                <List dir={direction} >
                    {isUserValid &&
                        <>
                        <SidebarItem item={{ icon: <FaCarAlt />, text: sidebar.agencies, url: '/user/agencies' }} />
                        <SidebarItem item={{ icon: <HiUserGroup />, text: sidebar.personnel, url: '/personnel' }} />
                        <Divider />
                        <SidebarItem item={{ icon: <TbRoad />, text: sidebar.trips, url: '/trips' }} />
                        <SidebarItem item={{ icon: <FaMoneyBillAlt />, text: sidebar.payments, url: '/payments' }} />
                        <Divider />
                        <SidebarItem item={{ icon: <HiOutlineMail />, text: sidebar.messages, url: '/messages' }} />
                        <SidebarItem item={{ icon: <RiSettings3Fill />, text: sidebar.settings, url: '/settings' }} />
                        <Divider />
                        </>
                    }
                    <SidebarItem item={{ icon: <AiFillHome />, text: sidebar.home, url: '/' }} />
                    <SidebarItem item={{ icon: <FaCar />, text: sidebar.services, url: '/Service' }} />
                    <SidebarItem item={{ icon: <BiSupport />, text: sidebar.support, url: '/Support' }} />
                </List>
            </Box>
        </Drawer>
    );
};


export default Sidebar;
