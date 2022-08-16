import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { ElementType, ReactNode } from 'react';

const CenterBox: ElementType = (props: { children: ReactNode; }) => {

    const { children, ...other } = props;
    const newProps = { ...centerStyle, ...other };

    return (
        <Box {...newProps}>
            {children}
        </Box>
    );
};

export const centerStyle: SxProps<Theme> = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem' };

export default CenterBox;