import React, { useContext } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { MessageDialogContext } from '../../lib/context/MessageDialogContext';
export interface MessageDialogProps {
    isMessageDialogOpen: boolean;
    message: string;
    title: string;
}

const MessageDialog = () => {
    const { language } = useContext(LanguageContext);
    const { settings, messageDialog } = language;
    const { messageDialogInfo, setMessageDialog } = useContext(MessageDialogContext);
    const rightToLeft = settings.rightToLeft;
    const handleClose = () => {
        setMessageDialog({ isMessageDialogOpen: false, message: '', title: '' });
    };
    return (
        <Dialog
            open={messageDialogInfo.isMessageDialogOpen}
            onClose={handleClose}
            aria-labelledby='language-dialog-title'
            aria-describedby='language-dialog-description'
            dir={rightToLeft ? 'rtl' : 'ltr'}
        >
            <DialogTitle id='language-dialog-title'>
                {messageDialogInfo.title}
            </DialogTitle>
            <DialogContent >
                <Typography variant='subtitle1' component='p'>{messageDialogInfo.message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>{messageDialog.ok}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageDialog;




