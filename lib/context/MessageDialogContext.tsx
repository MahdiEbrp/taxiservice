import { createContext, Dispatch } from 'react';
import { MessageDialogProps } from '../../components/dialogs/MessageDialog';

export const MessageDialogContext = createContext<{
    messageDialogInfo: MessageDialogProps; setMessageDialog: Dispatch<MessageDialogProps>;
}>({
    messageDialogInfo: { isMessageDialogOpen: false, message: '', title: '' },
    setMessageDialog: () => void 0,
});
