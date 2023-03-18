import Box, { BoxProps } from '@mui/material/Box';
import { ElementType } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
export type ExtendedBoxProps = BoxProps & {
    wrapMode?: boolean;
};

const CenterBox: ElementType<ExtendedBoxProps> = (props: ExtendedBoxProps) => {

    const { children,wrapMode, ...other } = props;

    const newProps = { ...other };
    const wrapStyle: SxProps<Theme> =wrapMode ? { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseLine'} : null;
    newProps.sx = {  ...centerStyle,...wrapStyle, ...newProps.sx } as SxProps<Theme>;

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