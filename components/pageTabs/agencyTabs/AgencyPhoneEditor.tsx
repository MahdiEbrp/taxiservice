import Alert from '@mui/material/Alert';
import CenterBox from '../../controls/CenterBox';
import ForcedPatternInput from '../../controls/ForcedPatternInput';
import TabPanel from '../../controls/TabPanel';
import { AgencyData } from '../../../types/agencies';
import { LanguageContext } from '../../context/LanguageContext';
import { isPhoneNumberValid, onlyNumbersRegex } from '../../../lib/validator';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export type AgencyPhoneEditorProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
    onValuesChange: (phoneNumber1: string, phoneNumber2: string, mobileNumber: string) => void;
    selectedAgencyData: AgencyData | null;
};
const AgencyPhoneEditor = (props: AgencyPhoneEditorProps) => {

    const { currentStep, onValidationChanged, onValuesChange, selectedAgencyData } = props;

    const phoneNumber1Ref = useRef<HTMLInputElement>(null);
    const phoneNumber2Ref = useRef<HTMLInputElement>(null);
    const mobileNumberRef = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);

    const { agenciesPage } = language;

    const defaultPhoneNumber1 = selectedAgencyData?.phoneNumber1 || '';
    const defaultPhoneNumber2 = selectedAgencyData?.phoneNumber2 || '';
    const defaultMobileNumber = selectedAgencyData?.mobileNumber || '';
    const agencyName = selectedAgencyData?.agencyName || '';
    const [defaultAgencyName, setDefaultAgencyName] = useState(agencyName);
    const phoneNumbersValidation = useCallback(() => {
        const phoneNumber1 = phoneNumber1Ref.current?.value;
        const phoneNumber2 = phoneNumber2Ref.current?.value;
        const mobileNumber = mobileNumberRef.current?.value;
        onValuesChange(phoneNumber1 || '', phoneNumber2 || '', mobileNumber || '');
        if (phoneNumber1 && mobileNumber) {
            const requiredValidation = isPhoneNumberValid(phoneNumber1) && isPhoneNumberValid(mobileNumber);
            if (phoneNumber2)
                return requiredValidation && isPhoneNumberValid(phoneNumber2);
            return requiredValidation;
        }
        return false;
    }, [onValuesChange]);
    useEffect(() => {
        if (agencyName !== defaultAgencyName && phoneNumber1Ref.current && phoneNumber2Ref.current && mobileNumberRef.current) {
            phoneNumber1Ref.current.value = defaultPhoneNumber1;
            phoneNumber2Ref.current.value = defaultPhoneNumber2;
            mobileNumberRef.current.value = defaultMobileNumber;
            onValuesChange(defaultPhoneNumber1, defaultPhoneNumber2, defaultMobileNumber);
            setDefaultAgencyName(agencyName);
            onValidationChanged(phoneNumbersValidation());
        }
    }, [agencyName, defaultAgencyName, defaultMobileNumber, defaultPhoneNumber1, defaultPhoneNumber2, onValidationChanged, onValuesChange, phoneNumbersValidation]);

    return (
        <>
            <TabPanel wrapMode={true} activeIndex={currentStep.toString()} index='1'>
                <ForcedPatternInput defaultValue={defaultPhoneNumber1} pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                    inputRef={phoneNumber1Ref} required helperText={agenciesPage.agencyMainPhoneNumber} dir='ltr'
                    type='tel' label={agenciesPage.phoneNumberPlaceholder1} inputProps={{ maxLength: 30 }} />
                <ForcedPatternInput defaultValue={defaultPhoneNumber2} pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                    inputRef={phoneNumber2Ref} dir='ltr' type='tel' helperText={agenciesPage.agencySecondaryPhoneNumber}
                    label={agenciesPage.phoneNumberPlaceholder2} inputProps={{ maxLength: 30 }} />
                <CenterBox>
                    <ForcedPatternInput defaultValue={defaultMobileNumber} pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                        inputRef={mobileNumberRef} required dir='ltr' type='tel' label={agenciesPage.mobileNumberPlaceholder}
                        inputProps={{ maxLength: 30 }} />
                    <Alert severity='info'>{agenciesPage.mobileNumberVisibility}</Alert>
                </CenterBox>
            </TabPanel>

        </>
    );
};

export default AgencyPhoneEditor;