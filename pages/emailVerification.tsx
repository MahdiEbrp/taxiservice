import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../components/controls/CenterBox';
import CircularLoading from '../components/controls/CircularLoading';
import Divider from '@mui/material/Divider';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { BiMessageSquareError } from 'react-icons/bi';
import { FiUserCheck } from 'react-icons/fi';
import { GetData } from '../lib/FetchData';
import { LanguageContext } from '../lib/context/LanguageContext';
import { getResponseError } from '../lib/Language';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const Verify: NextPage = () => {

    const router = useRouter();
    const code = router.query['code'] as string;

    const { language } = useContext(LanguageContext);

    const [errorCode, setError] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [isRedirecting, setRedirecting] = useState(false);
    const [isVerified, setVerified] = useState(false);
    const [reloadData, setReloadData] = useState(true);

    const { settings, emailVerificationPage } = language;
    const { problems } = emailVerificationPage;

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

    useEffect(() => {
        const loadData = async () => {
            const response = await GetData(process.env.NEXT_PUBLIC_WEB_URL + '/api/auth/verify?code=' + code);
            setLoading(false);
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
            setReloadData(false);
        };
        if (router.isReady) {
            if (!code) {
                setLoading(false);
                setError('ERR_INVALID_FORMAT');
            }
            else {
                if (isLoading && reloadData && !isVerified)
                    loadData();
            }
        }
    }, [code, isLoading, isVerified, reloadData, router]);

    const VerificationError = () => {
        return (
            <>
                <Typography variant='h5' sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }} >
                    <BiMessageSquareError />
                    {emailVerificationPage.operationFail}
                </Typography>
                <Divider variant='middle' />
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
            </>
        );

    };
    const VerificationSuccess = () => {
        return (
            <>
                <Typography variant='h5' sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }} >
                    <FiUserCheck />
                    {emailVerificationPage.operationSuccess}
                </Typography>
                <Divider variant='middle' />
                <Typography>
                    {emailVerificationPage.successMessage}
                </Typography>
            </>

        );

    };

    return (
        <>
            <Head>
                <title>{emailVerificationPage.title}</title>
            </Head>
            <Card dir={settings.direction} sx={{ margin: '15px' }}>
                <>
                    <CardHeader title={emailVerificationPage.title} sx={{ color: !isLoading && !isVerified ? 'error.main' : '' }} />
                    <CardContent sx={{ color: !isLoading && !isVerified ? 'error.main' : '', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isLoading ?
                            <CenterBox>
                                <CircularLoading />
                                <Typography>
                                    {isRedirecting ? emailVerificationPage.redirectingToHomePage : emailVerificationPage.loading}
                                </Typography>
                            </CenterBox>
                            :
                            <>
                                {isVerified ? <VerificationSuccess /> : <VerificationError />}
                            </>
                        }
                    </CardContent>
                    {!isLoading &&
                        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            {!isVerified && <Button onClick={() => resend()}>{emailVerificationPage.resend}</Button>}
                            <Button onClick={() => redirect()}>{emailVerificationPage.return}</Button>
                        </CardActions>
                    }
                </>
            </Card>
        </>
    );
};

export default Verify;