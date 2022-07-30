import CenterBox from './CenterBox';
import React, { useState } from 'react';
export interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}
const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const [isActive, setIsActive] = useState(false);
    if (value === index && !isActive)
        setIsActive(true);
    if (!isActive)
        return <></>;
    return (
        <CenterBox sx={{ display: value === index ? 'flex' : 'none', padding: '1rem' }}  {...other}>
            {children}
        </CenterBox >
    );
};

export default TabPanel;