import { Box, Button, FormHelperText, FormControl, TextField, Alert } from '@mui/material';
import React, { useContext, useRef, useState } from 'react';
import { isEmailValid, isPasswordValid } from '../../lib/Validator';
import PasswordField from '../controls/PasswordField';
import { ThemeContext } from '../../lib/context/ThemeContext';
import { signIn } from 'next-auth/react';
import { LoginDialogContext } from '../../lib/context/LoginDialogContext';
import { ToastContext } from '../../lib/context/ToastContext';
import CircularLoading from '../controls/CircularLoading';
import { LanguageContext } from '../../lib/context/LanguageContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { PostData, SigninResult } from '../../lib/FetchData';
import { getResponseError } from '../../lib/Language';
import { MessageDialogContext } from '../../lib/context/MessageDialogContext';


const LoginTab = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [captcha, setCaptcha] = useState<string | false>(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setToast } = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useContext(LanguageContext);
    const { loginDialog, notification, messageDialog } = language;
    const rightToLeft = language.settings.rightToLeft;
    const { loginTab, captchaProviderError } = loginDialog;
    const [captchaError, setCaptchaError] = useState(false);
    const { setMessageDialog } = useContext(MessageDialogContext);
    const passwordReadyReset = messageDialog.passwordReadyReset;

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

        if (captcha !== false) {
            setIsLoading(true);
            const values = { redirect: false, email: emailRef.current!.value, password: passwordRef.current!.value, requestId: captcha };
            const response = await signIn('credentials', values) as any as SigninResult;
            if (response.ok) {
                setLoginDialogOpen(false);
                setToast({ id: Date.now(), message: notification.successfullyLogin, alertColor: 'success' });
            }
            else {
                setToast({ id: Date.now(), message: getResponseError(response.error as string, language), alertColor: 'error' });

            }
            setIsLoading(false);
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
    const resetPassword = async () => {

        if (!validateEmail()) {
            setToast({ id: Date.now(), message: notification.invalidEmailFormat, alertColor: 'error' });
            return;
        }
        if (captcha !== false) {
            setIsLoading(true);
            const response = await PostData(process.env.NEXT_PUBLIC_WEB_URL + '/api/resetPassword', { email: emailRef.current!.value, requestId: captcha });
            setIsLoading(false);
            if (!response) {
                setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
                return;
            }
            if (response.status === 200) {
                setLoginDialogOpen(false);
                setMessageDialog({ isMessageDialogOpen: true, title: passwordReadyReset.title, message: passwordReadyReset.message });
            }
            else {
                let { error } = response.data as { error: string; };
                error = !error ? `HTML_ERROR_${response.status}` : error;
                setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
            }
        }
        else
            setToast({ id: Date.now(), message: notification.invalidCaptchaFormat, alertColor: 'error' });

    };
    return (
        <FormControl component='form' sx={{gap:'1rem'}} onSubmit={handleSubmit}>
            <TextField
                required
                id='login-email-required'
                label={loginTab.email}
                type='email'
                helperText={loginTab.emailHelperText}
                inputRef={emailRef}
                error={emailError}
                onBlur={() => validateEmail()}
                InputProps={{
                    dir: 'ltr'
                }}

            />
            <PasswordField
                required
                id='login-password-required'
                label={loginTab.password}
                helperText={loginTab.passwordHelperText}
                sx={{ marginTop: '1rem' }}
                inputRef={passwordRef}
                error={passwordError}
                onBlur={() => validatePassword()}
                inputProps={{ style: { direction: 'ltr', order: rightToLeft ? 1 : -1 } }}

            />
            <Alert severity='info'>{loginTab.forgetPassword}</Alert>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                    size='compact'
                    theme={prefersDarkMode ? 'dark' : 'light'}
                    onErrored={() => setCaptchaError(true)}
                    onChange={handleCaptchaChange}
                />
                {captcha === false && <FormHelperText error>{loginTab.captchaHelperText}</FormHelperText>}
                {captchaError && <Alert severity='error'>{captchaProviderError}</Alert>}

            </Box>

            {isLoading ?
                <CircularLoading />
                :
                <>
                    <Button type='submit'>{loginTab.login}</Button>
                    <Button onClick={()=>resetPassword()}>{loginTab.resetPassword}</Button>
                </>

            }

        </FormControl>
    );
};

export default LoginTab;



