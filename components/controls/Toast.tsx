import { Alert, AlertColor, Snackbar, Typography } from '@mui/material';
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { ToastContext } from '../../lib/context/ToastContext';
export interface ToastProps {
    id: number;
    message: string;
    alertColor: AlertColor;
}
const ToastHandler = () => {
    const { toast } = useContext(ToastContext);
    const [open, setOpen] = useState(true);
    const { id, message, alertColor } = toast;
    const [toastId, setToastId] = useState(0);
    const { language } = useContext(LanguageContext);
    const rightToLeft = language.settings.rightToLeft;
    const autoHideDuration = 3*1000;
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
        <Snackbar dir={rightToLeft ? 'rtl' : 'ltr'} open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={alertColor} sx={{ width: '100%' }}>
                <Typography>{message}</Typography>
            </Alert>
        </Snackbar>
    );
};
export const EmptyToast = { id: 0, message: '', alertColor: 'info' } as ToastProps;

export default ToastHandler;