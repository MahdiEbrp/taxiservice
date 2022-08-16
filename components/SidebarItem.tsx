import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

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