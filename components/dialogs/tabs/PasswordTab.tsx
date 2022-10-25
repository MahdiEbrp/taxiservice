import FormControl from '@mui/material/FormControl';
import PasswordField from '../../controls/PasswordField';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { isPasswordValid } from '../../../lib/validator';
import { LanguageContext } from '../../context/LanguageContext';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import Loader from '../../controls/Loader';
import CenterBox from '../../controls/CenterBox';
import { ToastContext } from '../../context/ToastContext';
import { postData } from '../../../lib/axiosRequest';
import { getResponseError } from '../../../lib/language';

const PasswordTab = () => {

    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);

    const session = useSession();

    const [currentPasswordError, setCurrentPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const { settings, submitForm, notification, advanceSettingsDialog } = language;
    const { direction } = settings;

    const validateCurrentPassword = () => {
        const currentPassword = currentPasswordRef.current?.value || '';
        setCurrentPasswordError(!isPasswordValid(currentPassword));
    };
    const validateNewPassword = () => {
        const newPassword = newPasswordRef.current?.value || '';
        setNewPasswordError(!isPasswordValid(newPassword));
    };
    const validateConfirmPassword = () => {
        const newPassword = newPasswordRef.current?.value || '';
        const confirmPassword = confirmPasswordRef.current?.value || '';
        setConfirmPasswordError(confirmPassword !== newPassword || !isPasswordValid(confirmPassword));
    };
    const checkPasswords = () => {
        validateCurrentPassword();
        validateNewPassword();
        validateConfirmPassword();
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        checkPasswords();

        if (currentPasswordError) {
            setToast({ id: Date.now(), message: notification.currentPasswordFormatError, alertColor: 'error' });
            return;
        }
        if (newPasswordError) {
            setToast({ id: Date.now(), message: notification.newPasswordFormatError, alertColor: 'error' });
            return;
        }
        if (confirmPasswordError) {
            setToast({ id: Date.now(), message: notification.passwordNotMatch, alertColor: 'error' });
            return;
        }
        const currentPassword = currentPasswordRef.current?.value || '';
        const newPassword = newPasswordRef.current?.value || '';
        const email = session.data?.user?.email || '';

        if (currentPassword === newPassword) {
            setToast({ id: Date.now(), message: notification.newPasswordSameAsCurrent, alertColor: 'error' });
            return;
        }
        if (email === '') {
            setToast({ id: Date.now(), message: notification.emailNotSet, alertColor: 'error' });
            return;
        }
        const values = { currentPassword: currentPassword, newPassword: newPassword };
        setLoadingMessage(advanceSettingsDialog.updatingPassword);
        const response = await postData('/api/settings/updatePassword', values);
        setLoadingMessage('');

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Date.now(), message: notification.successfullyChangePassword, alertColor: 'success' });
            return;
        }
        const { error } = response.data as { error: string; };
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });

    };

    useEffect(() => {
        if (session.status === 'loading') {
            setLoadingMessage(advanceSettingsDialog.loading);
        }
        else {
            setLoadingMessage('');
        }
    }, [advanceSettingsDialog.loading, session]);

    return (
        <>
            {
                loadingMessage !== '' ?
                    <Loader text={loadingMessage} />
                    :
                    <FormControl component='form' sx={{ gap: '1rem' }} onSubmit={handleSubmit}>
                        <CenterBox>
                            <PasswordField
                                required
                                id='old-password-required'
                                label={submitForm.currentPassword}
                                helperText={submitForm.currentPasswordHelperText}
                                sx={{ width: '100%', maxWidth: '400px' }}
                                error={currentPasswordError}
                                onBlur={() => validateCurrentPassword()}
                                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
                                inputRef={currentPasswordRef}
                            />
                            <PasswordField
                                required
                                id='new-password-required'
                                label={submitForm.newPassword}
                                helperText={submitForm.passwordHelperText}
                                sx={{ width: '100%', maxWidth: '400px' }}
                                error={newPasswordError}
                                onBlur={() => validateNewPassword()}
                                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
                                inputRef={newPasswordRef}
                            />
                            <PasswordField
                                required
                                id='confirm-password-required'
                                label={submitForm.confirmPassword}
                                helperText={submitForm.confirmPasswordHelperText}
                                sx={{ width: '100%', maxWidth: '400px' }}
                                error={confirmPasswordError}
                                onBlur={() => validateConfirmPassword()}
                                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
                                inputRef={confirmPasswordRef}
                            />
                            <Button variant='contained' type='submit'>{submitForm.update}</Button>
                        </CenterBox>
                    </FormControl>
            }
        </>
    );
};

export default PasswordTab;