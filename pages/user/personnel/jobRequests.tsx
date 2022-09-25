import type { NextPage } from 'next';
import Head from 'next/head';
import AuthorizedLayout from '../../../components/AuthorizedLayout';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { useContext } from 'react';

const jobRequests: NextPage = () => {

    const { language } = useContext(LanguageContext);
    const { jobRequestsPage } = language;

    return (
        <AuthorizedLayout>
            <Head>
                <title>{jobRequestsPage.title}</title>
            </Head>
        </AuthorizedLayout>
    );
};

export default jobRequests;