import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import FormControl from '@mui/material/FormControl';
import Loader from '../../controls/Loader';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { isEmailValid } from '../../../lib/validator';
import { postData } from '../../../lib/axiosRequest';
import { signOut, useSession } from 'next-auth/react';
import TextField from '@mui/material/TextField';
import { Alert } from '@mui/material';

const EmailUpdateTab = () => {

    const currentEmailRef = useRef<HTMLInputElement>(null);
    const newEmailRef = useRef<HTMLInputElement>(null);
    const confirmEmailRef = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);

    const session = useSession();

    const [currentEmailError, setCurrentEmailError] = useState(false);
    const [newEmailError, setNewEmailError] = useState(false);
    const [confirmEmailError, setConfirmEmailError] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const { settings, submitForm, notification, advanceSettingsDialog } = language;
    const { direction } = settings;

    const validateCurrentEmail = () => {
        const currentEmail = currentEmailRef.current?.value || '';
        setCurrentEmailError(!isEmailValid(currentEmail));
    };
    const validateNewEmail = () => {
        const newEmail = newEmailRef.current?.value || '';
        setNewEmailError(!isEmailValid(newEmail));
    };
    const validateConfirmEmail = () => {
        const newEmail = newEmailRef.current?.value || '';
        const confirmEmail = confirmEmailRef.current?.value || '';
        setConfirmEmailError(confirmEmail !== newEmail || !isEmailValid(confirmEmail));
    };
    const checkEmails = () => {
        validateCurrentEmail();
        validateNewEmail();
        validateConfirmEmail();
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        checkEmails();

        if (currentEmailError) {
            setToast({ id: Date.now(), message: notification.currentEmailFormatError, alertColor: 'error' });
            return;
        }
        if (newEmailError) {
            setToast({ id: Date.now(), message: notification.newEmailFormatError, alertColor: 'error' });
            return;
        }
        if (confirmEmailError) {
            setToast({ id: Date.now(), message: notification.emailNotMatch, alertColor: 'error' });
            return;
        }
        const currentEmail = currentEmailRef.current?.value || '';
        const newEmail = newEmailRef.current?.value || '';
        const email = session.data?.user?.email || '';

        if (currentEmail !== email) {
            setToast({ id: Date.now(), message: notification.currentEmailError, alertColor: 'error' });
            setCurrentEmailError(true);
            return;
        }
        if (currentEmail === newEmail) {
            setToast({ id: Date.now(), message: notification.newEmailSameAsCurrent, alertColor: 'error' });
            return;
        }
        if (email === '') {
            setToast({ id: Date.now(), message: notification.emailNotSet, alertColor: 'error' });
            return;
        }
        const values = { currentEmail: currentEmail, newEmail: newEmail };
        setLoadingMessage(advanceSettingsDialog.updatingEmail);
        const response = await postData(process.env.NEXT_PUBLIC_WEB_URL + '/api/settings/updateEmail', values);
        setLoadingMessage('');

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Date.now(), message: notification.successfullyChangeEmail, alertColor: 'success' });
            await signOut();
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
                            <TextField
                                required
                                type='email'
                                id='old-email-required'
                                label={submitForm.currentEmail}
                                helperText={submitForm.currentEmailHelperText}
                                sx={{ width: '100%', maxWidth: '400px' }}
                                error={currentEmailError}
                                onBlur={() => validateCurrentEmail()}
                                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
                                inputRef={currentEmailRef}
                            />
                            <TextField
                                required
                                type='email'
                                id='new-email-required'
                                label={submitForm.newEmail}
                                helperText={submitForm.emailHelperText}
                                sx={{ width: '100%', maxWidth: '400px' }}
                                error={newEmailError}
                                onBlur={() => validateNewEmail()}
                                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
                                inputRef={newEmailRef}
                            />
                            <TextField
                                required
                                type='email'
                                id='confirm-email-required'
                                label={submitForm.confirmEmail}
                                helperText={submitForm.confirmEmailHelperText}
                                sx={{ width: '100%', maxWidth: '400px' }}
                                error={confirmEmailError}
                                onBlur={() => validateConfirmEmail()}
                                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
                                inputRef={confirmEmailRef}
                            />
                            <Alert severity='warning'>
                                {advanceSettingsDialog.emailUpdateInfo}
                            </Alert>
                            <Button variant='contained' type='submit'>{advanceSettingsDialog.updateAndLogin}</Button>
                        </CenterBox>
                    </FormControl>
            }
        </>
    );
};

export default EmailUpdateTab;