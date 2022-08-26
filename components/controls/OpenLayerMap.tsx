import { LatLngExpression } from 'leaflet';
import { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, ScaleControl, useMap, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LanguageContext } from '../../lib/context/LanguageContext';

export type MapProps = {
    currentLocation: number[];
};

const OpenLayerMap = (props: MapProps) => {
    const { currentLocation } = props;

    const arrayToLatLong = (array: number[]) => {
        if (array.length !== 2)
            return [0, 0] as LatLngExpression;
        else
            return array as LatLngExpression;
    };
    const [location, setLocation] = useState(arrayToLatLong(currentLocation));

    const { language } = useContext(LanguageContext);

    useEffect(() => {
        setLocation(arrayToLatLong(currentLocation));
    } , [currentLocation]);

    const MapController = () => {
        const map = useMap();
        useMapEvents({
            click(e) {
                setLocation(e.latlng);
            },
        });
        map.flyTo(location);

        return <></>;
    };
    return (
        <MapContainer center={location} zoom={15} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={location}>
                <Popup>
                   {language.components.currentLocation} <br /> {location.toString()}
                </Popup>
            </Marker>
            <MapController />
            <ScaleControl position='bottomleft' />
        </MapContainer>
    );
};
export default OpenLayerMap;