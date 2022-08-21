import 'ol/ol.css';
import { Box } from '@mui/material';
import { RMap, ROSM, RControl, MapBrowserEvent } from 'rlayers';
import { fromLonLat, toLonLat } from 'ol/proj';
import { useCallback } from 'react';
const OpenLayerMap = () => {

    const center = fromLonLat([49.944444, 37.259722]);

    return (
        <Box sx={{ width: '70vw' }}>
            <RMap width={'100%'} height={'60vh'} initial={{ center: center, zoom: 5 }} onClick={useCallback((e: MapBrowserEvent<UIEvent>) => {
                const coords = e.map.getCoordinateFromPixel(e.pixel);
                const lonlat = toLonLat(coords);
            }, [])}>
                <ROSM>
                    <RControl.RScaleLine />
                    <RControl.RZoom />
                    <RControl.RZoomSlider />
                </ROSM>
            </RMap>
        </Box>
    );
};

export default OpenLayerMap;