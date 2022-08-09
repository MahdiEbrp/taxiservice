import CenterBox from './CenterBox';
import React, { useState } from 'react';
export interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    activeIndex: string;
    wrapMode?: boolean;
}
const TabPanel = (props: TabPanelProps) => {
    const { children, activeIndex, index, wrapMode, ...other } = props;
    const [isActive, setIsActive] = useState(false);
    let style = { display: activeIndex === index ? 'flex' : 'none', padding: '1rem' };
    if (activeIndex === index && !isActive)
        setIsActive(true);
    if (!isActive)
        return <></>;
    if (wrapMode)
        style = { ...style, ...{ flexDirection: 'row', flexWrap: 'wrap',alignItems: 'baseLine', } };
    return (
        <CenterBox sx={style}  {...other}>
            {children}
        </CenterBox >
    );
};

export default TabPanel;