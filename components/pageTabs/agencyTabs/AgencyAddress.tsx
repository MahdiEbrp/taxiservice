import Alert from '@mui/material/Alert';
import CenterBox from '../../controls/CenterBox';
import CircularLoading from '../../controls/CircularLoading';
import PlacesSearchBox from '../../controls/PlacesSearchBox';
import TabPanel from '../../controls/TabPanel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { AgencyData } from '../../../types/agencies';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { TaggedItem } from '../../controls/AutoCompletePlus';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

export type AgencyAddressProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
    onValuesChange: (address: string, location: TaggedItem<number[]> | null) => void;
    selectedAgencyData: AgencyData | null;
};

const Map = dynamic(() => import('../../controls/OpenLayerMap'), { ssr: false });

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep, onValidationChanged, onValuesChange, selectedAgencyData } = props;
    const addressRef = useRef<HTMLInputElement>(null);
    const defaultAddress = selectedAgencyData?.address || '';
    const latitude = selectedAgencyData?.latitude;
    const longitude = selectedAgencyData?.longitude;
    const agencyName = selectedAgencyData?.agencyName || '';
    const defaultLocation = useMemo(() => {
        return latitude && longitude ? { tag: [latitude, longitude], displayText: '' } : null;
    }, [latitude, longitude]);

    const [location, setLocation] = useState<TaggedItem<number[]> | null>(defaultLocation);
    const [mapReady, setMapReady] = useState(false);
    const [defaultAgencyName, setDefaultAgencyName] = useState(agencyName);

    const { language } = useContext(LanguageContext);
    const { localizationInfo } = useContext(LocalizationInfoContext);

    const { settings, agenciesPage } = language;
    const updateLocation = (newLocation: TaggedItem<number[]> | null) => {
        const address = addressRef.current?.value || '';
        if (newLocation) {
            setLocation(newLocation);
            onValuesChange(address, newLocation);
            validationChange();
        }
    };
    const updateAddress = () => {
        const address = addressRef.current?.value || '';
        onValuesChange(address, location);
        validationChange();
    };

    const validationChange = () => {
        const address = addressRef.current?.value || '';
        onValidationChanged(address.length > 0 && location !== null);
    };
    useEffect(() => {
        if (agencyName !== defaultAgencyName && addressRef.current) {
            setDefaultAgencyName(agencyName);
            setLocation(defaultLocation);
            addressRef.current.value = defaultAddress;
            onValuesChange(defaultAddress, defaultLocation);
            onValidationChanged(defaultAddress.length > 0 && defaultLocation !== null);
        }
    }, [agencyName, defaultAddress, defaultAgencyName, defaultLocation, onValidationChanged, onValuesChange]);

    return (
        <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='2'>
            <CenterBox sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Typography variant='body2'>{agenciesPage.businessLocation}</Typography>
                <PlacesSearchBox sx={{ margin: 2 }} onLocationChanged={(item) => updateLocation(item)} />
            </CenterBox>
            <Map currentLocation={location?.tag || [localizationInfo.lat, localizationInfo.long]} whenReady={(isReady) => setMapReady(isReady)}
                onLocationChanged={(location) => updateLocation({ displayText: '', tag: location })} />
            {!mapReady && <CircularLoading />}
            <TextField inputRef={addressRef} multiline required onBlur={() => updateAddress()} label={agenciesPage.businessLocation} sx={{ width: '70%' }}
                variant='filled' inputProps={{ maxLength: 300 }} />
            <Alert severity='warning'>
                {agenciesPage.addressWarning}
            </Alert>
        </TabPanel>
    );
};

export default AgencyAddress;