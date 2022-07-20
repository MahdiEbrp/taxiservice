import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { LanguageDialogContext } from '../../lib/context/LanguageDialogContext';
import { ToastContext } from '../../lib/context/ToastContext';
import { useRouter } from 'next/router';
import { LanguageContext } from '../../lib/context/LanguageContext';
import  GetLanguage  from '../../lib/Language';
const LanguageDialog = () => {

    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { setToast } = useContext(ToastContext);
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    const { settings, languageDialog } = language;
    const [languageCode, setLanguageCode] = useState(settings.code);

    const rightToLeft = settings.rightToLeft;

    useEffect(() => {
        setLanguageCode(settings.code);
    }, [settings.code]);

    const handleClose = (saveMode: boolean) => {
        setLanguageDialogOpen(false);
        if (saveMode === true) {
            const changedLanguage = GetLanguage(languageCode).notification.changedLanguage;
            setToast({ id: Date.now(), message: changedLanguage, alertColor: 'success' });
            router.push('/', undefined, { locale: languageCode, shallow: true });
        }

    };
    return (

        <Dialog
            open={isLanguageDialogOpen}
            onClose={handleClose}
            aria-labelledby='language-dialog-title'
            aria-describedby='language-dialog-description'
            dir={rightToLeft ? 'rtl' : 'ltr'}
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
                <Button onClick={() => handleClose(false)}>{ languageDialog.discard}</Button>
                <Button onClick={() => handleClose(true)} autoFocus>{languageDialog.save}</Button>
            </DialogActions>

        </Dialog>
    );
};

export default LanguageDialog;


