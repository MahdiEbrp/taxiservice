import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LanguageContext } from '../context/LanguageContext';
import { useContext, useState, useEffect } from 'react';

export type advancedSettingsProps = {
    isDialogOpen: boolean;
    onClose: () => void;
};

const AdvanceSettingsDialog = (props: advancedSettingsProps) => {

    const { isDialogOpen, onClose } = props;
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false);

    const { settings, advanceSettingsDialog } = language;

    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    useEffect(() => {
        setOpen(isDialogOpen);
    }, [isDialogOpen]);

    return (
        <Dialog
            open={open}
            onClose={() => handleClose()}
            aria-labelledby='advance-setting-dialog-title'
            aria-describedby='advance-setting-dialog-description'
            dir={settings.direction}
        >
            <DialogTitle id='advance-setting-title'>
                {advanceSettingsDialog.title}
            </DialogTitle>
            <DialogContent>
                <div>Content</div>
            </DialogContent>2
            <DialogActions>
                <div>Actions</div>
            </DialogActions>
        </Dialog>
    );
};

export default AdvanceSettingsDialog;