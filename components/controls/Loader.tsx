import CenterBox from './CenterBox';
import CircularLoading from './CircularLoading';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../context/LanguageContext';
import React,{useContext } from 'react';
export type LoaderProps = {
    text: string;
    usePaper?: boolean;
};
const Loader = (props:LoaderProps) => {
    const {text, usePaper} = props;
    const { language } = useContext(LanguageContext);
    const { settings } = language;
    const Parent = usePaper ? Paper : React.Fragment;
    return (
        <Parent>
            <CenterBox dir={settings.direction}>
                <CircularLoading />
                <Typography variant='body2'>{text}</Typography>
            </CenterBox>
        </Parent>
    );
};

export default Loader;