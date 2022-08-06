import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CenterBox from './controls/CenterBox';
import CircularLoading from './controls/CircularLoading';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import PasswordField from '../components/controls/PasswordField';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useContext, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { FaHandPeace } from 'react-icons/fa';
import { LanguageContext } from '../lib/context/LanguageContext';
import { PostData } from '../lib/FetchData';
import { ThemeContext } from '../lib/context/ThemeContext';
import { ToastContext } from '../lib/context/ToastContext';
import { getResponseError } from '../lib/Language';
import { isPasswordValid } from '../lib/Validator';
import { useRouter } from 'next/router';
const ResetPasswordForm = () => {
    const [captcha, setCaptcha] = useState<string | false>(false);
    /* #region Router section */
    const router = useRouter();
    const code = router.query['code'] as string || '';
    /* #endregion */
    /* #region Response section */
    const [isRedirecting, setRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isCodeExpired, setIsCodeExpired] = useState(false);
    /* #endregion */
    /* #region Reference section */
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    /* #endregion */
    /* #region Error section */
    const [captchaError, setCaptchaError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    /* #endregion */
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { prefersDarkMode } = useContext(ThemeContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { settings, resetPasswordPage, submitForm, notification } = language;
    const { direction } = settings;
    /* #endregion */
    /* #region  Functions section */
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
            if (!code) {
                setToast({ id: Date.now(), message: getResponseError('ERR_INVALID_CODE', language), alertColor: 'error' });
                return;
            }
            setIsLoading(true);
            const values = { password: passwordRef.current!.value, requestId: captcha, updateCode: code };
            const response = await PostData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/updatePassword', values);
            setIsLoading(false);
            if (!response) {
                setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
                return;
            }
            if (response.status === 200) {
                setToast({ id: Date.now(), message: resetPasswordPage.successToastMessage, alertColor: 'success' });
                setIsDone(true);
                return;
            }
            let { error } = response.data as { error: string; };
            error = !error ? `HTML_ERROR_${response.status}` : error;
            if (error === 'ERR_REQUEST_EXPIRED')
                setIsCodeExpired(true);
            setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
        }
        else
            setToast({ id: Date.now(), message: notification.invalidCaptchaFormat, alertColor: 'error' });

    };
    const redirect = async () => {
        if (isRedirecting)
            return;
        setRedirecting(true);
        setIsLoading(true);
        await router.push('/');
    };
    /* #endregion */
    return (
        <>
            <CenterBox sx={{ display: isLoading ? 'flex' : 'none' }}>
                <CircularLoading />
                <Typography>
                    {isRedirecting ? resetPasswordPage.redirectingToHomePage : resetPasswordPage.loading}
                </Typography>
            </CenterBox>
            <FormControl component='form' sx={{ display: !isLoading && !isDone && !isCodeExpired ? 'flex' : 'none', gap: '1rem' }} onSubmit={handleSubmit}>
                <PasswordField
                    required
                    id='register-password-required'
                    label={submitForm.newPassword}
                    helperText={submitForm.passwordHelperText}
                    sx={{ marginTop: '1rem' }}
                    inputRef={passwordRef}
                    error={passwordError}
                    onBlur={() => validatePassword()}
                    inputProps={{ style: { direction: 'ltr', order: direction==='rtl' ? 1 : -1 } }}
                />
                <PasswordField
                    required
                    id='register-confirmPassword-required'
                    label={submitForm.confirmNewPassword}
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
                    <Button type='submit'>{resetPasswordPage.resetPassword}</Button>
                </CenterBox>
            </FormControl>
            {!isLoading ?
                <CenterBox>
                    {isDone ?
                        <>
                            <Typography variant='h5' sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }} >
                                <FaHandPeace />
                                {resetPasswordPage.operationSuccess}
                            </Typography>
                            <Divider variant='middle' />
                            <Typography>
                                {resetPasswordPage.successMessage}
                            </Typography>
                        </>
                        :
                        <>
                            {isCodeExpired ?
                                <Typography>
                                    {resetPasswordPage.expiredMessage}
                                </Typography>
                                :
                                <></>
                            }
                        </>
                    }

                    <Button onClick={() => redirect()}>{resetPasswordPage.return}</Button>
                </CenterBox>
                :
                <></>
            }


        </>
    );
};

export default ResetPasswordForm;