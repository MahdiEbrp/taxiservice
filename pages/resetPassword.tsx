import Head from 'next/head';
import PasswordField from '../components/controls/PasswordField';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useState, useContext, useRef } from 'react';
import { Alert, Box, Button, Card, CardContent, CardHeader, FormControl, FormHelperText, Paper } from '@mui/material';
import { LanguageContext } from '../lib/context/LanguageContext';
import { LoginDialogContext } from '../lib/context/LoginDialogContext';
import { MessageDialogContext } from '../lib/context/MessageDialogContext';
import { NextPage } from 'next';
import { PostData } from '../lib/FetchData';
import { ThemeContext } from '../lib/context/ThemeContext';
import { ToastContext } from '../lib/context/ToastContext';
import { isPasswordValid } from '../lib/Validator';
import { useRouter } from 'next/router';
const ResetPassword: NextPage = () => {
    const [captcha, setCaptcha] = useState<string | false>(false);
    const [isLoading, setIsLoading] = useState(false);
    /* #region Reference section */
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    /* #endregion */
    /* #region Error section */
    const [captchaError, setCaptchaError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    /* #endregion */
    /* #region Router section */
    const router = useRouter();
    const code = router.query['code'] as string || '';
    /* #endregion */
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setLoginDialogOpen } = useContext(LoginDialogContext);
    const { setMessageDialog } = useContext(MessageDialogContext);
    const { setToast } = useContext(ToastContext);    /* #endregion */
    /* #region Language section */
    const { settings, resetPasswordPage, submitForm, notification } = language;
    const rightToLeft = settings.rightToLeft;
    /* #endregion */
    /* #region Functions section */
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
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!validatePassword()) {
            setToast({ id: Date.now(), message: notification.invalidPasswordFormat, alertColor: 'error' });
            return;
        }

        if (captcha !== false) {
            setIsLoading(true);
            const values = { password: passwordRef.current!.value, requestId: captcha, updateCode:code };
            const response = await PostData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/updatePassword', values);
            setIsLoading(false);
        }
        else
            setToast({ id: Date.now(), message: notification.invalidCaptchaFormat, alertColor: 'error' });

    };
    /* #endregion */
    return (
        <>
            <Head>
                <title>{resetPasswordPage.title}</title>
            </Head>
            <Card dir={settings.rightToLeft ? 'rtl' : 'ltr'} sx={{ margin: '15px' }}>
                    <CardHeader title={resetPasswordPage.title} />
                    <CardContent>
                        <FormControl component='form' sx={{ gap: '1rem' }} onSubmit={handleSubmit}>
                            <PasswordField
                                required
                                id='register-password-required'
                                label={submitForm.password}
                                helperText={submitForm.passwordHelperText}
                                sx={{ marginTop: '1rem' }}
                                inputRef={passwordRef}
                                error={passwordError}
                                onBlur={() => validatePassword()}
                                inputProps={{ style: { direction: 'ltr', order: rightToLeft ? 1 : -1 } }}
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
                                {captcha === false && <FormHelperText error>{submitForm.captchaHelperText}</FormHelperText>}
                                {captchaError && <Alert severity='error'>{submitForm.captchaProviderError}</Alert>}
                            </Box>
                            <Button sx={{ margin: 'auto' }} type='submit'>{resetPasswordPage.resetPassword}</Button>
                        </FormControl>
                    </CardContent>
            </Card>
        </>
    );
};

export default ResetPassword;