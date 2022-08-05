import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';

export interface SidebarItemType {

    icon: React.ReactElement;
    text: string;
    url: string;
}

const SidebarItem = (props: { item: SidebarItemType; }) => {
    const { icon, text, url } = props.item;
    return (
        <Link href={url}>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
        </Link>

    );
};

export default SidebarItem;