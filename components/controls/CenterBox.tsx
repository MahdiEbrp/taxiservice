import Box from '@mui/material/Box';
import { ElementType, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
const CenterBox: ElementType = (props: { children: ReactNode}) => {
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