import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { RMap, ROSM } from 'rlayers';

const Map = () => {
    const center = fromLonLat([2.364, 48.82]);

    return (
        <div style={{ width: 800 }}>
            <RMap width='100%' height='400px' initial={{ center: center, zoom: 11 }}>
                <ROSM />
            </RMap>
        </div>
    );
};

export default Map;