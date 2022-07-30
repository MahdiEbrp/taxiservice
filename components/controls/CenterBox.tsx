import { Box } from '@mui/material';
import { ElementType, ReactNode } from 'react';
const CenterBox: ElementType = (props: { children: ReactNode}) => {
    const { children, ...other } = props;
    return (
        <Box sx={{ padding: '2px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', gap: '1rem' }}  {...other}>
            {children}
        </Box>
    );
};

export default CenterBox;