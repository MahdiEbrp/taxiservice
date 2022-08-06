import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CenterBox, { centerStyle } from '../components/controls/CenterBox';
import CircularLoading from '../components/controls/CircularLoading';
import Head from 'next/head';
import ImageLoader from '../components/controls/ImageLoader';
import Typography from '@mui/material/Typography';
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
            <Card dir={settings.direction} sx={{ margin: '15px' }}>
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