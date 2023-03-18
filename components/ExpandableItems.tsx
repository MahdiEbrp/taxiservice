import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { ReactElement, useState } from 'react';
import Divider from '@mui/material/Divider';

export type ExpandableItemsProps= {
    isOpen: boolean;
    label: string;
    children: ReactElement | ReactElement[];
    ignoreDivider?: boolean;
}

const ExpandableItems = (props: ExpandableItemsProps) => {

    const { isOpen, label, children, ignoreDivider } = props;
    const [open, setOpen] = useState(isOpen);

    return (
        <>
            <ListItemButton sx={{ backdropFilter: 'opacity(0.5)' ,width:'100% !important'}} onClick={() => setOpen(!open)}>
                <ListItemIcon>
                    {open ? <MdExpandLess /> : <MdExpandMore />}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
            <Collapse in={open} timeout='auto'>
                {children}
            </Collapse>
            {!ignoreDivider && <Divider />}
        </>
    );
};

export default ExpandableItems;