import CenterBox from './CenterBox';
import React, { useState } from 'react';
export interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    activeIndex: string;
}
const TabPanel = (props: TabPanelProps) => {
    const { children, activeIndex, index, ...other } = props;
    const [isActive, setIsActive] = useState(false);
    if (activeIndex === index && !isActive)
        setIsActive(true);
    if (!isActive)
        return <></>;
    return (
        <CenterBox sx={{ display: activeIndex === index ? 'flex' : 'none', padding: '1rem' }}  {...other}>
            {children}
        </CenterBox >
    );
};

export default TabPanel;