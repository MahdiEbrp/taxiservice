import CenterBox from './CenterBox';
import CircularLoading from './CircularLoading';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../context/LanguageContext';
import { useContext } from 'react';

const Loader = (props: { text: string; }) => {

    const { language } = useContext(LanguageContext);
    const { settings } = language;

    return (
        <CenterBox dir={settings.direction}>
            <CircularLoading />
            <Typography variant='body2'>{props.text}</Typography>
        </CenterBox>
    );
};

export default Loader;