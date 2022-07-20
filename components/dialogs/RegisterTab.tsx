import { Alert, Box, Button, FormControl, FormHelperText, TextField } from '@mui/material';
import  React,{ useContext, useRef, useState } from 'react';
import { isEmailValid, isPasswordValid } from '../../lib/Validator';
import PasswordField from '../controls/PasswordField';
import { ThemeContext } from '../../lib/context/ThemeContext';
import { LoginDialogContext } from '../../lib/context/LoginDialogContext';
import { ToastContext } from '../../lib/context/ToastContext';
import CircularLoading from '../controls/CircularLoading';
import { LanguageContext } from '../../lib/context/LanguageContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { PostData as PostData } from '../../lib/FetchData';
import { getResponseError } from '../../lib/Language';
import { MessageDialogContext } from '../../lib/context/MessageDialogContext';

const RegisterTab = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [captcha, setCaptcha] = useState<string | false>(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setToast } = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useContext(LanguageContext);
    const { loginDialog, notification,messageDialog } = language;
    const rightToLeft = language.settings.rightToLeft;
    const { registerTab, captchaProviderError } = loginDialog;
    const [captchaError, setCaptchaError] = useState(false);
    const { setMessageDialog } = useContext(MessageDialogContext);
    const successfullyRegister = messageDialog.userCreatedSuccessfully;
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateEmail()) {
            setToast({ id: Date.now(), message: notification.invalidEmailFormat, alertColor: 'error' });
            return;
        }
        if (!validatePassword()) {
            setToast({ id: Date.now(), message: notification.invalidPasswordFormat, alertColor: 'error' });
            return;
        }
        if (!validateConfirmPassword()) {
            setToast({ id: Date.now(), message: notification.invalidConfirmPassword, alertColor: 'error' });
            return;
        }
        if (captcha !== false) {
            const email = emailRef.current?.value || '';
            const password = passwordRef.current?.value || '';
            const values = { email: email, password: password, requestId: captcha };
            setIsLoading(true);
            const response = await PostData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/Register', values);
            setIsLoading(false);

            if (!response) {
                setToast({ id: Date.now(), message: getResponseError('ERR_UNKNOWN', language), alertColor: 'error' });
                return;
            }
            if (response.status === 200) {
                setLoginDialogOpen(false);
                setMessageDialog({ isMessageDialogOpen: true, title: successfullyRegister.title, message: successfullyRegister.message });
            }
            else {
                const result = response.data as { error: string};
                setToast({ id: Date.now(), message: getResponseError(result.error,language), alertColor: 'error' });
            }
        }
        else
            setToast({ id: Date.now(), message: notification.invalidCaptchaFormat, alertColor: 'error' });

    };
    const validateEmail = () => {
        const email = emailRef.current!.value || '';
        const valid = isEmailValid(email);
        setEmailError(!valid);
        return valid;
    };
    const validatePassword = () => {
        const password = passwordRef.current!.value || '';
        const valid = isPasswordValid(password);
        setPasswordError(!valid);
        return valid;
    };

    const validateConfirmPassword = () => {
        const password = passwordRef.current!.value || '';
        const confirmPassword = confirmPasswordRef.current?.value || '';
        const valid = password === confirmPassword;
        setConfirmPasswordError(!valid);
        return valid;
    };

    const handleCaptchaChange = (token: string | null) => {
        if (captchaError)
            setCaptchaError(false);

        if (typeof token === 'string') {
            setCaptcha(token);
        }
        else {
            setCaptcha(false);
        }
    };

    return (
        <FormControl component='form' onSubmit={handleSubmit}>
            <TextField
                required
                id='register-email-required'
                label={registerTab.email}
                type='email'
                helperText={registerTab.emailHelperText}
                inputRef={emailRef}
                error={emailError}
                onBlur={() => validateEmail()}
                InputProps={{
                    dir: 'ltr'
                }}
            />
            <PasswordField
                required
                id='register-password-required'
                label={registerTab.password}
                helperText={registerTab.passwordHelperText}
                sx={{ marginTop: '1rem' }}
                inputRef={passwordRef}
                error={passwordError}
                onBlur={() => validatePassword()}
                inputProps={{ style: { direction: 'ltr', order: rightToLeft ? 1 : -1 } }}
            />
            <PasswordField
                required
                id='register-confirmPassword-required'
                label={registerTab.confirmPassword}
                helperText={registerTab.confirmPasswordHelperText}
                sx={{ marginTop: '1rem' }}
                inputRef={confirmPasswordRef}
                error={confirmPasswordError}
                onBlur={() => validateConfirmPassword()}
                inputProps={{ style: { direction: 'ltr', order: rightToLeft ? 1 : -1 } }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                    size='compact'
                    theme={prefersDarkMode ? 'dark' : 'light'}
                    onErrored={() => setCaptchaError(true)}
                    onChange={handleCaptchaChange}
                />
                {captcha === false && <FormHelperText error>{registerTab.captchaHelperText}</FormHelperText>}
                {captchaError && <Alert severity='error'>{captchaProviderError}</Alert>}
            </Box>

            {isLoading ?
                <CircularLoading />
                :
                <Button type='submit' sx={{ marginTop: '1rem' }}>{registerTab.register}</Button>
            }

        </FormControl>
    );
};

export default RegisterTab;