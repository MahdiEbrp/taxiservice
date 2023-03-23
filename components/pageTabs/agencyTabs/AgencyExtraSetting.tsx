import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../context/LanguageContext';
import { useContext, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import ForcedPatternInput from '../../controls/ForcedPatternInput';
import { onlyNumbersRegex } from '../../../lib/validator';
import { AgencyData } from '../../../types/agencies';

export type AgencyExtraSettingProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
    onValuesChange: (commissionRate: number, currencySymbol: string) => void;
    selectedAgencyData: AgencyData | null;
};

const AgencyExtraSetting = (props: AgencyExtraSettingProps) => {

    const commissionRateRef = useRef<HTMLInputElement>(null);
    const currencyRef = useRef<HTMLInputElement>(null);

    const { currentStep, onValidationChanged, onValuesChange, selectedAgencyData } = props;

    const { language } = useContext(LanguageContext);

    const [commissionRate, setCommissionRate] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const defaultCurrencySymbol = selectedAgencyData?.currencySymbol || '';
    const defaultCommissionRate = selectedAgencyData?.commissionRate || 0;
    const { agenciesPage } = language;
    const maxCommissionLength = 3;
    const maxCurrencyLength = 20;

    useEffect(() => {
        if (selectedAgencyData && commissionRateRef.current && currencyRef.current) {
            commissionRateRef.current.value = defaultCommissionRate.toString();
            currencyRef.current.value = defaultCurrencySymbol.toString();
            setIsLoaded(false);
        }
    }, [defaultCommissionRate, defaultCurrencySymbol, selectedAgencyData]);
    useEffect(() => {
        if (!isLoaded && commissionRateRef.current && currencyRef.current) {
            onValuesChange(defaultCommissionRate, defaultCurrencySymbol);
            setCommissionRate(defaultCommissionRate);
            setCurrencySymbol(defaultCurrencySymbol);
            setIsLoaded(true);
            onValidationChanged(defaultCurrencySymbol.trim().length > 0);
        }
    }, [defaultCommissionRate, defaultCurrencySymbol, isLoaded, onValidationChanged, onValuesChange]);

    const handlePercentageBlur = () => {
        if (commissionRateRef.current) {
            let value = Number(commissionRateRef.current.value);
            if (isNaN(value)) {
                setCommissionRate(0);
                commissionRateRef.current.value = '0';

                return;
            }

            value = value > 100 || value < 0 ? 0 : value;
            setCommissionRate(value);
            onValuesChange(value, currencySymbol);
            onValidationChanged(currencySymbol.length > 0 && currencySymbol.length <= maxCurrencyLength);
            commissionRateRef.current.value = value.toString();
        }
    };

    const handleCurrencyBlur = () => {
        if (currencyRef.current) {
            let value = currencyRef.current.value;
            value = value.substring(0, maxCurrencyLength).trim();
            setCurrencySymbol(value);
            onValuesChange(commissionRate, value);
            onValidationChanged(commissionRate > 0 && commissionRate <= 100 && value !== '');
            currencyRef.current.value = value;
        }
    };

    return (
        <TabPanel activeIndex={currentStep.toString()} index={'4'} >
            <ForcedPatternInput defaultValue={defaultCommissionRate} pattern={onlyNumbersRegex} sx={{ width: 'min(70vw, 300px)' }} inputRef={commissionRateRef} label={agenciesPage.percentageOfCommission} onBlur={handlePercentageBlur}
                inputProps={{ maxLength: maxCommissionLength }} helperText={agenciesPage.commissionRateHelperText} />
            <TextField defaultValue={defaultCurrencySymbol} inputRef={currencyRef} sx={{ width: 'min(70vw, 300px)' }} label={agenciesPage.currencySymbol} onBlur={handleCurrencyBlur}
                inputProps={{ maxLength: maxCurrencyLength }} helperText={agenciesPage.currencySymbolHelperText} />
        </TabPanel>
    );

};

export default AgencyExtraSetting;