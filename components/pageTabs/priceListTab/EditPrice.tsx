import Alert from '@mui/material/Alert';
import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import ForcedPatternInput from '../../controls/ForcedPatternInput';
import Loader from '../../controls/Loader';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabPanel from '../../controls/TabPanel';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { PriceContext } from '../../context/PriceContext';
import { PriceType, PriceList } from '../../../types/priceType';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { OnlyNumberWithDot } from '../../../lib/validator';
import { postData } from '../../../lib/axiosRequest';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const EditPrice = () => {

    const addressInput = useRef<HTMLInputElement>(null);
    const priceInput = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { agencyList, priceList, placesList, setPriceList } = useContext(PriceContext);
    const { setToast } = useContext(ToastContext);

    const [loadingText, setLoadingText] = useState('');
    const [location, setLocation] = useState<TaggedItem<number[]> | null>(null);
    const [tabID, setTabId] = useState('agencySelection');
    const [selectedAgency, setSelectedAgency] = useState<TaggedItem<string> | null>(null);
    const [selectedItem, setSelectedItem] = useState<PriceType | null>(null);
    const { priceListPage, notification } = language;
    const editPriceTab = priceListPage.editPriceTab;

    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];
    const addressMaxLength = 800;
    const PriceMaxLength = 10;
    useEffect(() => {
        setSelectedItem(null);
        setTabId('agencySelection');
        setSelectedAgency(null);
    }, [priceList]);
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
    const prices = priceList?.map((price) => {
        return {
            tag: price.id,
            displayText: price.address,
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

    const handleEdit = async () => {

        const address = addressInput.current?.value || selectedItem?.address || '';
        const price = priceInput.current?.value || 0;

        if (selectedAgency === null) {
            setToast({ id: Math.random(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        if (!selectedItem) {
            setToast({ id: Math.random(), message: notification.notSelectedItem, alertColor: 'error' });
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
        const data = { id: selectedItem.id, price: Number(price), address, location: location.tag, agencyID: selectedAgency.tag };
        setLoadingText(editPriceTab.editingItem);
        const response = await postData('/api/prices/update', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyEditItem, alertColor: 'success' });
            const { prices } = response.data;
            setPriceList(prices as PriceList);
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
    };

    const handleRemove = async () => {

        if (selectedAgency === null) {
            setToast({ id: Math.random(), message: notification.selectAgency, alertColor: 'error' });
            return;
        }
        if (!selectedItem) {
            setToast({ id: Math.random(), message: notification.notSelectedItem, alertColor: 'error' });
            return;
        }
        const data = { id: selectedItem.id };

        setLoadingText(editPriceTab.removingItem);
        const response = await postData('/api/prices/delete', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyRemoveItem, alertColor: 'success' });
            const { prices } = response.data;
            setPriceList(prices as PriceList);
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
        setSelectedItem(null);

    };
    const handlePriceChange = (newPrice: TaggedItem<string> | null) => {
        if (!newPrice) {
            setSelectedItem(null);
            return;
        }
        const price = priceList?.find(price => price.id === newPrice.tag) || null;

        setSelectedItem(price);
        if (price) {
            const agency = agencyList?.find(agency => agency.id === price.agencyId) || null;
            if (agency)
                setSelectedAgency({ tag: agency.id, displayText: agency.agencyName });
            setLocation({ tag: [price.latitude, price.longitude], displayText: '' });
            if (addressInput.current)
                addressInput.current.value = price.address;
            if (priceInput.current)
                priceInput.current.value = price.price.toString();
        }
    };
    const handlePlaceTextChange = (value: string | undefined) => {
        if (value && addressInput.current)
            addressInput.current.value = value;
    };
    return (
        <CenterBox>
            <AutoCompletePlus items={prices || []} label={priceListPage.priceList} onChanged={e => handlePriceChange(e)} />

            {selectedItem &&
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
                        <PlacesSearchBox customPlaces={places || []} label={priceListPage.places}
                            onLocationChanged={updateLocation} onSelectedTextChanged={handlePlaceTextChange} />
                            <Alert severity='info'>{priceListPage.navigateOnMapInfo}</Alert>
                            <Map currentLocation={location?.tag || defaultLocation} onLocationChanged={updateMap} />
                        </TabPanel>
                        <TabPanel activeIndex={tabID} index='finalNote'>
                            <TextField label={priceListPage.address} defaultValue={selectedItem.address} multiline required inputProps={{
                                maxLength: addressMaxLength,
                            }} inputRef={addressInput} sx={{ width: 'min(80vw,400px)' }} />
                            <ForcedPatternInput label={priceListPage.price} defaultValue={selectedItem.price} pattern={OnlyNumberWithDot} inputProps={{
                                maxLength: PriceMaxLength,
                            }} inputRef={priceInput} sx={{ width: '100%', direction: 'ltr' }} required/>
                        </TabPanel>
                        <CenterBox wrapMode={true} sx={{ padding: '0px' }}>
                            <Button onClick={handleEdit} >{editPriceTab.editItem}</Button>
                            <Button onClick={handleRemove} >{editPriceTab.removeItem}</Button>
                        </CenterBox>
                    </CenterBox>
                    {loadingText !== '' && <Loader text={loadingText} />}
                </>
            }
        </CenterBox>
    );
};

export default EditPrice;