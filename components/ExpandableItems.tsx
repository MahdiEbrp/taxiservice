import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { ReactElement, useState } from 'react';
export interface ExpandableItemsProps {
    isOpen: boolean;
    label: string;
    children: ReactElement | ReactElement[];
}
const ExpandableItems = (props:ExpandableItemsProps) => {
    const { isOpen,label, children } = props;
    const [open, setOpen] = useState(isOpen);
    return (
        <>
            <ListItemButton onClick={()=>setOpen(!open)}>
                <ListItemIcon>
                    {open ? <MdExpandLess /> : <MdExpandMore />}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
            <Collapse in={open} timeout='auto' unmountOnExit>
                {children}
            </Collapse>
        </>
    );
};

export default ExpandableItems;