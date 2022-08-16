import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Head from 'next/head';
import React, { useContext } from 'react';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { LanguageContext } from '../lib/context/LanguageContext';
import { NextPage } from 'next';
const ResetPassword: NextPage = () => {

    const { language } = useContext(LanguageContext);

    const { settings, resetPasswordPage } = language;
    const { direction } = settings;

    return (
        <>
            <Head>
                <title>{resetPasswordPage.title}</title>
            </Head>
            <Card dir={direction} sx={{ margin: '15px' }}>
                <CardHeader title={resetPasswordPage.title} />
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </>
    );
};

export default ResetPassword;