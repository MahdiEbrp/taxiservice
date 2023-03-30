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
import { PriceContext } from '../../context/PriceContext';
import { PriceList } from '../../../types/priceType';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { OnlyNumberWithDot } from '../../../lib/validator';
import { postData } from '../../../lib/axiosRequest';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AddPrice = () => {

    const addressInput = useRef<HTMLInputElement>(null);
    const priceInput = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { agencyList, placesList, setPriceList } = useContext(PriceContext);
    const { setToast } = useContext(ToastContext);

    const [loadingText, setLoadingText] = useState('');
    const [location, setLocation] = useState<TaggedItem<number[]> | null>(null);
    const [tabID, setTabId] = useState('agencySelection');
    const [selectedAgency, setSelectedAgency] = useState<TaggedItem<string> | null>(null);
    const { priceListPage, notification } = language;
    const addPriceTab = priceListPage.addPriceTab;

    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];
    const addressMaxLength = 800;
    const PriceMaxLength = 10;

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

        const address = addressInput.current?.value || '';
        const price = priceInput.current?.value || 0;

        if (selectedAgency === null) {
            setToast({ id: Math.random(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        if (!price) {
            setToast({ id: Math.random(), message: notification.invalidPriceFormat, alertColor: 'error' });
            return;
        }
        if (!location) {
            setToast({ id: Math.random(), message: notification.selectLocation, alertColor: 'error' });
            setTabId('locationSelection');
            return;
        }

        if (address.length < 3) {
            setToast({ id: Math.random(), message: notification.enterAddress, alertColor: 'error' });
            setTabId('finalNote');
            return;
        }
        if (isNaN(Number(price))) {
            setToast({ id: Math.random(), message: notification.invalidPriceFormat, alertColor: 'error' });
            return;
        }
        const data = { address, location: location.tag, agencyID: selectedAgency.tag,price };
        setLoadingText(addPriceTab.addingItem);
        const response = await postData('/api/prices/insert', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyAddItem, alertColor: 'success' });
            const { prices } = response.data;
            setPriceList(prices as PriceList);
            setTabId('agencySelection');
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });

    };
    const handlePlaceTextChange = (value: string | undefined) => {
        if (value && addressInput.current)
            addressInput.current.value = value;
    };
    return (
        <CenterBox>

            <>
                <CenterBox sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                    {loadingText === '' &&
                        <Tabs value={tabID} onChange={handleTabChange} aria-label='general'>
                            <Tab label={priceListPage.agencySelection} value='agencySelection' />
                            <Tab label={priceListPage.locationSelection} value='locationSelection' />
                            <Tab label={priceListPage.finalNote} value='finalNote' />
                        </Tabs>
                    }
                    <TabPanel activeIndex={tabID} index='agencySelection'>
                        <AutoCompletePlus items={agencies || []} selectedValue={selectedAgency?.displayText || undefined} label={priceListPage.agencyName} onChanged={e => setSelectedAgency(e)} />
                    </TabPanel>
                    <TabPanel activeIndex={tabID} index='locationSelection'>
                        <PlacesSearchBox customPlaces={places || []} label={priceListPage.places} onLocationChanged={updateLocation} onSelectedTextChanged={handlePlaceTextChange} />
                        <Alert severity='info'>{priceListPage.navigateOnMapInfo}</Alert>
                        <Map currentLocation={location?.tag || defaultLocation} onLocationChanged={updateMap} />
                    </TabPanel>
                    <TabPanel activeIndex={tabID} index='finalNote'>
                        <TextField label={priceListPage.address} multiline required inputProps={{
                            maxLength: addressMaxLength,
                        }} inputRef={addressInput} sx={{ width: 'min(80vw,400px)' }} />
                        <ForcedPatternInput label={priceListPage.price} pattern={OnlyNumberWithDot} inputProps={{
                            maxLength: PriceMaxLength,
                        }} inputRef={priceInput} sx={{ width: '100%', direction: 'ltr' }} required />
                    </TabPanel>
                    <Button onClick={handleSubmit} >{addPriceTab.addItem}</Button>

                </CenterBox>
                {loadingText !== '' && <Loader text={loadingText} />}
            </>
        </CenterBox>
    );
};

export default AddPrice;