import Box, { BoxProps } from '@mui/material/Box';
import { ElementType } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

const CenterBox: ElementType<BoxProps> = (props: BoxProps) => {

    const { children, ...other } = props;

    const newProps = { ...other };

    newProps.sx = { ...centerStyle, ...newProps.sx } as SxProps<Theme>;

    return (
        <Box {...newProps}>
            {children}
        </Box>
    );
};

export const centerStyle: SxProps<Theme> = {
    display: 'flex', flexDirection: 'column', maxWidth: '100vw'
    , alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem'
};

export default CenterBox;