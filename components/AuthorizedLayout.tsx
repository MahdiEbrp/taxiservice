import CircularLoading from './controls/CircularLoading';
import Head from 'next/head';
import { Card, CardContent, Typography } from '@mui/material';
import { LanguageContext } from '../lib/context/LanguageContext';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { ToastContext } from '../lib/context/ToastContext';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
const AuthorizedLayout = (props: { children: ReactElement; }) => {
    const session = useSession();
    const router = useRouter();
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { settings, authorizedLayout, notification } = language;
    const { direction } = settings;
    /* #endregion */
    const [showNotifications, setShowNotification] = useState(false);
    if (showNotifications) {
        setToast({ id: Date.now(), message: notification.unauthenticated, alertColor: 'error' });
        setShowNotification(false);
    }
    /* #region Callback hook section */
    useEffect( ()  => {
        if (session.status === 'unauthenticated') {
            setShowNotification(true);
            router.push('/');
        }
    }, [session, router]);
    /* #endregion */
    return (
        <>
            {session.status === 'authenticated' ?
                <>{props.children}</>
                :
                <>
                    <Head>
                        <title>{authorizedLayout.loading}</title>
                    </Head>
                    <Card sx={{ dir: direction }}>
                        <CardContent>
                            <CircularLoading />
                            <Typography>{session.status === 'loading' ? authorizedLayout.loading : authorizedLayout.redirectingToHomePage}</Typography>
                        </CardContent>
                    </Card>
                </>
            }
        </>
    );
};

export default AuthorizedLayout;