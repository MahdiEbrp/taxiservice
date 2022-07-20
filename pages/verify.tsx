import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, CardContent, Paper, Typography } from '@mui/material';
import CircularLoading from '../components/controls/CircularLoading';
import { GetData } from '../lib/FetchData';

const Verify: NextPage = () => {
    const router = useRouter();
    const code = router.query['code'] as string;
    const [isLoading, setLoading] = useState(true);
    const [errorCode, setError] = useState('');
    const [isVerified, setVerified] = useState(false);
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
        };
        if (code !== undefined) {
            if (!code) {
                setLoading(false);
                setError('ERR_INVALID_FORMAT');
            }
            else {
                loadData();
            }
        }
    }, [code]);
    if (isVerified)
        router.push('/');
    return (
        <>
            <Head>
                <title>Verification Page</title>
            </Head>
            <Card sx={{ display: 'flex', flex: '1', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ margin: '5px' }}>
                    <CardContent>
                        {isLoading ?
                            <>
                                <CircularLoading />
                                <Typography sx={{ margin: '5px' }}>
                                    Verifying your account...
                                </Typography>
                            </>
                            :
                            <Typography sx={{ margin: '5px' }} >
                                {errorCode}
                            </Typography>
                        }
                    </CardContent>
                </Paper>
            </Card>
        </>
    );
};

export default Verify;