import 'ol/ol.css';
import { Box } from '@mui/material';
import { RMap, ROSM } from 'rlayers';
import { fromLonLat } from 'ol/proj';

const OpenLayerMap =() => {

    const center = fromLonLat([2.364, 48.82]);

    return (
        <Box sx={{ width: '80%' }}>
            <RMap width={'100%'} height={'60vh'} initial={{ center: center, zoom: 11 }}>
                <ROSM />
            </RMap>
        </Box>
    );
};

export default OpenLayerMap;