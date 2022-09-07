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
import { LanguageContext } from '../context/LanguageContext';
import { LocalizationInfoType } from '../../lib/geography';
import { LocalizationInfoContext } from '../context/LocalizationInfoContext';
import { ToastContext } from '../context/ToastContext';
import { taggedItem } from '../controls/AutoCompletePlus';
import { useContext, useEffect, useState } from 'react';
import { postData } from '../../lib/fetchData';
import { getResponseError } from '../../lib/language';

const ModifyAgency = (props: { editMode: boolean; }) => {

    const { editMode } = props;

    const [currentStep, setCurrentStep] = useState(0);

    const [isAgencyTabValid, setIsAgencyTabValid] = useState(false);
    const [isPhoneTabValid, setIsPhoneTabValid] = useState(false);
    const [isAddressTabValid, setIsAddressTabValid] = useState(false);
    const [isWorkingHoursTabValid, setIsWorkingHoursTabValid] = useState(false);

    const [showError, setShowError] = useState(false);

    const [agencyName, setAgencyName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber1, setPhoneNumber1] = useState('');
    const [phoneNumber2, setPhoneNumber2] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [location, setLocation] = useState<taggedItem<number[]> | null>(null);
    const [address, setAddress] = useState('');
    const [isAgencyEnabled, setAgencyEnabled] = useState(false);
    const [workingDays, setWorkingDays] = useState(127);
    const [startOfWorkingHours, setStartOfWorkingHours] = useState('');
    const [endOfWorkingHours, setEndOfWorkingHours] = useState('');

    const { language } = useContext(LanguageContext);
    const { setLocalizationInfo } = useContext(LocalizationInfoContext);
    const { setToast } = useContext(ToastContext);

    const { agenciesPage, notification, settings } = language;
    const { editAgency } = agenciesPage;
    const { direction } = settings;
    const isLastStep = currentStep === 3;
    const [title, setTitle] = useState(editAgency.title);

    const nextStep = () => {

        setShowError(false);

        if (!isAgencyTabValid) {
            setToast({ id: Date.now(), message: !countryCode ? notification.selectCountry : notification.selectAgency, alertColor: 'error' });
            return;
        }

        if (!isPhoneTabValid && currentStep === 1) {
            setToast({ id: Date.now(), message: notification.incorrectFormat, alertColor: 'error' });
            setShowError(true);
            return;
        }

        if (!isAddressTabValid && currentStep === 2) {
            setToast({ id: Date.now(), message: notification.addressError, alertColor: 'error' });
            return;
        }
        setCurrentStep((currentStep) => currentStep + 1);
    };

    useEffect(() => {
        if (agencyName)
            setTitle(agencyName);
        else
            setTitle(editAgency.title);
    }, [editAgency.title, agencyName, title]);

    const setLocalization = async (countryCode: string) => {

        setCountryCode(countryCode);

        if (!countryCode)
            return;
        const response = await import('../../data/localization/' + countryCode + '.json');
        const localization = response.default as LocalizationInfoType;
        setLocalizationInfo(localization);
    };
    const gotoStep = (step: number) => {

        if (showError)
            setShowError(false);
        step = step < 0 ? 0 : step;
        setCurrentStep(step);
    };
    const BreadcrumbsSteps = () => {
        const stepsLabel = [agenciesPage.agencySelection, agenciesPage.editPhone, agenciesPage.editAddress, agenciesPage.workingHours].slice(0, currentStep + 1);
        return (
            <Breadcrumbs separator='›' aria-label='agency-breadcrumb'>
                {stepsLabel.map((label, index) => {
                    return (
                        <Link key={index} onClick={() => gotoStep(index)} color='text.primary'>
                            {label}
                        </Link>
                    );
                }
                )}
            </Breadcrumbs>
        );
    };

    const sendModifyRequest = async () => {

        if (!isWorkingHoursTabValid)
        {
            setToast({ id: Date.now(), message: notification.invalidWorkingHoursTab, alertColor: 'error' });
            return;
        }

        const modifyType = editMode ? 'update' : 'insert';
        const values = {
            agencyName: agencyName, isEnable: isAgencyEnabled,
            phoneNumber1: phoneNumber1, phoneNumber2: phoneNumber2, mobileNumber: mobileNumber,
            address: address, latitude: location?.tag[0] || 0, longitude: location?.tag[1] || 0, workingDays: workingDays
            , startOfWorkingHours: startOfWorkingHours, endOfWorkingHours: endOfWorkingHours
        };
        // eslint-disable-next-line quotes
        const response = await postData(`${process.env.NEXT_PUBLIC_WEB_URL}/api/agency/${modifyType}`, values);
        if (!response)
        {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE',language), alertColor: 'error' });
            return;
        }

        if (response.status === 200) {
            setToast({ id: Date.now(), message: notification.successfullyAddAgency, alertColor: 'success' });
            setCurrentStep(0);
            return;
        }
        setToast({ id: Date.now(), message: response.data, alertColor: 'error' });

    };
    return (
        <>
            <Card dir={direction}>
                <CardHeader title={title} />
                <CardContent sx={{ alignmentItem: 'baseline', flexDirection: 'row', flexWrap: 'wrap', }}>
                    <BreadcrumbsSteps />
                    <CenterBox>
                        <AgencySelector editMode={editMode} currentStep={currentStep} onValidationChanged={(isValid) => setIsAgencyTabValid(isValid)}
                            onValuesChanged={(agency, countryCode) => {
                                setAgencyName(agency);
                                setLocalization(countryCode);
                            }} />
                        <AgencyPhoneEditor currentStep={currentStep} onValidationChanged={(isValid) => setIsPhoneTabValid(isValid)} onValuesChange={(phone1, phone2, mobile) => {
                            setPhoneNumber1(phone1);
                            setPhoneNumber2(phone2);
                            setMobileNumber(mobile);
                        }} />
                        <AgencyAddress currentStep={currentStep} onValidationChanged={(isValid) => setIsAddressTabValid(isValid)}
                            onValuesChange={(address, location) => {
                                setAddress(address);
                                setLocation(location);
                            }} />
                        <AgencyWorkingHours currentStep={currentStep} onValidationChanged={(isValid) => setIsWorkingHoursTabValid(isValid)}
                            onValuesChange={(isEnable, workingDays, startOfWorkingHours, endOfWorkingHours) => {
                                setWorkingDays(workingDays);
                                setStartOfWorkingHours(startOfWorkingHours.clone().utc().toISOString());
                                setEndOfWorkingHours(endOfWorkingHours.clone().utc().toISOString());
                                setAgencyEnabled(isEnable);
                            }} />
                        {showError && <Alert severity='error'>{agenciesPage.phoneNumbersError}</Alert>}
                    </CenterBox>
                </CardContent>
                <CardActions sx={{ flexDirection: 'row', gap: '1rem' }}>
                    <Button disabled={currentStep === 0} variant='contained' color='primary' onClick={() => gotoStep(currentStep - 1)} >{agenciesPage.previous}</Button>
                    <Button disabled={isLastStep} variant='contained' color='primary' onClick={nextStep} >{agenciesPage.next}</Button>
                    {isLastStep && <Button variant='contained' color='primary' onClick={() => sendModifyRequest()}>{editMode ? agenciesPage.update : agenciesPage.add}</Button>}
                </CardActions>
            </Card>

        </>
    );
};

export default ModifyAgency;

