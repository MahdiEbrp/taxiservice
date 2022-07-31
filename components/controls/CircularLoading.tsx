import CenterBox from './CenterBox';
import { CircularProgress } from '@mui/material';
import { ElementType, ReactNode } from 'react';
const CircularLoading: ElementType = (props:{children:ReactNode}) => {
    const {children,...other} = props;
    return (
        <CenterBox {...other}>
            <CircularProgress />
            {children}
        </CenterBox>
    );
};

export default CircularLoading;