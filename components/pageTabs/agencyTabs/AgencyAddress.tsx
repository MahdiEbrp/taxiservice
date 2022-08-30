import Alert from '@mui/material/Alert';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { taggedItem } from '../../controls/AutoCompletePlus';
import { useContext, useState } from 'react';
import CenterBox from '../../controls/CenterBox';
import Typography from '@mui/material/Typography';

export type AgencyAddressProps = {
    currentStep: number;
    onLocationChanged?: (location: taggedItem<number[]> | null) => void;
    onAddressChanged?: (address: string) => void;
};

const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep, onLocationChanged, onAddressChanged } = props;

    const [location, setLocation] = useState<taggedItem<number[]> | null>(null);

    const { language } = useContext(LanguageContext);

    const { settings, agenciesPage } = language;

    const updateLocation = (newLocation: taggedItem<number[]> | null) => {
        if (newLocation) {
            setLocation(newLocation);
            if (onLocationChanged)
                onLocationChanged(newLocation);
        }
    };
    const updateAddress = (newAddress: string) => {
        if (onAddressChanged)
            onAddressChanged(newAddress);
    };

    return (
        <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='2'>
            <CenterBox sx={{flexDirection:'row',flexWrap:'wrap'}}>
                <Typography variant='body2'>{agenciesPage.businessLocation}</Typography>
                <PlacesSearchBox sx={{ margin: 2}} onLocationChanged={(item) => updateLocation(item)} />
            </CenterBox>
            <Map currentLocation={location?.tag || [0, 0]} />
            <TextField multiline required onBlur={e => updateAddress(e.target.value)} label={agenciesPage.businessLocation} sx={{ width: '70%' }} variant='filled' />
            <Alert severity='warning'>
                {agenciesPage.addressWarning}
            </Alert>
        </TabPanel>
    );
};

export default AgencyAddress;