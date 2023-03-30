import AuthorizedLayout from '../../components/AuthorizedLayout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../components/controls/CenterBox';
import Head from 'next/head';
import Loader from '../../components/controls/Loader';
import type { NextPage } from 'next';
import { AccountType } from '../../types/accountType';
import { LanguageContext } from '../../components/context/LanguageContext';
import { ExtendedTrip } from '../../types/trips';
import { getData } from '../../lib/axiosRequest';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import PaymentsTab from '../../components/pageTabs/paymentsTab/PaymentsTab';
import Typography from '@mui/material/Typography';
import { LocalizationInfoContext } from '../../components/context/LocalizationInfoContext';

const Payments: NextPage = () => {

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { paymentsPage, settings } = language;
    const [loadingText, setLoadingText] = useState('');
    const [reload, setReload] = useState(true);
    const [selectedRows, setSelectedRows] = useState<ExtendedTrip[]>([]);
    const [payments, setPayments] = useState<ExtendedTrip[]>([]);
    const [errorText, setErrorText] = useState('');
    useEffect(() => {
        if (reload) {
            const readData = async () => {
                setLoadingText(paymentsPage.fetchingTrips);
                const response = await getData(process.env.NEXT_PUBLIC_WEB_URL + '/api/payments/retrieve');
                setReload(false);
                setLoadingText('');
                if (response && response.status === 200) {
                    const { trips } = response.data;
                    setPayments(trips as ExtendedTrip[]);
                    setErrorText('');
                }
                else
                    setErrorText(paymentsPage.errorText);

            };
            readData();
        }
    }, [paymentsPage.errorText, paymentsPage.fetchingTrips, reload]);

    const totalCost = useMemo(() => {
        return selectedRows.reduce((total, row) => {
            return total + row.cost;
        }, 0);
    }, [selectedRows]);
    const totalIncome = useMemo(() => {
        return selectedRows.reduce((total, row) => {
            return total + row.income;
        }, 0);
    }, [selectedRows]);

    return (
        <AuthorizedLayout role={AccountType.customer}>
            <>
                <Head>
                    <title>{paymentsPage.title}</title>
                </Head>
                <CenterBox dir={settings.direction}>
                    <Card dir={settings.direction}>
                        <CardHeader title={paymentsPage.title} />
                        <CardContent>
                            <CenterBox sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                                {selectedRows && selectedRows.length > 0 &&
                                    <Typography variant='body2'>
                                        {`${paymentsPage.totalCost}: ${totalCost}${localizationInfo.currency} ${paymentsPage.totalIncome}: ${totalIncome}${localizationInfo.currency}`}
                                    </Typography>
                                }
                                {errorText ?
                                    <>
                                        <Alert security='error'>
                                            {errorText}
                                        </Alert>
                                    </>
                                    :
                                    <>
                                        <PaymentsTab onSelectionChange={(e) => setSelectedRows(e)} items={payments} />
                                    </>

                                }
                            </CenterBox>
                            {loadingText !== '' && <Loader text={loadingText} />}
                        </CardContent>
                        <CardActions sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                            <CenterBox wrapMode={true}>
                                <Button variant='contained' onClick={() => setReload(true)} >
                                    {paymentsPage.reload}
                                </Button>
                            </CenterBox>
                        </CardActions>
                    </Card>
                </CenterBox>
            </>
        </AuthorizedLayout >
    );
};

export default Payments;