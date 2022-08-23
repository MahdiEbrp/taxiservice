import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet';

const OpenLayerMap = () => {

    const position = [37.259722, 49.944444] as LatLngExpression;

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ScaleControl position='bottomleft' />
        </MapContainer>
    );
};
export default OpenLayerMap;