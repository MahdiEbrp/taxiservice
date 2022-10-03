import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Head from 'next/head';
import { LanguageContext } from './context/LanguageContext';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Alert from '@mui/material/Alert';
import Loader from './controls/Loader';

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
                    <Card dir={direction}>
                        <CardContent>
                            {showError && <Alert severity="error">{notification.unauthenticated}</Alert>}
                            <Loader usePaper={false} text={session.status === 'loading' ? authorizedLayout.loading : authorizedLayout.redirectingToHomePage} />
                        </CardContent>
                    </Card>
                </>
            }
        </>
    );
};

export default AuthorizedLayout;