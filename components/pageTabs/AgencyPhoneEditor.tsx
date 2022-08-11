import TabPanel from '../controls/TabPanel';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { useContext, useRef } from 'react';
import CenterBox from '../controls/CenterBox';
import Alert from '@mui/material/Alert';
import { isPhoneNumberValid, onlyNumbersRegex } from '../../lib/Validator';
import ForcedPatternInput from '../controls/ForcedPatternInput';
export interface agencyPhoneEditorProps {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
}
const AgencyPhoneEditor = (props: agencyPhoneEditorProps) => {
    const { currentStep, onValidationChanged } = props;
    /* #region Reference section*/
    const phoneNumber1Ref = useRef<HTMLInputElement>(null);
    const phoneNumber2Ref = useRef<HTMLInputElement>(null);
    const mobileNumberRef = useRef<HTMLInputElement>(null);
    /* #endregion */
    /* #region Context section */
    const { language } = useContext(LanguageContext);
    /* #endregion */
    /* #region Language section */
    const { agenciesPage } = language;
    const { editAgency } = agenciesPage;
    /* #endregion */
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
                    inputRef={phoneNumber1Ref} required helperText={editAgency.agencyMainPhoneNumber} dir='ltr' type='tel' label={editAgency.phoneNumberPlaceholder1} />
                <ForcedPatternInput pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                    inputRef={phoneNumber2Ref} dir='ltr' type='tel' helperText={editAgency.agencySecondaryPhoneNumber} label={editAgency.phoneNumberPlaceholder2} />
                <CenterBox>
                    <ForcedPatternInput pattern={onlyNumbersRegex} onBlur={() => onValidationChanged(phoneNumbersValidation())}
                        inputRef={mobileNumberRef} required dir='ltr' type='tel' label={editAgency.mobileNumberPlaceholder} />
                    <Alert severity='info'>{editAgency.mobileNumberVisibility}</Alert>
                </CenterBox>
            </TabPanel>

        </>
    );
};

export default AgencyPhoneEditor;