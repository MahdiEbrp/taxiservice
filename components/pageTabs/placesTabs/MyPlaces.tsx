import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import CenterBox from '../../controls/CenterBox';
import React, { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { PlaceContext } from '../../context/PlaceContext';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';

const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const MyPlaces = () => {

    const { placesList } = useContext(PlaceContext);
    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);

    const myPlacesTab = language.placePage.myPlacesTab;
    const [selectedPlace, setSelectedPlace] = useState<TaggedItem<number[]> | null>(null);
    const items = placesList?.map((place) => {
        return {
            displayText: place.address,
            tag: [place.latitude, place.longitude]
        };
    });

    const lat = localizationInfo?.lat || 0;
    const long = localizationInfo?.long || 0;
    const defaultLocation = [lat, long];

    return (
        <CenterBox>
            <AutoCompletePlus sx={{ width: '100%' }} items={items} label={myPlacesTab.address} onChanged={(e) => setSelectedPlace(e)} />
            <Map currentLocation={selectedPlace?.tag || defaultLocation} onLocationChanged={() => void 0} />
        </CenterBox>

    );
};

export default MyPlaces;