import Alert, { AlertColor } from '@mui/material/Alert';
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../context/LanguageContext';
import { ToastContext } from '../context/ToastContext';

export type ToastProps = {
    id: number;
    message: string;
    alertColor: AlertColor;
};

const ToastHandler = () => {

    const { language } = useContext(LanguageContext);
    const { toast } = useContext(ToastContext);

    const [open, setOpen] = useState(true);
    const [toastId, setToastId] = useState(0);
    const { id, message, alertColor } = toast;
    //3 seconds
    const autoHideDuration = 3 * 1000;

    const { direction } = language.settings;

    useEffect(() => {
        if (toastId !== id) {
            setOpen(true);
            setToastId(id);
        }
    }, [toastId, id]);

    if (id === 0)
        return <></>;

    const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway')
            return;
        setOpen(false);
    };

    return (
        <Snackbar dir={direction} open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={alertColor} sx={{ width: '100%' }}>
                <Typography>{message}</Typography>
            </Alert>
        </Snackbar>
    );
};
export const EmptyToast = { id: 0, message: '', alertColor: 'info' } as ToastProps;
export default ToastHandler;