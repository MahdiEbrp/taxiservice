import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { MessageDialogContext } from '../../lib/context/MessageDialogContext';
import { useContext } from 'react';
export interface MessageDialogProps {
    isMessageDialogOpen: boolean;
    message: string;
    title: string;
}
const MessageDialog = () => {
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { messageDialogInfo, setMessageDialog } = useContext(MessageDialogContext);
    /* #endregion */
    /* #region Language section */
    const { settings, messageDialog } = language;
    const { direction } = settings;
    /* #endregion */
    /* #region Functions section */
    const handleClose = () => {
        setMessageDialog({ isMessageDialogOpen: false, message: '', title: '' });
    };
    /* #endregion */
    return (
        <Dialog
            open={messageDialogInfo.isMessageDialogOpen}
            onClose={handleClose}
            aria-labelledby='language-dialog-title'
            aria-describedby='language-dialog-description'
            dir={direction}
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




