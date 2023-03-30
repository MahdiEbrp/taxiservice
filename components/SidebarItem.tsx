import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

export type SidebarItemType = {
    icon: React.ReactElement;
    text: string;
    url: string;
};

const SidebarItem = (props: { item: SidebarItemType; }) => {

    const { icon, text, url } = props.item;

    const isExternal = !url.startsWith('/');

    return (
        <Link href={url}>
            <a target={isExternal ? '_blank' : '_self'}>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            </a>
        </Link>

    );
};

export default SidebarItem;