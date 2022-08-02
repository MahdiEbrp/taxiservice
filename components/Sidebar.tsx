import SidebarItem from './SidebarItem';
import { AiFillHome } from 'react-icons/ai';
import { BiSupport } from 'react-icons/bi';
import { Box, Drawer, List } from '@mui/material';
import { FaCar } from 'react-icons/fa';
import { LanguageContext } from '../lib/context/LanguageContext';
import { SidebarContext } from '../lib/context/SidebarContext';
import { useContext } from 'react';

const Sidebar = () => {
    const { sidebarOpen } = useContext(SidebarContext);
    const { language } = useContext(LanguageContext);
    const { sidebar, settings } = language;
    const { rightToLeft } = settings;
    return (
        <Drawer anchor={rightToLeft ? 'right' : 'left'} variant='persistent' open={sidebarOpen} PaperProps={{ sx: { top: 'auto' } }}>
            <Box>
                <List dir={rightToLeft ? 'rtl' : 'ltr'} >
                    <SidebarItem item={{ icon: <AiFillHome />, text: sidebar.home, url: '/' }} />
                    <SidebarItem item={{ icon: <FaCar />, text: sidebar.services, url: '/Service' }} />
                    <SidebarItem item={{ icon: <BiSupport />, text: sidebar.support, url: '/Support' }} />
                </List>
            </Box>
        </Drawer>
    );
};


export default Sidebar;
