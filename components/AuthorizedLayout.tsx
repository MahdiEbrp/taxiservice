import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Head from 'next/head';
import { LanguageContext } from './context/LanguageContext';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Alert from '@mui/material/Alert';
import Loader from './controls/Loader';
import { AccountType } from '../types/accountType';
import { AllSettingsContext } from './context/AllSettingsContext';
import SettingFetcher from './controls/SettingFetcher';

const AuthorizedLayout = (props: { role: AccountType, children: ReactElement; }) => {

    const session = useSession();
    const router = useRouter();
    const { role } = props;

    const { language } = useContext(LanguageContext);

    const { settings, authorizedLayout, notification } = language;
    const { direction } = settings;
    const [showError, setShowError] = useState(false);
    const { userSettings } = useContext(AllSettingsContext);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    useEffect(() => {
        if (session.status === 'unauthenticated') {
            setShowError(true);
            router.push('/');
        }
    }, [session, router, role]);

    useEffect(() => {
        if (session.status === 'authenticated' && userSettings && !userSettings.isFirstLogin) {
            if (userSettings.accountType < role) {
                setShowError(true);
                router.push('/accessDenied');
            }
        }
    }, [session, router, role, userSettings]);

    useEffect(() => {
        if (session.status === 'authenticated' && userSettings && userSettings.isFirstLogin && !isFirstLogin) {
            setIsFirstLogin(true);
            router.push('/user/settings');
        }
    }, [isFirstLogin, router, session, userSettings]);

    return (
        <>
            {session.status === 'authenticated' ?
                <>
                    {!userSettings ?
                        <Card dir={direction}>

                            <SettingFetcher />
                        </Card>
                        :
                        userSettings.accountType >= role ?
                            <>{props.children}</>
                            :
                            <></>

                    }
                </>
                :
                <>
                    <Head>
                        <title>{authorizedLayout.loading}</title>
                    </Head>

                    <Card dir={direction}>
                        <CardContent>
                            {showError && <Alert severity='error'>{notification.unauthenticated}</Alert>}
                            <Loader usePaper={false} text={session.status === 'loading' ? authorizedLayout.loading : authorizedLayout.redirectingToHomePage} />
                        </CardContent>
                    </Card>

                </>
            }
        </>
    );
};

export default AuthorizedLayout;