import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import GetLanguage from '../../lib/language';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { LanguageContext } from '../context/LanguageContext';
import { LanguageDialogContext } from '../context/LanguageDialogContext';
import { ToastContext } from '../context/ToastContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const LanguageDialog = () => {

    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);

    const router = useRouter();

    const { settings, languageDialog } = language;
    const [languageCode, setLanguageCode] = useState(settings.code);
    const { direction } = settings;

    useEffect(() => {
        setLanguageCode(settings.code);
    }, [settings.code]);

    const handleClose = (saveMode: boolean) => {
        setLanguageDialogOpen(false);
        if (saveMode === true) {
            const changedLanguage = GetLanguage(languageCode).notification.changedLanguage;
            setToast({ id: Date.now(), message: changedLanguage, alertColor: 'success' });
            router.push(router.pathname, undefined, { locale: languageCode, shallow: true });
        }

    };

    return (
        <Dialog
            open={isLanguageDialogOpen}
            onClose={handleClose}
            aria-labelledby='language-dialog-title'
            aria-describedby='language-dialog-description'
            dir={direction}
        >
            <DialogTitle id='language-dialog-title'>
                {languageDialog.title}
            </DialogTitle>
            <DialogContent >
                <FormControl>
                    <RadioGroup
                        aria-labelledby='language-group-label'
                        name='language-buttons-group'
                        value={languageCode}
                    >
                        <FormControlLabel value='en' control={<Radio />} onClick={() => setLanguageCode('en')} label='English' />
                        <FormControlLabel value='fa' control={<Radio />} onClick={() => setLanguageCode('fa')} label='Persian-فارسی' />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>{languageDialog.discard}</Button>
                <Button onClick={() => handleClose(true)} autoFocus>{languageDialog.save}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LanguageDialog;

