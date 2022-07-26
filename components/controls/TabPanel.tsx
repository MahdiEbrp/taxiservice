import CenterBox from './CenterBox';
import React, { ElementType, useState } from 'react';
import { BoxProps } from '@mui/material';

type TabPanelProps = {
    children?: React.ReactNode;
    index: string;
    activeIndex: string;
    wrapMode?: boolean;
};
export type ExtendedTabPanelProps = TabPanelProps & BoxProps;

const TabPanel: ElementType = (props: ExtendedTabPanelProps) => {

    const { children, activeIndex, index, wrapMode,...rest } = props;

    const [isActive, setIsActive] = useState(false);

    let style = { display: activeIndex === index ? 'flex' : 'none', padding: '1rem' };

    if (activeIndex === index && !isActive)
        setIsActive(true);
    if (!isActive)
        return <></>;
    if (wrapMode)
        style = { ...style, ...{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseLine', } };

    return (
        <CenterBox sx={style} {...rest} >
            {children}
        </CenterBox >
    );
};

export default TabPanel;