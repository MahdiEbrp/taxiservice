import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import CenterBox from '../../controls/CenterBox';
import Loader from '../../controls/Loader';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import React, { useContext, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { Button } from '@mui/material';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { PlaceContext } from '../../context/PlaceContext';
import { PlacesList } from '../../../types/placeType';
import { ToastContext } from '../../context/ToastContext';
import { getResponseError } from '../../../lib/language';
import { postData } from '../../../lib/axiosRequest';
const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const EditPlace = () => {

    const address = useRef<HTMLInputElement>(null);

    const [location, setLocation] = useState<TaggedItem<number[]> | null>(null);
    const [loadingText, setLoadingText] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<TaggedItem<number[]> | null>(null);

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { setToast } = useContext(ToastContext);
    const { placesList, setPlacesList } = useContext(PlaceContext);

    const editPlaceTab = language.placePage.editPlaceTab;
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
    const updateSelectedPlace = (newLocation: TaggedItem<number[]> | null) => {
        setSelectedPlace(newLocation);
        if (newLocation) {
            updateMap(newLocation.tag);
            if (address.current)
                address.current.value = newLocation.displayText;
        }
    };
    const items = placesList?.map((place) => {
        return {
            displayText: place.address,
            tag: [place.latitude, place.longitude],
            id: place.id
        };
    });

    const EditPlace = async () => {

        if (selectedPlace === null || selectedPlace.id === undefined) {
            setToast({ id: Math.random(), message: notification.selectAddress, alertColor: 'error' });
            return;
        }
        const currentAddress = address.current?.value || '';

        if (currentAddress.length === 0) {
            setToast({ id: Math.random(), message: notification.addressRequired, alertColor: 'error' });
            return;
        }
        if (location === null) {
            setToast({ id: Math.random(), message: notification.locationRequired, alertColor: 'error' });
            return;
        }

        const data = { id: selectedPlace.id, address: currentAddress, location: location.tag };

        setLoadingText(editPlaceTab.updatingPlace);
        const response = await postData('/api/places/update', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyEditPlace, alertColor: 'success' });
            const { myPlaces } = response.data;
            setPlacesList(myPlaces as PlacesList);
            return;
        }
        let { error } = response.data as { error: string; };
        error = !error ? `HTML_ERROR_${response.status}` : error;
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });
    };

    const RemovePlace = async () => {
        if (selectedPlace === null) {
            setToast({ id: Math.random(), message: notification.selectAddress, alertColor: 'error' });
            return;
        }
        const data = { id: selectedPlace.id };
        setLoadingText(editPlaceTab.removingPlace);
        const response = await postData('/api/places/delete', data);
        setLoadingText('');
        if (!response) {
            setToast({ id: Math.random(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }
        if (response.status === 200) {
            setToast({ id: Math.random(), message: notification.successfullyRemovePlace, alertColor: 'success' });
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
                <AutoCompletePlus sx={{ width: '100%' }} items={items} label={editPlaceTab.address} onChanged={(e) => updateSelectedPlace(e)} />
                <TextField label={editPlaceTab.address}
                    required
                    multiline
                    sx={{ width: '100%' }}
                    inputProps={{ maxLength: 800 }}
                    inputRef={address} />
                <PlacesSearchBox onLocationChanged={updateLocation} />
                <Map currentLocation={location?.tag || defaultLocation} onLocationChanged={updateMap} />
                <CenterBox wrapMode={true}>
                    <Button onClick={() => EditPlace()}>{editPlaceTab.editPlace}</Button>
                    <Button onClick={() => RemovePlace()}>{editPlaceTab.removePlace}</Button>
                </CenterBox>

            </CenterBox>
            {loadingText !== '' &&
                <CenterBox>
                    <Loader text={loadingText} />
                </CenterBox>
            }
        </>

    );
};

export default EditPlace;