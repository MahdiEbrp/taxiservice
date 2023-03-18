import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import CircularLoading from '../../controls/CircularLoading';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import PasswordField from '../../controls/PasswordField';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useContext, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../../context/LanguageContext';
import { LoginDialogContext } from '../../context/LoginDialogContext';
import { InformationDialogContext } from '../../context/InformationDialogContext';
import { postData, SigninResult } from '../../../lib/axiosRequest';
import { ThemeContext } from '../../context/ThemeContext';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { isEmailValid, isPasswordValid } from '../../../lib/validator';
import { signIn } from 'next-auth/react';
import { AllSettingsContext } from '../../context/AllSettingsContext';
const LoginTab = () => {

    const [captcha, setCaptcha] = useState<string | false>(false);
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [captchaError, setCaptchaError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const { language } = useContext(LanguageContext);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setInformationDialog } = useContext(InformationDialogContext);
    const { setToast } = useContext(ToastContext);
    const { setUserSettings } = useContext(AllSettingsContext);

    const { loginDialog, notification, informationDialog, submitForm } = language;
    const loginTab = loginDialog.loginTab;
    const passwordReadyReset = informationDialog.passwordReadyReset;
    const { direction } = language.settings;

    const handleSubmit = async (e: React.SyntheticEvent) => {

        e.preventDefault();

        setUserSettings(null);

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
            const values = { redirect: false, email: emailRef.current?.value, password: passwordRef.current?.value, requestId: captcha };
            const response = await signIn('credentials', values) as unknown as SigninResult;
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
        const email = emailRef.current?.value || '';
        const valid = isEmailValid(email);
        setEmailError(!valid);
        return valid;
    };

    const validatePassword = () => {
        const password = passwordRef.current?.value || '';
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
            const response = await postData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/sendResetPassword', { email: emailRef.current?.value, requestId: captcha });
            setIsLoading(false);
            if (!response) {
                setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
                return;
            }
            if (response.status === 200) {
                setLoginDialogOpen(false);
                setInformationDialog({ isInformationDialogOpen: true, title: passwordReadyReset.title, message: passwordReadyReset.message });
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
                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}

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

