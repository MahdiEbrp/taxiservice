import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularLoading from './controls/CircularLoading';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import { LanguageContext } from '../lib/context/LanguageContext';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Alert from '@mui/material/Alert';

const AuthorizedLayout = (props: { children: ReactElement; }) => {

    const session = useSession();
    const router = useRouter();

    const { language } = useContext(LanguageContext);

    const { settings, authorizedLayout, notification } = language;
    const { direction } = settings;
    const [showError, setShowError] = useState(false);



    useEffect(() => {
        if (session.status === 'unauthenticated') {
            setShowError(true);
            router.push('/');
        }
    }, [session, router]);

    return (
        <>
            {session.status === 'authenticated' ?
                <>{props.children}</>
                :
                <>
                    <Head>
                        <title>{authorizedLayout.loading}</title>
                    </Head>
                    <Card>
                        <CardContent sx={{ dir: direction }}>
                            {showError && <Alert severity="error">{notification.unauthenticated}</Alert>}
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