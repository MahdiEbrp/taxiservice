import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { MessageDialogContext } from '../../lib/context/MessageDialogContext';
import { useContext } from 'react';
export interface MessageDialogProps {
    isMessageDialogOpen: boolean;
    message: string;
    title: string;
}
const MessageDialog = () => {

    const { language } = useContext(LanguageContext);
    const { messageDialogInfo, setMessageDialog } = useContext(MessageDialogContext);

    const { settings, messageDialog } = language;
    const { direction } = settings;

    const handleClose = () => {
        setMessageDialog({ isMessageDialogOpen: false, message: '', title: '' });
    };

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

