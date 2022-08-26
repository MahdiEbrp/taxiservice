import FormControlLabel from '@mui/material/FormControlLabel';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { taggedItem } from '../../controls/AutoCompletePlus';
import { useContext, useState } from 'react';

export type AgencyAddressProps = {
    currentStep: number;
};

const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep } = props;

    const [location, setLocation] = useState<taggedItem<number[]> | null>(null);

    const { language } = useContext(LanguageContext);

    const { settings, agenciesPage } = language;
    const { editAgency } = agenciesPage;

    const updateLocation = (newLocation: taggedItem<number[]> | null) => {
        if (newLocation)
            setLocation(newLocation);
    };

    return (
        <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='2'>
            <FormControlLabel label={editAgency.businessLocation} control={<PlacesSearchBox sx={{ margin: 2, order: 1 }} onLocationChanged={(item) => updateLocation(item)} />} />
            <Map currentLocation={location?.tag || [0, 0]} />
            <TextField multiline label={'address'} sx={{width:'70%'}} variant='filled' />
        </TabPanel>
    );
};

export default AgencyAddress;