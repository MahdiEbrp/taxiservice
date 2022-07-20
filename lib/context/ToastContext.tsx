import { createContext, Dispatch } from 'react';
import {EmptyToast, ToastProps} from '../../components/controls/Toast';
export const ToastContext = createContext<{
    toast: ToastProps;
    setToast: Dispatch<ToastProps>;
}>({
    toast: EmptyToast,
    setToast: () => { }
});