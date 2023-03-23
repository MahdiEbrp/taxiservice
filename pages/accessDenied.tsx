import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { centerStyle } from '../components/controls/CenterBox';
import Head from 'next/head';
import ImageLoader from '../components/controls/ImageLoader';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../components/context/LanguageContext';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/controls/Loader';
import type { NextPage } from 'next';

const AccessDenied: NextPage = () => {

    const { language } = useContext(LanguageContext);

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { settings, accessDenied } = language;

    const returnHome = async () => {
        setIsLoading(true);
        const response = await router.push('/user/settings');
        setIsLoading(false);
        if (response)
            return;
    };

    return (
        <>
            <Head>
                <title>{accessDenied.error403}</title>
            </Head>
            <Card dir={settings.direction} sx={{ margin: '15px' }}>
                <CardHeader title={accessDenied.title} />
                <CardMedia sx={centerStyle}>
                    <ImageLoader src='/images/access_denied.svg' alt={accessDenied.imageAlt} width={300} height={300} />
                </CardMedia>
                <CardContent sx={centerStyle}>
                    {isLoading ?
                        <Loader text={accessDenied.redirectingToSettingPage} />
                        :
                        <Typography variant='body1'>
                            {accessDenied.message}
                        </Typography>
                    }
                </CardContent>
                {!isLoading &&
                    <CardActions sx={centerStyle}>
                        <Button onClick={() => returnHome()}>{accessDenied.returnSetting}</Button>
                    </CardActions>
                }
            </Card>
        </>
    );
};

export default AccessDenied;