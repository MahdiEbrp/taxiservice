import AgencyAddress from './agencyTabs/AgencyAddress';
import AgencyPhoneEditor from './agencyTabs/AgencyPhoneEditor';
import AgencySelector from './agencyTabs/AgencySelector';
import AgencyWorkingHours from './agencyTabs/AgencyWorkingHours';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CenterBox from '../controls/CenterBox';
import Link from '@mui/material/Link';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { LocalizationInfoType } from '../../lib/Geography';
import { LocalizationInfoContext } from '../../lib/context/LocalizationInfoContext';
import { ToastContext } from '../../lib/context/ToastContext';
import { taggedItem } from '../controls/AutoCompletePlus';
import { useContext, useEffect, useState } from 'react';

const EditAgency = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [allPhoneValid, setAllPhoneValid] = useState(false);
    const [showError, setShowError] = useState(false);
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<taggedItem<number[]> | null>(null);

    const { language } = useContext(LanguageContext);
    const { setLocalizationInfo } = useContext(LocalizationInfoContext);
    const { setToast } = useContext(ToastContext);

    const { agenciesPage, notification, settings } = language;
    const { editAgency } = agenciesPage;
    const { direction } = settings;

    const [title, setTitle] = useState(editAgency.title);

    const nextStep = () => {

        setShowError(false);

        if (!selectedAgency) {
            setToast({ id: Date.now(), message: notification.selectAgency, alertColor: 'info' });
            return;
        }
        if (!selectedCountryCode) {
            setToast({ id: Date.now(), message: notification.selectCountry, alertColor: 'error' });
            return;
        }
        if (!allPhoneValid && currentStep === 1) {
            setToast({ id: Date.now(), message: notification.incorrectFormat, alertColor: 'error' });
            setShowError(true);
            return;
        }

        if (!location && address.length < 3 && currentStep === 2) {
            setToast({ id: Date.now(), message: notification.addressError, alertColor: 'error' });
            return;
        }
        setCurrentStep((currentStep) => currentStep + 1);
    };

    useEffect(() => {
        if (selectedAgency)
            setTitle(selectedAgency);
        else
            setTitle(editAgency.title);
    }, [editAgency.title, selectedAgency, title]);

    const setLocalization = async (countryCode: string) => {
        if (!countryCode)
            return;
        const response = await import('../../data/localization/' + countryCode + '.json');
        const localization = response.default as LocalizationInfoType;
        setLocalizationInfo(localization);
        setSelectedCountryCode(countryCode);
    };

    const BreadcrumbsSteps = () => {
        const stepsLabel = [agenciesPage.agencySelection, agenciesPage.editPhone, agenciesPage.editAddress, agenciesPage.workingHours].slice(0, currentStep + 1);
        return (
            <Breadcrumbs separator='›' aria-label='agency-breadcrumb'>
                {stepsLabel.map((label, index) => {
                    return (
                        <Link key={index} onClick={() => setCurrentStep(index)} color='text.primary'>
                            {label}
                        </Link>
                    );
                }
                )}
            </Breadcrumbs>
        );
    };

    return (
        <>
            <Card dir={direction}>
                <CardHeader title={title} />
                <CardContent sx={{ alignmentItem: 'baseline', flexDirection: 'row', flexWrap: 'wrap', }}>
                    <BreadcrumbsSteps />
                    <CenterBox>
                        <AgencySelector currentStep={currentStep} onAgencyChanged={(agency) => setSelectedAgency(agency)}
                            onCountryCodeChanged={(code) => setLocalization(code)} />
                        <AgencyPhoneEditor currentStep={currentStep} onValidationChanged={(isValid) => setAllPhoneValid(isValid)} />
                        <AgencyAddress currentStep={currentStep} onAddressChanged={(address) => setAddress(address)} onLocationChanged={(location) => setLocation(location)} />
                        <AgencyWorkingHours currentStep={currentStep} />
                        {showError && <Alert severity='error'>{agenciesPage.phoneNumbersError}</Alert>}
                    </CenterBox>
                </CardContent>
                <CardActions sx={{ flexDirection: 'row-reverse' }}>
                    <Button variant='contained' color='primary' onClick={nextStep} >{agenciesPage.next}</Button>
                </CardActions>
            </Card>

        </>
    );
};

export default EditAgency;

