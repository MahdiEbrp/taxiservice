import AgencyAddress from './agencyTabs/AgencyAddress';
import AgencyPhoneEditor from './agencyTabs/AgencyPhoneEditor';
import AgencySelector from './agencyTabs/AgencySelector';
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
import { ToastContext } from '../../lib/context/ToastContext';
import { useContext, useEffect, useState } from 'react';

const EditAgency = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [allPhoneValid, setAllPhoneValid] = useState(false);
    const [showError, setShowError] = useState(false);

    const { language } = useContext(LanguageContext);
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
        setCurrentStep((currentStep) => currentStep + 1);
    };

    useEffect(() => {
        if (selectedAgency)
            setTitle(selectedAgency);
        else
            setTitle(editAgency.title);
    }, [editAgency.title, selectedAgency, title]);

    return (
        <>
            <Card dir={direction}>
                <CardHeader title={title} />
                <CardContent sx={{ alignmentItem: 'baseline', flexDirection: 'row', flexWrap: 'wrap', }}>
                    <Breadcrumbs separator='›' aria-label='agency-breadcrumb'>
                        {currentStep > -1 &&
                            <Link key='0' onClick={() => setCurrentStep(0)} color='text.primary'>
                                {editAgency.agencySelection}
                            </Link>
                        }
                        {currentStep > 0 &&
                            <Link key='1' onClick={() => setCurrentStep(1)} color='text.primary'>
                                {editAgency.editPhone}
                            </Link>
                        }
                        {currentStep > 1 &&
                            <Link key='1' onClick={() => setCurrentStep(2)} color='text.primary'>
                                {editAgency.editAddress}
                            </Link>
                        }
                    </Breadcrumbs>
                    <CenterBox>
                        <AgencySelector currentStep={currentStep} onAgencyChanged={(agency) => setSelectedAgency(agency)}
                            onCountryCodeChanged={(code) => setSelectedCountryCode(code)} />
                        <AgencyPhoneEditor currentStep={currentStep} onValidationChanged={(isValid) => setAllPhoneValid(isValid)} />
                        <AgencyAddress currentStep={currentStep} localization={'IR'} />
                        {showError && <Alert severity='error'>{editAgency.phoneNumbersError}</Alert>}
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

