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

const NotFound: NextPage = () => {

    const { language } = useContext(LanguageContext);

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { settings, pageNotFound } = language;

    const returnHome = async () => {
        setIsLoading(true);
        const response = await router.push('/');
        setIsLoading(false);
        if (response)
            return;
    };

    return (
        <>
            <Head>
                <title>{pageNotFound.error404}</title>
            </Head>
            <Card dir={settings.direction} sx={{ margin: '15px' }}>
                <CardHeader title={pageNotFound.title} />
                <CardMedia sx={centerStyle}>
                    <ImageLoader src='/images/404.svg' alt={pageNotFound.imageAlt} width={300} height={300} />
                </CardMedia>
                <CardContent sx={centerStyle}>
                    {isLoading ?
                        <Loader text={pageNotFound.redirectingToHomePage} />
                        :
                        <Typography variant='body1'>
                            {pageNotFound.message}
                        </Typography>
                    }
                </CardContent>
                {!isLoading &&
                    <CardActions sx={centerStyle}>
                        <Button onClick={() => returnHome()}>{pageNotFound.returnHome}</Button>
                    </CardActions>
                }
            </Card>
        </>
    );
};

export default NotFound;