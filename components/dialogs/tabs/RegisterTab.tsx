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
import { postData } from '../../../lib/axiosRequest';
import { ThemeContext } from '../../context/ThemeContext';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { isEmailValid, isPasswordValid } from '../../../lib/validator';

const RegisterTab = () => {

    const [captcha, setCaptcha] = useState<string | false>(false);
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [captchaError, setCaptchaError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const { language } = useContext(LanguageContext);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setInformationDialog } = useContext(InformationDialogContext);
    const { setToast } = useContext(ToastContext);

    const { loginDialog, notification, informationDialog, submitForm } = language;
    const registerTab = loginDialog.registerTab;
    const { direction } = language.settings;
    const successfullyRegister = informationDialog.userCreatedSuccessfully;

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
            const response = await postData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/Register', values);
            setIsLoading(false);

            if (!response) {
                setToast({ id: Date.now(), message: getResponseError('ERR_UNKNOWN', language), alertColor: 'error' });
                return;
            }
            if (response.status === 200) {
                setLoginDialogOpen(false);
                setInformationDialog({ isInformationDialogOpen: true, title: successfullyRegister.title, message: successfullyRegister.message });
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

    const validateConfirmPassword = () => {
        const password = passwordRef.current?.value || '';
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
                id='register-password-required'
                label={submitForm.password}
                helperText={submitForm.passwordHelperText}
                sx={{ marginTop: '1rem' }}
                inputRef={passwordRef}
                error={passwordError}
                onBlur={() => validatePassword()}
                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
            />
            <PasswordField
                required
                id='register-confirmPassword-required'
                label={submitForm.confirmPassword}
                helperText={submitForm.confirmPasswordHelperText}
                sx={{ marginTop: '1rem' }}
                inputRef={confirmPasswordRef}
                error={confirmPasswordError}
                onBlur={() => validateConfirmPassword()}
                inputProps={{ style: { direction: 'ltr', order: direction === 'rtl' ? 1 : -1 } }}
            />
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
                    <Button type='submit' sx={{ marginTop: '1rem' }}>{registerTab.register}</Button>
                }
            </CenterBox>
        </FormControl>
    );
};

export default RegisterTab;