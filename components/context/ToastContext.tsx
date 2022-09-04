import { createContext, Dispatch } from 'react';
import { EmptyToast, ToastProps } from '../controls/Toast';
export const ToastContext = createContext<{
    toast: ToastProps;
    setToast: Dispatch<ToastProps>;
}>({
    toast: EmptyToast,
    setToast: () => void 0
});