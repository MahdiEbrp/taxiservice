import PlacesSearchBox from '../../controls/PlacesSearchBox';
import React, { useContext, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import { SubscriberData, SubscriberDataList } from '../../../types/subscriberType';
import { PlacesList } from '../../../types/placeType';

const Map = dynamic(() => import('../../../components/controls/OpenLayerMap'), { ssr: false });
export type SelectOriginProps = {
    onAddressChanged: (address: string) => void;
    onLocationChanged: (location: number[]) => void;
    agencyLocation: number[];
    driverMode: boolean;
    onSubscriberChanged?: (subscriber: SubscriberData | undefined) => void;
    subscribers: SubscriberDataList | undefined;
    places: PlacesList | undefined;
};
const SelectOrigin = (props: SelectOriginProps) => {

    const { onAddressChanged, onLocationChanged, onSubscriberChanged, agencyLocation, driverMode, subscribers, places } = props;

    const addressRef = useRef<HTMLInputElement>(null);


    const { language } = useContext(LanguageContext);

    const [currentLocation, setCurrentLocation] = useState<number[]>(agencyLocation);

    const { tripCreationPage } = language;

    const handleLocationChanged = (location: number[]) => {
        setCurrentLocation(location);
        onLocationChanged(location);
    };
    const handleAddressChanged = (newAddress: string) => {
        onAddressChanged(newAddress);
    };

    const updateMap = (location: TaggedItem<number[]> | null) => {
        if (location)
            handleLocationChanged(location.tag);
    };
    const subscriberItem = useMemo(() => {
        if (subscribers && subscribers.length > 0) {
            return subscribers.map(subscriber => {
                return { tag: subscriber.id, displayText: subscriber.name + ',' + subscriber.subscriberID };
            });
        }
        return [];
    }, [subscribers]);
    const customPlaces = useMemo(() => {
        if (places && places.length > 0) {
            return places.map(place => {
                return { tag: [place.latitude, place.longitude], displayText: place.address };
            });
        }
        return [];
    }, [places]);

    const markers = [{ location: agencyLocation, text: tripCreationPage.agency }];

    const subscriberChange = (subscriber: SubscriberData | undefined) => {
        if (onSubscriberChanged)
            onSubscriberChanged(subscriber);
    };

    const subscriberChanged = (item: TaggedItem<string> | null) => {

        if (!item || !subscribers) {
            subscriberChange(undefined);
            return;
        }
        const subscriber = subscribers.find(e => e.id === item.tag);
        if (subscriber) {
            handleLocationChanged([subscriber.latitude, subscriber.longitude]);
            handleAddressChanged(subscriber.address);
            if (addressRef.current)
                addressRef.current.value = subscriber.address;
        }
        subscriberChange(subscriber);

    };

    const handleSelectedTextChange = (location: string | undefined) => {
        if (!location)
            return;
        if (addressRef.current)
            addressRef.current.value = location;
        handleAddressChanged(location);
    };

    return (
        <>
            {driverMode &&
                <AutoCompletePlus items={subscriberItem} label={tripCreationPage.subscribers} onChanged={subscriberChanged} />

            }
            <PlacesSearchBox customPlaces={customPlaces} onLocationChanged={updateMap} onSelectedTextChanged={handleSelectedTextChange} />
            <TextField label={tripCreationPage.address}
                required
                multiline
                sx={{ width: '100%' }}
                inputProps={{ maxLength: 800 }}
                inputRef={addressRef}
                InputLabelProps={{ shrink: true }}
                onBlur={e => handleAddressChanged(e.target.value)}
            />
            <Map currentLocation={currentLocation} markers={markers} onLocationChanged={e =>
                handleLocationChanged(e)
            } />
        </>
    );
};

export default SelectOrigin;