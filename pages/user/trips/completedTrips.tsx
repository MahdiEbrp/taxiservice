import AuthorizedLayout from '../../../components/AuthorizedLayout';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../../../components/controls/CenterBox';
import Head from 'next/head';
import Link from '@mui/material/Link';
import Loader from '../../../components/controls/Loader';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import SettingFetcher from '../../../components/controls/SettingFetcher';
import TabPanel from '../../../components/controls/TabPanel';
import { AccountType } from '../../../types/accountType';
import { AgencyData, AgencyDataList } from '../../../types/agencies';
import { AllSettingsContext } from '../../../components/context/AllSettingsContext';
import { getData, postData } from '../../../lib/axiosRequest';
import { LanguageContext } from '../../../components/context/LanguageContext';
import { LocalizationInfoContext } from '../../../components/context/LocalizationInfoContext';
import { LocalizationInfoType } from '../../../lib/geography';
// eslint-disable-next-line no-duplicate-imports
import type { NextPage } from 'next';
import SelectAgency from '../../../components/pageTabs/addTripTabs/SelectAgency';
import SelectDestination from '../../../components/pageTabs/addTripTabs/SelectDestination';
import { ToastContext } from '../../../components/context/ToastContext';
import SelectOrigin from '../../../components/pageTabs/addTripTabs/SelectOrigin';
import { getResponseError } from '../../../lib/language';
import { SubscriberData, SubscriberDataList } from '../../../types/subscriberType';
import AddPrice from '../../../components/pageTabs/addTripTabs/AddPrice';
import { PriceList } from '../../../types/priceType';

const CompletedTrips: NextPage = () => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { language } = useContext(LanguageContext);
    const { userSettings } = useContext(AllSettingsContext);
    const { setLocalizationInfo } = useContext(LocalizationInfoContext);
    const { setToast } = useContext(ToastContext);

    const { settings, completedTrips, notification } = language;
    const [tabID, setTabId] = useState('0');
    const [reload, setReload] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [subscribers, setSubscribers] = useState<SubscriberDataList | undefined>(undefined);
    const [prices, setPrices] = useState<PriceList | undefined>(undefined);
    const [originAddress, setOriginAddress] = useState<string>('');
    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [destinationLocation, setDestinationLocation] = useState<number[] | null>(null);
    const [originLocation, setOriginLocation] = useState<number[] | null>(null);
    const [localizationName, setLocalizationName] = useState('');
    const [agencies, setAgencies] = useState<AgencyDataList | undefined>(undefined);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);
    const [subscriberID, setSubscriberID] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const lastStep = 3;
    useEffect(() => {
        if (!agencies || reload) {
            const getDataAsync = async () => {
                setLoadingText(completedTrips.receivingData);
                const response = await getData(publicUrl + '/api/trips/getAdvanceData');
                setLoadingText('');
                setReload(false);
                if (response && response.status === 200) {
                    const { agencies, prices, subscribers } = response.data;
                    setAgencies(agencies as AgencyDataList);
                    setPrices(prices as PriceList);
                    setSubscribers(subscribers as SubscriberDataList);
                }
            };
            getDataAsync();
        }
    }, [agencies, publicUrl, reload, completedTrips.receivingData]);

    if (userSettings && localizationName !== userSettings.localization)
        setLocalizationName(userSettings.localization);


    useEffect(() => {
        const getDataAsync = async () => {
            if (localizationName === '') return;
            const data = await import('../../../data/localization/' + localizationName + '.json');
            setLocalizationInfo(data as LocalizationInfoType);
        };
        getDataAsync();
    }, [localizationName, setLocalizationInfo]);


    const BreadcrumbsSteps = () => {
        const stepsLabel = [completedTrips.selectAgency, completedTrips.selectOrigin,
        completedTrips.selectDestination, completedTrips.priceCalculation].slice(0, currentStep + 1);

        return (
            <Breadcrumbs separator='›' aria-label='done-trip-breadcrumb'>
                {stepsLabel.map((label, index) => {
                    return (
                        <Link key={index} onClick={() => gotoStep(index)} color='text.primary'>
                            {label}
                        </Link>
                    );
                }
                )}
            </Breadcrumbs>
        );
    };
    const places = useMemo(() => {
        if (prices && prices.length > 0) {
            return prices.map(price => {
                return {
                    address: price.address, id: price.id, latitude: price.latitude,
                    longitude: price.longitude
                };
            });
        }
        return [];
    }, [prices]);

    const gotoStep = (step: number) => {
        setCurrentStep(step);
        setTabId(step.toString());
    };
    const nextStep = () => {
        if (currentStep === lastStep) {
            return;
        }
        if (!selectedAgency) {
            setToast({ id: Math.random(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        if (currentStep === 1 && (!originLocation || originAddress.length === 0)) {
            setToast({ id: Math.random(), message: notification.addressAndLocationRequired, alertColor: 'error' });
            return;
        }
        if (currentStep === 2 && (!destinationLocation || destinationAddress.length === 0)) {
            setToast({ id: Math.random(), message: notification.addressAndLocationRequired, alertColor: 'error' });
            return;
        }
        gotoStep(currentStep + 1);
        setTabId((currentStep + 1).toString());
    };
    const handleUpdate = async () => {

        if (!selectedAgency)
            return;
        if (!originLocation || originAddress.length === 0)
            return;
        if (!destinationLocation || destinationAddress.length === 0)
            return;
        const agencyID = selectedAgency.id;

        const data = { agencyID, originLocation, originAddress, destinationLocation, destinationAddress, additionalInfo, subscriberID, price };

        setLoadingText(completedTrips.sendingRequest);
        const response = await postData(publicUrl + '/api/trips/addTraveledTrip', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response && response.status === 200) {
            setToast({ id: Math.random(), message: notification.successAddTrip, alertColor: 'success' });
            setTabId('0');
            setCurrentStep(0);
            setReload(true);
            return;
        }
        const { error } = response.data as { error: string; };
        if (error)
            setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
        else
            setToast({ id: Date.now(), message: getResponseError('HTML_ERROR_' + response.status, language), alertColor: 'error' });

    };

    const handleSubscriberChanged = (subscriber: SubscriberData | undefined) => {
        if (!subscriber)
            setSubscriberID('');
        else
            setSubscriberID(subscriber.subscriberID);
    };


    return (
        <>
            <Head>
                <title>{completedTrips.title}</title>
            </Head>
            <AuthorizedLayout role={AccountType.customer}>
                <Card dir={settings.direction}>
                    {!userSettings ?
                        <SettingFetcher />
                        :

                        <>
                            <CardHeader title={completedTrips.title} />
                            <CardContent>
                                <CenterBox sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                                    <BreadcrumbsSteps />
                                    <TabPanel activeIndex={tabID} index={'0'} >
                                        <SelectAgency onValuesChange={(agency) => setSelectedAgency(agency)} agencies={agencies} />
                                    </TabPanel>
                                    <TabPanel activeIndex={tabID} index={'1'} >
                                        {selectedAgency &&
                                            <>
                                                <SelectOrigin driverMode onLocationChanged={(e) => setOriginLocation(e)}
                                                    onAddressChanged={(e) => setOriginAddress(e)} onSubscriberChanged={handleSubscriberChanged}
                                                    agencyLocation={[selectedAgency.latitude, selectedAgency.longitude]} subscribers={subscribers}
                                                    places={places} />
                                            </>
                                        }
                                    </TabPanel>
                                    <TabPanel activeIndex={tabID} index={'2'} >
                                        {
                                            selectedAgency && originLocation &&
                                            <SelectDestination
                                                onLocationChanged={(e) => setDestinationLocation(e)} onAddressChanged={(e) => setDestinationAddress(e)}
                                                agencyLocation={[selectedAgency.latitude, selectedAgency.longitude]} originLocation={[
                                                    originLocation[0], originLocation[1]
                                                ]} places={places} />
                                        }
                                    </TabPanel>
                                    <TabPanel activeIndex={tabID} index={'3'} >
                                        <AddPrice showDescription={true} onDescriptionChanged={(info) => setAdditionalInfo(info)}
                                            onTotalCostChanged={(cost) => setPrice(cost)} prices={prices} />
                                    </TabPanel>
                                </CenterBox>
                                {loadingText &&
                                    <Loader text={loadingText} />
                                }
                            </CardContent>
                            <CardActions sx={{ display: loadingText === '' ? 'flex' : 'none', justifyContent: 'end', gap: '1rem' }}>
                                <Button variant='contained' onClick={() => setReload(true)}>{completedTrips.reload}</Button>
                                <Button variant='contained' disabled={currentStep === 0}
                                    onClick={() => gotoStep(currentStep > 0 ? currentStep - 1 : 0)} >
                                    {completedTrips.previousStep}
                                </Button>
                                {currentStep === lastStep &&
                                    <Button variant='contained' onClick={handleUpdate} > {completedTrips.add}</Button>
                                }
                                <Button variant='contained' disabled={currentStep === lastStep} onClick={() => nextStep()} >
                                    {completedTrips.nextStep}
                                </Button>

                            </CardActions>
                        </>
                    }
                </Card>
            </AuthorizedLayout>
        </>
    );
};



export default CompletedTrips;