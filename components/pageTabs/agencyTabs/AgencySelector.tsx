import Alert from '@mui/material/Alert';
import AutoCompletePlus from '../../controls/AutoCompletePlus';
import CountryList from '../../../lib/Geography';
import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { useContext, useMemo } from 'react';
export interface AgencySelectorProps {
    currentStep: number;
    onAgencyChanged?: (agency: string) => void;
    onCountryCodeChanged?: (country: string) => void;
}
const AgencySelector = (props: AgencySelectorProps) => {

    const { currentStep, onAgencyChanged, onCountryCodeChanged } = props;

    const { language } = useContext(LanguageContext);
    const { agenciesPage } = language;
    const { editAgency } = agenciesPage;

    const agencyChanged = (agency: string) => {
        if (onAgencyChanged)
            onAgencyChanged(agency);
    };
    const countryCodeChanged = (country: string) => {
        if (onCountryCodeChanged)
            onCountryCodeChanged(country);
    };
    const countryList = useMemo(() => {
        return CountryList.map(({ country_code, englishName, nativeName }) => (
            {
                value: englishName + ' - ' + nativeName,
                key: country_code,
            }
        ));
    }, []);

    return (
        <TabPanel activeIndex={currentStep.toString()} index='0'>
            <AutoCompletePlus onChanged={(agency) => agencyChanged(!agency ? '' : agency.value)} items={[{ key: '131s', value: 'آژانس بانوان خورشید' }, { key: '2', value: '131 لاهیجان' }]}
                label={agenciesPage.agencyName} />
            <AutoCompletePlus onChanged={(countryCode) => countryCodeChanged(!countryCode ? '' : countryCode.key)} items={countryList}
                label={editAgency.localization} />
            <Alert severity='warning'>
                {editAgency.localizationWarning}
            </Alert>
        </TabPanel>
    );

};
export default AgencySelector;