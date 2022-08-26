import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';
import dynamic from 'next/dynamic';
import { taggedItem } from '../../controls/AutoCompletePlus';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField } from '@mui/material';

export type AgencyAddressProps = {
    currentStep: number;
};

const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep } = props;

    const [location, setLocation] = useState<taggedItem<number[]> | null>(null);

    const updateLocation = (newLocation: taggedItem<number[]> | null) => {
        if (newLocation)
            setLocation(newLocation);
    };

    return (
        <TabPanel activeIndex={currentStep.toString()} index='2'>
            <FormControlLabel label="search..." control={<PlacesSearchBox sx={{margin:'20px'}} onLocationChanged={(item) => updateLocation(item)} />} />
            <Map currentLocation={location?.tag || [0, 0]} />
            <FormControlLabel label={'hello'} control={<TextField  />}  />
        </TabPanel>
    );
};

export default AgencyAddress;