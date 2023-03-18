import { LatLngExpression } from 'leaflet';
import { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, ScaleControl, useMap, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LanguageContext } from '../context/LanguageContext';

export type MapProps = {
    currentLocation: number[];
    whenReady?: (isReady: boolean) => void;
    markers?: { location: number[]; text: string; }[];
    onLocationChanged: (location: number[]) => void;
};

const OpenLayerMap = (props: MapProps) => {
    const { currentLocation, whenReady, onLocationChanged, markers } = props;

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
    }, [currentLocation]);

    const MapController = () => {
        const map = useMap();
        useMapEvents({
            click(e) {
                setLocation(e.latlng);
                onLocationChanged([e.latlng.lat, e.latlng.lng]);
            },
        });
        map.flyTo(location);

        return <></>;
    };

    const isMapReady = (isReady: boolean) => {
        if (whenReady)
            whenReady(isReady);
    };

    return (
        <MapContainer center={location} zoom={15} scrollWheelZoom={false} whenReady={() => isMapReady(true)}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={location}>
                <Popup>
                    {language.components.currentLocation} <br /> {location.toString()}
                </Popup>
            </Marker>
            {markers?.map((marker,index) => {
                return (
                    <Marker key={index} position={arrayToLatLong(marker.location)}>
                        <Popup>
                            {marker.text}
                        </Popup>
                    </Marker>
                );
            })}
            <MapController />
            <ScaleControl position='bottomleft' />
        </MapContainer>
    );
};
export default OpenLayerMap;