import CircularLoading from '../../controls/CircularLoading';
import PasswordField from '../../controls/PasswordField';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useContext, useRef, useState } from 'react';
import { Button, FormHelperText, FormControl, TextField, Alert } from '@mui/material';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { LoginDialogContext } from '../../../lib/context/LoginDialogContext';
import { MessageDialogContext } from '../../../lib/context/MessageDialogContext';
import { PostData, SigninResult } from '../../../lib/FetchData';
import { ThemeContext } from '../../../lib/context/ThemeContext';
import { ToastContext } from '../../../lib/context/ToastContext';
import { getResponseError } from '../../../lib/Language';
import { isEmailValid, isPasswordValid } from '../../../lib/Validator';
import { signIn } from 'next-auth/react';
import CenterBox from '../../controls/CenterBox';
const LoginTab = () => {
    const [captcha, setCaptcha] = useState<string | false>(false);
    const [isLoading, setIsLoading] = useState(false);
    /* #region Reference section */
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    /* #endregion */
    /* #region Error section*/
    const [captchaError, setCaptchaError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    /* #endregion */
    /* #region Necessary context */
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setMessageDialog } = useContext(MessageDialogContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { loginDialog, notification, messageDialog, submitForm } = language;
    const loginTab = loginDialog.loginTab;
    const passwordReadyReset = messageDialog.passwordReadyReset;
    const { direction } = language.settings;
    /* #endregion */
    /* #region Functions section */
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
            const response = await PostData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/sendResetPassword', { email: emailRef.current!.value, requestId: captcha });
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
    /* #endregion */
    return (
        <FormControl component='form' sx={{ gap: '1rem' }} onSubmit={handleSubmit}>
            <TextField
                required
                id='login-email-required'
                label={submitForm.email}
                type='email'
                helperText={submitForm.emailHelperText}
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
                label={submitForm.password}
                helperText={loginTab.passwordHelperText}
                sx={{ marginTop: '1rem' }}
                inputRef={passwordRef}
                error={passwordError}
                onBlur={() => validatePassword()}
                inputProps={{ style: { direction: 'ltr', order: direction==='rtl' ? 1 : -1 } }}

            />
            <Alert severity='info'>{loginTab.forgetPassword}</Alert>
            <CenterBox>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                    size='compact'
                    theme={prefersDarkMode ? 'dark' : 'light'}
                    onErrored={() => setCaptchaError(true)}
                    onChange={handleCaptchaChange}
                />
                {captcha === false && <FormHelperText error>{submitForm.captchaHelperText}</FormHelperText>}
                {captchaError && <Alert severity='error'>{submitForm.captchaProviderError}</Alert>}
                {isLoading ?
                    <CircularLoading />
                    :
                    <>
                        <Button type='submit'>{loginTab.login}</Button>
                        <Button onClick={() => resetPassword()}>{loginTab.resetPassword}</Button>
                    </>

                }
            </CenterBox>
        </FormControl>
    );
};

export default LoginTab;



