import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export interface SidebarItemType {

    icon: React.ReactElement;
    text: string;
    url: string;
}

const SidebarItem = (props: { item: SidebarItemType; }) => {
    const { icon, text, url } = props.item;
    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
};

export default SidebarItem;