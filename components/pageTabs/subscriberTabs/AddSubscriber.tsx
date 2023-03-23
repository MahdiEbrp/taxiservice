import Alert from '@mui/material/Alert';
import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import ForcedPatternInput from '../../controls/ForcedPatternInput';
import Loader from '../../controls/Loader';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import React, { useContext, useRef, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabPanel from '../../controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { SubscriberContext } from '../../context/SubscriberContext';
import { SubscriberDataList } from '../../../types/subscriberType';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { onlyNumbersRegex } from '../../../lib/validator';
import { postData } from '../../../lib/axiosRequest';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AddSubscriber = () => {

    const subscriberIDInput = useRef<HTMLInputElement>(null);
    const addressInput = useRef<HTMLInputElement>(null);
    const subscriberNameInput = useRef<HTMLInputElement>(null);
    const phoneNumberInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { agencyList, placesList, subscriberList, setSubscriberList } = useContext(SubscriberContext);
    const { setToast } = useContext(ToastContext);

    const [loadingText, setLoadingText] = useState('');
    const [location, setLocation] = useState<TaggedItem<number[]> | null>(null);
    const [tabID, setTabId] = useState('general');
    const [selectedAgency, setSelectedAgency] = useState<TaggedItem<string> | null>(null);

    const { subscribersPage, notification } = language;
    const addSubscriberTab = subscribersPage.addSubscriberTab;

    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];
    const subscriberIDMaxLength = 30;
    const addressMaxLength = 800;
    const descriptionMaxLength = 300;
    const phoneNumberMaxLength = 30;
    const maxNameLength = 50;
    const agencies = agencyList?.map((agency) => {
        return {
            tag: agency.id,
            displayText: agency.agencyName,
        };
    });
    const places = placesList?.map((place) => {
        return {
            tag: [place.latitude, place.longitude],
            displayText: place.address,
        };
    });
    const updateMap = (newLocation: number[]) => {
        setLocation({ tag: newLocation, displayText: '' });
    };
    const updateLocation = (newLocation: TaggedItem<number[]> | null) => {
        if (newLocation) {
            setLocation(newLocation);
        }
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabId(newValue);
    };
    const handleSubmit = async () => {
        const subscriberName = subscriberNameInput.current?.value || '';
        const subscriberID = subscriberIDInput.current?.value || '';
        const address = addressInput.current?.value || '';
        const phoneNumber = phoneNumberInput.current?.value || '';
        const description = descriptionInput.current?.value || '';
        if (selectedAgency === null) {
            setToast({ id: Math.random(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        if (!subscriberName) {
            setToast({ id: Math.random(), message: notification.enterSubscriberName, alertColor: 'error' });
            return;
        }
        if (!subscriberID) {
            setToast({ id: Math.random(), message: notification.enterSubscriberID, alertColor: 'error' });
            return;
        }
        if (!location) {
            setToast({ id: Math.random(), message: notification.selectLocation, alertColor: 'error' });
            setTabId('locationSelection');
            return;
        }
        if (address.length < 3) {
            setToast({ id: Math.random(), message: notification.enterAddress, alertColor: 'error' });
            setTabId('furtherInformation');
            return;
        }
        if (subscriberList && subscriberList.find(subscriber => subscriber.subscriberID === subscriberID)) {
            setToast({ id: Math.random(), message: notification.subscriberIDAlreadyExists, alertColor: 'error' });
            return;
        }
        const data = { subscriberName, subscriberID, address, phoneNumber, description, location: location.tag, agencyID: selectedAgency.tag };
        setLoadingText(addSubscriberTab.addingSubscriber);
        const response = await postData('/api/subscribers/insert', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyAddSubscriber, alertColor: 'success' });
            const { subscribers } = response.data;
            setSubscriberList(subscribers as SubscriberDataList);
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });

    };

    return (
        <>
            <CenterBox sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                {loadingText === '' &&
                    <Tabs value={tabID} onChange={handleTabChange} aria-label='general'>
                        <Tab label={subscribersPage.general} value='general' />
                        <Tab label={subscribersPage.locationSelection} value='locationSelection' />
                        <Tab label={subscribersPage.furtherInformation} value='furtherInformation' />
                    </Tabs>
                }
                <TabPanel activeIndex={tabID} index='general'>
                    <AutoCompletePlus items={agencies || []} label={subscribersPage.agencyName} onChanged={e => setSelectedAgency(e)} />
                    <TextField required label={subscribersPage.subscriberName} inputRef={subscriberNameInput} inputProps={{
                        maxLength: maxNameLength,
                    }} sx={{ width: '100%' }} />
                    <TextField required label={subscribersPage.subscriberID} inputProps={{
                        maxLength: subscriberIDMaxLength,
                    }} inputRef={subscriberIDInput} />
                    <Alert severity='warning'>{addSubscriberTab.subscriberIDWarning}</Alert>
                </TabPanel>
                <TabPanel activeIndex={tabID} index='locationSelection'>
                    <PlacesSearchBox customPlaces={places || []} label={subscribersPage.places} onLocationChanged={updateLocation} />
                    <Alert severity='info'>{subscribersPage.navigateOnMapInfo}</Alert>
                    <Map currentLocation={location?.tag || defaultLocation} onLocationChanged={updateMap} />
                </TabPanel>
                <TabPanel activeIndex={tabID} index='furtherInformation' >
                    <TextField label={subscribersPage.address} multiline required inputProps={{
                        maxLength: addressMaxLength,
                    }} inputRef={addressInput} sx={{ width: 'min(80vw,400px)' }} />
                    <ForcedPatternInput label={subscribersPage.phoneNumber} pattern={onlyNumbersRegex} inputProps={{
                        maxLength: phoneNumberMaxLength,
                    }} inputRef={phoneNumberInput} sx={{ width: '100%', direction: 'ltr' }} />
                    <TextField label={subscribersPage.description} multiline inputProps={{
                        maxLength: descriptionMaxLength,
                    }} inputRef={descriptionInput} sx={{ width: '100%' }} />
                </TabPanel>
                <Button onClick={handleSubmit} >{subscribersPage.addSubscriber}</Button>
            </CenterBox>
            {loadingText !== '' && <Loader text={loadingText} />}
        </>
    );
};

export default AddSubscriber;