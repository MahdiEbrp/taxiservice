import Head from 'next/head';
import React, { useContext } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { LanguageContext } from '../lib/context/LanguageContext';
import { NextPage } from 'next';
import ResetPasswordForm from '../components/ResetPasswordForm';
const ResetPassword: NextPage = () => {
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    /* #endregion */
    /* #region Language section */
    const { settings, resetPasswordPage } = language;
    const { direction } = settings;
    /* #endregion */
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