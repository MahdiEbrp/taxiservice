import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Alert, AlertColor, Snackbar, Typography } from '@mui/material';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { ToastContext } from '../../lib/context/ToastContext';
export interface ToastProps {
    id: number;
    message: string;
    alertColor: AlertColor;
}
const ToastHandler = () => {
    /* #region Context section*/
    const { language } = useContext(LanguageContext);
    const { toast } = useContext(ToastContext);
    /* #endregion */
    const [open, setOpen] = useState(true);
    const [toastId, setToastId] = useState(0);
    const { id, message, alertColor } = toast;
    //3 second
    const autoHideDuration = 3 * 1000;
    /* #region Language section */
    const rightToLeft = language.settings.rightToLeft;
    /* #endregion */
    /* #region Callback hook section */
    useEffect(() => {
        if (toastId !== id) {
            setOpen(true);
            setToastId(id);
        }
    }, [toastId, id]);
    /* #endregion */
    if (id === 0)
        return <></>;
    /* #region Functions section */
    const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway')
            return;
        setOpen(false);
    };
    /* #endregion */
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