import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CenterBox from '../../components/controls/CenterBox';
import ComboBoxWithGroup from '../../components/controls/ComboBoxWithOption';
import ImageLoader from '../controls/ImageLoader';
import Link from '@mui/material/Link';
import TabPanel from '../../components/controls/TabPanel';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { ToastContext } from '../../lib/context/ToastContext';
import { useContext, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { isPhoneNumberValid } from '../../lib/Validator';
import Alert from '@mui/material/Alert';
const EditAgency = () => {
    /* #region Reference section*/
    const phoneNumber1Ref = useRef<HTMLInputElement>(null);
    const phoneNumber2Ref = useRef<HTMLInputElement>(null);
    const mobileNumberRef = useRef<HTMLInputElement>(null);
    /* #endregion */
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAgency, setSelectedAgency] = useState('');
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
    const phoneNumbersValidation = () => {
        const phoneNumber1 = phoneNumber1Ref.current?.value;
        const phoneNumber2 = phoneNumber2Ref.current?.value;
        const mobileNumber = mobileNumberRef.current?.value;
        if (phoneNumber1 && mobileNumber) {
            const requiredValidation = isPhoneNumberValid(phoneNumber1) && isPhoneNumberValid(mobileNumber);
            if (phoneNumber2)
                return requiredValidation && isPhoneNumberValid(phoneNumber2);
            return requiredValidation;
        }
        return false;
    };
    const nextStep = () => {
        if (!selectedAgency) {
            setToast({ id: Date.now(), message: notification.selectAgency, alertColor: 'info' });
            return;
        }
        if (!phoneNumbersValidation() && currentStep === 1) {
            setToast({ id: Date.now(), message: notification.incorrectFormat, alertColor: 'error' });
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
                    <ImageLoader src="/images/agencies.svg" alt='images' width={300} height={300} />
                </CardMedia>
                <CardContent sx={{ alignmentItem: 'baseline', flexDirection: 'row', flexWrap: 'wrap', }}>
                    <Breadcrumbs separator="›" aria-label="agency-breadcrumb">
                        {currentStep > -1 && <Link key="0" onClick={() => setCurrentStep(0)} color="text.primary">
                            {editAgency.agencySelection}
                        </Link>
                        }
                        {currentStep > 0 && <Link key="1" onClick={() => setCurrentStep(1)} color="text.primary">
                            {editAgency.editPhone}
                        </Link>
                        }
                    </Breadcrumbs>
                    <CenterBox>
                        <TabPanel activeIndex={currentStep.toString()} index='0'>
                            <ComboBoxWithGroup onValueChanged={((agency) => setSelectedAgency(agency))} items={['آژانس بانوان خورشید', '131 لاهیجان']}
                                label={agenciesPage.agencyName} />
                        </TabPanel>
                        <TabPanel wrapMode={true} activeIndex={currentStep.toString()} index='1'>
                            <TextField ref={phoneNumber1Ref} required helperText={editAgency.agencyMainPhoneNumber} dir='ltr' type='tel' placeholder={editAgency.phoneNumberPlaceholder1} />
                            <TextField ref={phoneNumber2Ref} dir='ltr' type='tel' helperText={editAgency.agencySecondaryPhoneNumber} placeholder={editAgency.phoneNumberPlaceholder2} />
                            <CenterBox>
                                <TextField ref={mobileNumberRef} required dir='ltr' type='tel' placeholder={editAgency.mobileNumberPlaceholder} />
                                <Alert severity="info">{editAgency.mobileNumberVisibility}</Alert>
                            </CenterBox>
                        </TabPanel>
                    </CenterBox>
                </CardContent>
                <CardActions sx={{ flexDirection: 'row-reverse' }}>
                    {<Button variant="contained" color="primary" onClick={nextStep} >{agenciesPage.next}</Button>}
                </CardActions>
            </Card>

        </>
    );
};

export default EditAgency;

