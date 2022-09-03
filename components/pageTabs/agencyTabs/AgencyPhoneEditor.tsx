import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { useContext, useRef } from 'react';
import CenterBox from '../../controls/CenterBox';
import Alert from '@mui/material/Alert';
import { isPhoneNumberValid, onlyNumbersRegex } from '../../../lib/validator';
import ForcedPatternInput from '../../controls/ForcedPatternInput';

export type AgencyPhoneEditorProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
}
const AgencyPhoneEditor = (props: AgencyPhoneEditorProps) => {

    const { currentStep, onValidationChanged } = props;

    const phoneNumber1Ref = useRef<HTMLInputElement>(null);
    const phoneNumber2Ref = useRef<HTMLInputElement>(null);
    const mobileNumberRef = useRef<HTMLInputElement>(null);

    const { language } = useContext(LanguageContext);

    const { agenciesPage } = language;


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

    return (
        <>
            <TabPanel wrapMode={true} activeIndex={currentStep.toString()} index='1'>
                <ForcedPatternInput pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                    inputRef={phoneNumber1Ref} required helperText={agenciesPage.agencyMainPhoneNumber} dir='ltr'
                    type='tel' label={agenciesPage.phoneNumberPlaceholder1} inputProps={{ maxLength: 30 }} />
                <ForcedPatternInput pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                    inputRef={phoneNumber2Ref} dir='ltr' type='tel' helperText={agenciesPage.agencySecondaryPhoneNumber}
                    label={agenciesPage.phoneNumberPlaceholder2} inputProps={{ maxLength: 30 }} />
                <CenterBox>
                    <ForcedPatternInput pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                        inputRef={mobileNumberRef} required dir='ltr' type='tel' label={agenciesPage.mobileNumberPlaceholder}
                        inputProps={{ maxLength: 30 }}/>
                    <Alert severity='info'>{agenciesPage.mobileNumberVisibility}</Alert>
                </CenterBox>
            </TabPanel>

        </>
    );
};

export default AgencyPhoneEditor;