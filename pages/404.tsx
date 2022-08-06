import CenterBox, { centerStyle } from '../components/controls/CenterBox';
import CircularLoading from '../components/controls/CircularLoading';
import Head from 'next/head';
import ImageLoader from '../components/controls/ImageLoader';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { LanguageContext } from '../lib/context/LanguageContext';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
const NotFound = () => {
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    /* #endregion */
    /* #region Redirect section */
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    /* #endregion */
    /* #region Language section */
    const { settings, pageNotFound } = language;
    /* #endregion */    /* #region Functions section */
    const returnHome = async () => {
        setIsLoading(true);
        const response = await router.push('/');
        setIsLoading(false);
        if (response)
            return;
    };
    /* #endregion */
    return (
        <>
            <Head>
                <title>{pageNotFound.error404}</title>
            </Head>

            <Card dir={settings.rightToLeft ? 'rtl' : 'ltr'} sx={{ margin: '15px' }}>
                <CardHeader title={pageNotFound.title} />
                <CardMedia sx={centerStyle}>
                    <ImageLoader src='/images/404.svg' alt={pageNotFound.imageAlt} width={300} height={300} />
                </CardMedia>
                <CardContent sx={centerStyle}>
                    {isLoading ?
                        <CenterBox >
                            <CircularLoading />
                            <Typography>
                                {pageNotFound.redirectingToHomePage}
                            </Typography>
                        </CenterBox>
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