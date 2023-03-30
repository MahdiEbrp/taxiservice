import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LanguageContext } from '../context/LanguageContext';
import { LanguageDialogContext } from '../context/LanguageDialogContext';
import { ToastContext } from '../context/ToastContext';
import { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { languageList } from '../../lib/languages/list';
import AutoCompletePlus, { TaggedItem } from '../controls/AutoCompletePlus';
import CenterBox from '../controls/CenterBox';
import importLanguage from '../../lib/language';
const LanguageDialog = () => {

    const { isLanguageDialogOpen, setLanguageDialogOpen } = useContext(LanguageDialogContext);
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);

    const router = useRouter();

    const { settings, languageDialog } = language;
    const [languageCode, setLanguageCode] = useState(settings.code);
    const { direction } = settings;

    const handleClose =async (saveMode: boolean) => {
        setLanguageDialogOpen(false);
        if (saveMode === true) {
            const changedLanguage =await importLanguage(languageCode);
            setToast({ id: Date.now(), message: changedLanguage.notification.changedLanguage, alertColor: 'success' });
            router.push(router.pathname, undefined, { locale: languageCode, shallow: true });
        }

    };
    const languages = languageList().map((language) => {
        return {
            displayText: language.name,
            tag: language.code
        };
    });
    const selectedValue = useMemo(() => {
        return languages.find(l => l.tag === settings.code)?.displayText || '';
    }, [languages, settings.code]);

    const handleChange = (code :TaggedItem<string> | null) => {
        if (code)
            setLanguageCode(code.tag);
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
                <CenterBox>
                    <AutoCompletePlus label='' items={languages}
                        selectedValue={selectedValue} onChanged={handleChange}
                    />
                </CenterBox>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>{languageDialog.discard}</Button>
                <Button onClick={() => handleClose(true)} autoFocus>{languageDialog.save}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LanguageDialog;

