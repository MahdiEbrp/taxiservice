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
import { getResponseError } from '../../lib/language';
import { LanguageContext } from '../../components/context/LanguageContext';
import { ToastContext } from '../../components/context/ToastContext';
import { Trip } from '../../types/trips';
import { getData, postData } from '../../lib/axiosRequest';
import React, { useContext, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import TabPanel from '../../components/controls/TabPanel';
import Tab from '@mui/material/Tab';
import DateRangeTab from '../../components/pageTabs/commissionTab/DateRangeTab';
import CheckAndChooseTab from '../../components/pageTabs/commissionTab/CheckAndChooseTab';
import UpdatePercentage from '../../components/pageTabs/commissionTab/UpdatePercentage';
import { AgencyDataList } from '../../types/agencies';
import Alert from '@mui/material/Alert';

const CommissionPage: NextPage = () => {



    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);

    const [tripRequests, setTripRequests] = useState<Trip[] | undefined>(undefined);
    const { commissionPage, settings, notification } = language;
    const [loadingText, setLoadingText] = useState('');
    const [reload, setReload] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTab, setActiveTab] = useState('0');
    const [agencyData, setAgencyData] = useState<AgencyDataList>([]);
    const [selectedRow, setSelectedRow] = useState<Trip[]>([]);
    const [errorText, setErrorText] = useState('');
    const lastStep = 2;

    useEffect(() => {
        if (reload) {
            const markAsRead = async () => {
                setLoadingText(commissionPage.fetchingAgencies);
                const response = await getData(process.env.NEXT_PUBLIC_WEB_URL + '/api/agency/getData');
                setReload(false);
                setLoadingText('');
                if (response && response.status === 200) {
                    const { myAgencies } = response.data;
                    setAgencyData(myAgencies as AgencyDataList);
                    setErrorText('');
                }
                else
                    setErrorText(commissionPage.errorText);

            };
            markAsRead();
        }
    }, [commissionPage.errorText, commissionPage.fetchingAgencies, reload]);
    const gotoStep = (step: number) => {
        step = step < 0 ? 0 : step;
        setCurrentStep(step);
        setActiveTab(step.toString());
    };
    const nextStep = () => {
        if (currentStep === lastStep) {
            return;
        }
        if (!tripRequests || tripRequests.length === 0) {
            setToast({ id: Math.random(), message: notification.noTrip, alertColor: 'info' });
            return;
        }
        gotoStep(currentStep + 1);
    };
    const previousStep = () => {
        if (currentStep === 0) {
            return;
        }
        gotoStep(currentStep - 1);
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        gotoStep(Number(newValue));
    };
    const updateCommission = async (trips: Trip[] | []) => {
        setLoadingText(commissionPage.updatingCommission);
        const values = trips.map(trip => {
            return { id: trip.id, commission: trip.commission };
        });
        const response = await postData(process.env.NEXT_PUBLIC_WEB_URL + '/api/trips/updateCommission', values);
        setLoadingText('');

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            const data = response.data as Trip[];
            setTripRequests(data);
            setToast({ id: Date.now(), message: notification.successfullyEditCommission, alertColor: 'success' });
            return;
        }
        const { error } = response.data as { error: string; };
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
    };
    const handleDateChange = (trips: Trip[]) => {
        setTripRequests(trips);
        if (trips.length > 0)
            nextStep();
    };
    return (
        <AuthorizedLayout role={AccountType.personnel}>
            <>
                <Head>
                    <title>{commissionPage.title}</title>
                </Head>
                <CenterBox dir={settings.direction}>
                    <Card dir={settings.direction}>
                        <CardHeader title={commissionPage.title} />
                        <CardContent>
                            <CenterBox sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                                <Tabs value={activeTab} onChange={handleTabChange} aria-label='advance-settings-tabs'>
                                    <Tab value='0' label={commissionPage.searchTrips} />
                                    {activeTab !== '0' && <Tab value='1' label={commissionPage.checkAndChoose} />}
                                    {activeTab === '2' && <Tab value='2' label={commissionPage.updateCommission} />}
                                </Tabs>
                                <TabPanel activeIndex={activeTab} index='0'>
                                    {errorText && <Alert severity='warning'>{commissionPage.errorText}</Alert>}
                                    <DateRangeTab onLoadingTextChange={(e) => setLoadingText(e)}
                                        onDataChange={(e) => handleDateChange(e)} />
                                </TabPanel>
                                <TabPanel activeIndex={activeTab} index='1'>
                                    <CheckAndChooseTab items={tripRequests}
                                        onSelectionChange={(e) => setSelectedRow(e)} />
                                </TabPanel>
                                <TabPanel activeIndex={activeTab} index='2'>
                                    <UpdatePercentage agencyData={agencyData} items={selectedRow} onPercentageChange={updateCommission} />
                                </TabPanel>
                            </CenterBox>
                            {loadingText !== '' && <Loader text={loadingText} />}
                        </CardContent>
                        <CardActions sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                            <CenterBox wrapMode={true}>
                                <Button variant='contained' disabled={currentStep === lastStep} onClick={() => setReload(true)} >
                                    {commissionPage.reload}
                                </Button>
                                <Button variant='contained' disabled={currentStep === 0} onClick={() => previousStep()} >
                                    {commissionPage.previousStep}
                                </Button>
                                <Button variant='contained' disabled={currentStep === lastStep} onClick={() => nextStep()} >
                                    {commissionPage.nextStep}
                                </Button>
                            </CenterBox>
                        </CardActions>
                    </Card>
                </CenterBox>
            </>
        </AuthorizedLayout >
    );
};

export default CommissionPage;