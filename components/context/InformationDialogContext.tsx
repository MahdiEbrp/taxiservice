import { createContext, Dispatch } from 'react';
import { InformationDialogProps } from '../dialogs/InformationDialog';

export const InformationDialogContext = createContext<{
    messageDialogInfo: InformationDialogProps; setInformationDialog: Dispatch<InformationDialogProps>;
}>({
    messageDialogInfo: { isInformationDialogOpen: false, message: '', title: '' },
    setInformationDialog: () => void 0,
});
