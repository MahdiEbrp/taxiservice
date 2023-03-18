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
import Loader from '../controls/Loader';
import { AgencyDataList } from '../../types/agencies';
import { AllAgenciesContext } from '../context/AllAgenciesContext';
import { LanguageContext } from '../context/LanguageContext';
import { ToastContext } from '../context/ToastContext';
import { UserAgenciesContext } from '../context/UserAgenciesContext';
import { getResponseError } from '../../lib/language';
import { postData } from '../../lib/axiosRequest';
import { TaggedItem } from '../controls/AutoCompletePlus';
import { useContext, useMemo, useEffect, useState } from 'react';
import AgencyExtraSetting from './agencyTabs/AgencyExtraSetting';

export type ModifyAgencyProps = {
    editMode: boolean;
    onReload: () => void;
};
const ModifyAgency = (props: ModifyAgencyProps) => {

    const { editMode,onReload } = props;

    const [currentStep, setCurrentStep] = useState(0);

    const [isAgencyTabValid, setIsAgencyTabValid] = useState(false);
    const [isPhoneTabValid, setIsPhoneTabValid] = useState(false);
    const [isAddressTabValid, setIsAddressTabValid] = useState(false);
    const [isWorkingHoursTabValid, setIsWorkingHoursTabValid] = useState(false);
    const [isAgencyExtraSettingValid, setIsAgencyExtraSettingValid] = useState(false);

    const [showError, setShowError] = useState(false);

    const [agencyName, setAgencyName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber1, setPhoneNumber1] = useState('');
    const [phoneNumber2, setPhoneNumber2] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [location, setLocation] = useState<TaggedItem<number[]> | null>(null);
    const [address, setAddress] = useState('');
    const [isAgencyEnabled, setAgencyEnabled] = useState(false);
    const [workingDays, setWorkingDays] = useState(127);
    const [startOfWorkingHours, setStartOfWorkingHours] = useState('');
    const [endOfWorkingHours, setEndOfWorkingHours] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [commissionRate, setCommissionRate] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);
    const { agencyNames } = useContext(AllAgenciesContext);
    const { agencyData } = useContext(UserAgenciesContext);

    const { agenciesPage, notification, settings } = language;
    const { editAgency, addNewAgency } = agenciesPage;
    const { direction } = settings;
    const isLastStep = currentStep === 4;
    const agencyCardTitle = editMode ? editAgency.title : addNewAgency.title;
    const [title, setTitle] = useState(agencyCardTitle);
    const selectedAgencyData = useMemo(() => {
        if (Array.isArray(agencyData) && agencyData.length > 0 && editMode) {
            const values = agencyData as AgencyDataList;
            const agency = values.find(agency => agency.agencyName === agencyName);
            if (agency)
                return agency;
        }
        return null;
    }, [agencyData, agencyName, editMode]);

    const nextStep = () => {

        setShowError(false);

        if (!isAgencyTabValid) {
            setToast({ id: Date.now(), message: !countryCode ? notification.selectCountry : notification.selectAgency, alertColor: 'error' });
            return;
        }

        if (agencyNames.includes(agencyName) && !editMode) {
            setToast({ id: Date.now(), message: notification.agencyDuplicateError, alertColor: 'error' });
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

        if (!isWorkingHoursTabValid) {
            setToast({ id: Date.now(), message: notification.invalidWorkingHoursTab, alertColor: 'error' });
            return;
        }
        setCurrentStep((currentStep) => currentStep + 1);
    };
    useEffect(() => {
        if (agencyName)
            setTitle(agencyName);
        else
            setTitle(agencyCardTitle);
    }, [agencyCardTitle, agencyName, title]);


    const gotoStep = (step: number) => {

        if (showError)
            setShowError(false);
        step = step < 0 ? 0 : step;
        setCurrentStep(step);
    };
    const BreadcrumbsSteps = () => {
        const stepsLabel = [agenciesPage.agencySelection, agenciesPage.editPhone, agenciesPage.editAddress
            , agenciesPage.workingHours, agenciesPage.additionalSetting].slice(0, currentStep + 1);
        if (isUpdating)
            return <></>;
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
        if (!isAgencyExtraSettingValid) {
            setToast({ id: Date.now(), message: notification.invalidExtraSettingTab, alertColor: 'error' });
            return;
        }
        const modifyType = editMode ? 'update' : 'insert';
        const values = {
            agencyName: agencyName, isEnable: isAgencyEnabled,
            commissionRate: commissionRate, currencySymbol: currencySymbol,
            phoneNumber1: phoneNumber1, phoneNumber2: phoneNumber2, mobileNumber: mobileNumber,
            address: address, latitude: location?.tag[0] || 0, longitude: location?.tag[1] || 0, workingDays: workingDays
            , startOfWorkingHours: startOfWorkingHours, endOfWorkingHours: endOfWorkingHours
        };
        setIsUpdating(true);
        // eslint-disable-next-line quotes
        const response = await postData(`${process.env.NEXT_PUBLIC_WEB_URL}/api/agency/${modifyType}`, values);

        setIsUpdating(false);

        if (!response) {
            setToast({ id: Date.now(), message: getResponseError('ERR_NULL_RESPONSE', language), alertColor: 'error' });
            return;
        }

        if (response.status === 200) {
            setToast({ id: Date.now(), message: editMode ? notification.successfullyEditAgency : notification.successfullyAddAgency, alertColor: 'success' });
            setCurrentStep(0);
            return;
        }
        const { error } = response.data as { error: string; };
        setToast({ id: Date.now(), message: getResponseError(error, language), alertColor: 'error' });

    };
    return (
        <>
            <Card dir={direction}>
                <CardHeader title={title} />
                <CardContent sx={{ alignmentItem: 'baseline', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <BreadcrumbsSteps />
                    <CenterBox sx={{ display: isUpdating ? 'none' : 'flex' }}>
                        <AgencySelector editMode={editMode} currentStep={currentStep} onValidationChanged={(isValid) => setIsAgencyTabValid(isValid)}
                            onValuesChanged={(agency, countryCode) => {
                                setAgencyName(agency);
                                setCountryCode(countryCode);
                            }} />
                        <AgencyPhoneEditor currentStep={currentStep} selectedAgencyData={selectedAgencyData} onValidationChanged={(isValid) => setIsPhoneTabValid(isValid)} onValuesChange={(phone1, phone2, mobile) => {
                            setPhoneNumber1(phone1);
                            setPhoneNumber2(phone2);
                            setMobileNumber(mobile);
                        }} />
                        <AgencyAddress currentStep={currentStep} selectedAgencyData={selectedAgencyData} onValidationChanged={(isValid) => setIsAddressTabValid(isValid)}
                            onValuesChange={(address, location) => {
                                setAddress(address);
                                setLocation(location);
                            }} />
                        <AgencyWorkingHours currentStep={currentStep} selectedAgencyData={selectedAgencyData} onValidationChanged={(isValid) => setIsWorkingHoursTabValid(isValid)}
                            onValuesChange={(isEnable, workingDays, startOfWorkingHours, endOfWorkingHours) => {
                                setWorkingDays(workingDays);
                                setStartOfWorkingHours(startOfWorkingHours.clone().utc().toISOString());
                                setEndOfWorkingHours(endOfWorkingHours.clone().utc().toISOString());
                                setAgencyEnabled(isEnable);
                            }} />
                        <AgencyExtraSetting currentStep={currentStep} selectedAgencyData={selectedAgencyData}
                            onValidationChanged={(isValid) => setIsAgencyExtraSettingValid(isValid)}
                            onValuesChange={(commissionRate, currencySymbol) => {
                                setCommissionRate(commissionRate);
                                setCurrencySymbol(currencySymbol);
                            }} />
                        {showError && <Alert severity='error'>{agenciesPage.phoneNumbersError}</Alert>}
                    </CenterBox>
                    {isUpdating &&
                        <>
                            <Loader text={editMode ? editAgency.updating : addNewAgency.updating} />
                        </>
                    }
                </CardContent>
                <CardActions sx={{ display: isUpdating ? 'none' : 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <Button variant='contained' color='primary' onClick={() => onReload()}>{agenciesPage.reload}</Button>
                    <Button disabled={currentStep === 0} variant='contained' color='primary' onClick={() => gotoStep(currentStep - 1)} >{agenciesPage.previous}</Button>
                    <Button disabled={isLastStep} variant='contained' color='primary' onClick={nextStep} >{agenciesPage.next}</Button>
                    {isLastStep && <Button variant='contained' color='primary' onClick={() => sendModifyRequest()}>{editMode ? agenciesPage.update : agenciesPage.add}</Button>}
                </CardActions>
            </Card>

        </>
    );
};

export default ModifyAgency;

