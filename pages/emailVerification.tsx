import CircularLoading from '../components/controls/CircularLoading';
import Head from 'next/head';
import { BiMessageSquareError } from 'react-icons/bi';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { FiUserCheck } from 'react-icons/fi';
import { GetData } from '../lib/FetchData';
import { LanguageContext } from '../lib/context/LanguageContext';
import { NextPage } from 'next';
import { getResponseError } from '../lib/Language';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const Verify: NextPage = () => {
    /* #region Router section */
    const router = useRouter();
    const code = router.query['code'] as string || '';
    /* #endregion */
    /* #region  Context section */
    const { language } = useContext(LanguageContext);
    /* #endregion */
    /* #region Response section */
    const [errorCode, setError] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [isRedirecting, setRedirecting] = useState(false);
    const [isVerified, setVerified] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    /* #endregion */
    /* #region Language section */
    const { settings, emailVerificationPage } = language;
    const { problems } = emailVerificationPage;
    /* #endregion */
    /* #region Functions section */
    const resend = () => {
        setReloadData(true);
        setLoading(true);
    };
    const redirect = async () => {
        if (isRedirecting)
            return;
        setRedirecting(true);
        setLoading(true);
        await router.push('/');
    };
    /* #endregion */
    /* #region CallBack Hook section */
    useEffect(() => {
        const loadData = async () => {
            const response = await GetData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/verify?code=' + code);
            if (!response) {
                setError('ERR_NULL_RESPONSE');
                return;
            }
            if (response.status === 200) {
                setVerified(true);
                return;
            }
            else {
                const { error } = response.data as { error: string; };
                setError(!error ? `HTML_ERROR_${response.status}` : error);
            }
            setLoading(false);
            setReloadData(false);
        };
        if (code !== undefined) {
            if (!code) {
                setLoading(false);
                setError('ERR_INVALID_FORMAT');
            }
            else {
                if (reloadData)
                    loadData();
            }
        }
    }, [code, reloadData]);
    /* #endregion */
    /* #region Functions section */
    const VerificationError = () => {
        return (
            <>
                <Typography variant="h5" sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }} >
                    <BiMessageSquareError />
                    {emailVerificationPage.operationFail}
                </Typography>
                <Divider variant="middle" />
                <Typography>
                    {emailVerificationPage.reason + getResponseError(errorCode, language)}
                    <br />
                </Typography>
                <ol style={{ listStyle: settings.listStyle }}>
                    <li>{problems.internetConnection}</li>
                    <li>{problems.emailExpired}</li>
                    <li>{problems.networkChanged}</li>
                    <li>{problems.serverError}</li>
                </ol>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => resend()}>{emailVerificationPage.resend}</Button>
                    <Button onClick={() => redirect()}>{emailVerificationPage.return}</Button>
                </CardActions>
            </>
        );

    };
    const VerificationSuccess = () => {
        return (
            <>
                <Typography variant="h5" sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }} >
                    <FiUserCheck />
                    {emailVerificationPage.operationSuccess}
                </Typography>
                <Divider variant="middle" />
                <Typography>
                    {emailVerificationPage.successMessage}
                </Typography>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => redirect()}>{emailVerificationPage.return}</Button>
                </CardActions>

            </>

        );

    };
    /* #endregion */
    return (
        <>
            <Head>
                <title>{emailVerificationPage.title}</title>
            </Head>
            <Card dir={settings.rightToLeft ? 'rtl' : 'ltr'} sx={{ margin: '15px' }}>
                <>
                    <CardHeader title={emailVerificationPage.title} sx={{ color: !isLoading && !isVerified ? 'error.main' : '' }} />
                    <CardContent sx={{ color: !isLoading && !isVerified ? 'error.main' : '', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isLoading ?
                            <>
                                <CircularLoading />
                                <Typography>
                                    {isRedirecting ? emailVerificationPage.redirectingToHomePage : emailVerificationPage.loading}
                                </Typography>
                            </>
                            :
                            <>
                                {isVerified ? <VerificationSuccess /> : <VerificationError />}
                            </>
                        }
                    </CardContent>
                </>
            </Card>
        </>
    );
};

export default Verify;