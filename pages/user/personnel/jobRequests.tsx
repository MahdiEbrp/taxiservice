import type { NextPage } from 'next';
import Head from 'next/head';
import AuthorizedLayout from '../../../components/AuthorizedLayout';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { useContext } from 'react';
import Paper from '@mui/material/Paper';
import CenterBox from '../../../components/controls/CenterBox';

const JobRequests: NextPage = () => {

    const { language } = useContext(LanguageContext);
    const { jobRequestsPage, settings } = language;

    return (
        <AuthorizedLayout>
            <>
                <Head>
                    <title>{jobRequestsPage.title}</title>
                </Head>
                <Paper dir={settings.direction}>
                    <CenterBox>
                        <h1>hello world</h1>
                    </CenterBox>
                </Paper>
            </>
        </AuthorizedLayout>
    );
};

export default JobRequests;