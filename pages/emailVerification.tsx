import { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Card, CardActions, CardContent, Divider, Paper, Typography } from '@mui/material';
import CircularLoading from '../components/controls/CircularLoading';
import { GetData } from '../lib/FetchData';
import { LanguageContext } from '../lib/context/LanguageContext';
import { getResponseError } from '../lib/Language';
import { BiMessageSquareError } from 'react-icons/bi';
import { FiUserCheck } from 'react-icons/fi';
const Verify: NextPage = () => {
    const router = useRouter();
    const code = router.query['code'] as string || '';
    const [isLoading, setLoading] = useState(true);
    const [errorCode, setError] = useState('');
    const [isVerified, setVerified] = useState(false);
    const [reloadData, setReloadData] = useState(true);
    const { language } = useContext(LanguageContext);
    const { settings, emailVerificationPage } = language;
    const { problems } = emailVerificationPage;
    const [isRedirecting, setRedirecting] = useState(false);

    const resend = () => {
        setReloadData(true);
        setLoading(true);
    };

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
    const redirect = async () => {
        if (isRedirecting)
            return;
        setRedirecting(true);
        setLoading(true);
        await router.push('/');
    };

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
                    {emailVerificationPage.reason}
                </Typography>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => redirect()}>{emailVerificationPage.return}</Button>
                </CardActions>

            </>

        );

    };

    return (
        <>
            <Head>
                <title>{emailVerificationPage.title}</title>
            </Head>
            <Card dir={settings.rightToLeft ? 'rtl' : 'ltr'} sx={{ display: 'flex', flex: '1', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ margin: '5px' }}>
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
                                {/* {isVerified ? <VerificationSuccess /> : <VerificationError />} */}
                                <VerificationSuccess />
                            </>
                        }
                    </CardContent>

                </Paper>
            </Card>
        </>
    );
};

export default Verify;