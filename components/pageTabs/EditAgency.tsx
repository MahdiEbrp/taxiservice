import AgencyPhoneEditor from './AgencyPhoneEditor';
import AgencySelector from './AgencySelector';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CenterBox from '../../components/controls/CenterBox';
import ImageLoader from '../controls/ImageLoader';
import Link from '@mui/material/Link';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { ToastContext } from '../../lib/context/ToastContext';
import { useContext, useEffect, useState } from 'react';

const EditAgency = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [isValidPhone, setIsPhoneValid] = useState(false);
    const [showError, setShowError] = useState(false);
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    /* #endregion */
    /* #region Language section */
    const { agenciesPage, notification, settings } = language;
    const { editAgency } = agenciesPage;
    const { direction } = settings;
    /* #endregion */
    const [title, setTitle] = useState(editAgency.title);
    /* #region Functions section */
    const nextStep = () => {
        setShowError(false);
        if (!selectedAgency) {
            setToast({ id: Date.now(), message: notification.selectAgency, alertColor: 'info' });
            return;
        }
        if (!isValidPhone && currentStep === 1) {
            setToast({ id: Date.now(), message: notification.incorrectFormat, alertColor: 'error' });
            setShowError(true);
            return;
        }
        setCurrentStep((currentStep) => currentStep + 1);
    };
    /* #endregion */
    /* #region Callback hook section */
    useEffect(() => {
        if (selectedAgency)
            setTitle(selectedAgency);
    }, [selectedAgency, title]);
    /* #endregion */
    return (
        <>
            <Card dir={direction}>
                <CardHeader title={title} />
                <CardMedia>
                    <ImageLoader src='/images/agencies.svg' alt='images' width={300} height={300} />
                </CardMedia>
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
                        <AgencySelector currentStep={currentStep} onValueChanged={(agency) => setSelectedAgency(agency)} />
                        <AgencyPhoneEditor currentStep={currentStep} onValidationChanged={(isValid) => setIsPhoneValid(isValid)} />
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

