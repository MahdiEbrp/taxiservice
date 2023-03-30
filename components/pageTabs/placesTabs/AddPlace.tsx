import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import React, { useContext, useRef, useState } from 'react';
import { postData } from '../../../lib/axiosRequest';
import { getResponseError } from '../../../lib/language';
import { PlacesList } from '../../../types/placeType';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { PlaceContext } from '../../context/PlaceContext';
import { ToastContext } from '../../context/ToastContext';
import { TaggedItem } from '../../controls/AutoCompletePlus';
import CenterBox from '../../controls/CenterBox';
import Loader from '../../controls/Loader';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AddPlace = () => {

    const address = useRef<HTMLInputElement>(null);

    const [location, setLocation] = useState<TaggedItem<number[]> | null>(null);
    const [loadingText, setLoadingText] = useState('');

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { setToast } = useContext(ToastContext);
    const {setPlacesList } = useContext(PlaceContext);

    const addPlaceTab = language.placePage.addPlaceTab;
    const { notification } = language;
    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];

    const updateLocation = (newLocation: TaggedItem<number[]> | null) => {
        if (newLocation) {
            setLocation(newLocation);
        }
    };
    const updateMap = (newLocation: number[]) => {
        setLocation({ tag: newLocation, displayText: '' });
    };

    const addPlace = async () => {
        const currentAddress = address.current?.value || '';

        if (currentAddress.length === 0) {
            setToast({ id: Math.random(), message: notification.addressRequired, alertColor: 'error' });
            return;
        }
        if (location === null) {
            setToast({ id: Math.random(), message: notification.locationRequired, alertColor: 'error' });
            return;
        }
        const data = { address: currentAddress, location: location.tag };
        setLoadingText(addPlaceTab.addingPlace);
        const response = await postData('/api/places/insert', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyAddPlace, alertColor: 'success' });
            const { myPlaces } = response.data;
            setPlacesList(myPlaces as PlacesList);
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
    };

    return (
        <>
            <CenterBox sx={{ display: loadingText === '' ? 'flex' : 'none' }}>
                <TextField label={addPlaceTab.address}
                    required
                    multiline
                    sx={{ width: '100%' }}
                    inputProps={{ maxLength: 800 }}
                    inputRef={address} />
                <PlacesSearchBox onLocationChanged={updateLocation}/>
                <Map currentLocation={location?.tag || defaultLocation} onLocationChanged={updateMap} />
                <Button onClick={() => addPlace()}>{addPlaceTab.addPlace}</Button>
            </CenterBox>
            {loadingText !== '' &&
                <CenterBox>
                    <Loader text={loadingText} />
                </CenterBox>
            }
        </>

    );
};

export default AddPlace;