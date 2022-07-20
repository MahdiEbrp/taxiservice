import { Box } from '@mui/material';
import React from 'react';
export interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}
const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const [isActive, setIsActive] = React.useState(false);
    if (value === index && !isActive)
        setIsActive(true);

    if (!isActive)
        return <></>;

    return (
        <Box sx={{ display: value === index ? 'flex' : 'none', padding: '1rem' }}  {...other}>
            {children}
        </Box >
    );
};

export default TabPanel;