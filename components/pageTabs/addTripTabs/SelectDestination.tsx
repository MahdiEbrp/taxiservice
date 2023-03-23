import PlacesSearchBox from '../../controls/PlacesSearchBox';
import React, { useContext, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../context/LanguageContext';
import { PlacesList } from '../../../types/placeType';
import { TaggedItem } from '../../controls/AutoCompletePlus';

const Map = dynamic(() => import('../../../components/controls/OpenLayerMap'), { ssr: false });
export type SelectDestinationProps = {
    onAddressChanged: (address: string) => void;
    onLocationChanged: (location: number[]) => void;
    agencyLocation: number[];
    originLocation: number[];
    places: PlacesList | undefined;
};
const SelectDestination = (props: SelectDestinationProps) => {

    const addressRef = useRef<HTMLInputElement>(null);

    const { onAddressChanged, onLocationChanged, agencyLocation, originLocation, places } = props;

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
    const customPlaces = places ? places.map(p => ({ tag: [p.latitude, p.longitude], displayText: p.address })) : [];

    const markers = [{ location: agencyLocation, text: tripCreationPage.agency }, { location: originLocation, text: tripCreationPage.origin }];

    const handleSelectedTextChange = (location: string | undefined) => {
        if (!location)
            return;
        if (addressRef.current)
            addressRef.current.value = location;
        handleAddressChanged(location);
    };

    return (
        <>
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

export default SelectDestination;