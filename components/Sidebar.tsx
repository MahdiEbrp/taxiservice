import { Drawer, List } from '@mui/material';
import { useContext } from 'react';
import { SidebarContext } from '../lib/context/SidebarContext';
import { LanguageContext } from '../lib/context/LanguageContext';
import SidebarItem from './SidebarItem';
import { AiFillHome } from 'react-icons/ai';
import { FaCar } from 'react-icons/fa';
import { BiSupport } from 'react-icons/bi';

const Sidebar = () => {
    const { sidebarOpen } = useContext(SidebarContext);
    const { language } = useContext(LanguageContext);
    const { sidebar, settings } = language;
    const { rightToLeft } = settings;
    return (
        <Drawer anchor={rightToLeft ? 'right' : 'left'} variant='persistent' open={sidebarOpen} PaperProps={{ sx: { marginTop: '64px' } }} >
            <div>
                <List dir={rightToLeft ? 'rtl' : 'ltr'} >
                    <SidebarItem item={{ icon: <AiFillHome />, text: sidebar.home, url: '/' }} />
                    <SidebarItem item={{ icon: <FaCar />, text: sidebar.services, url: '/Service' }} />
                    <SidebarItem item={{ icon: <BiSupport />, text: sidebar.support, url: '/Support' }} />
                </List>
            </div>
        </Drawer>
    );
};


export default Sidebar;
