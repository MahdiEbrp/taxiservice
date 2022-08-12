import Alert from '@mui/material/Alert';
import ComboBoxWithGroup from '../controls/ComboBoxWithOption';
import CountryList from '../../lib/Geography';
import TabPanel from '../controls/TabPanel';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { useContext, useMemo } from 'react';
export interface AgencySelectorProps {
    currentStep: number;
    onValueChanged: (agency: string) => void;
}
const AgencySelector = (props: AgencySelectorProps) => {
    const { language } = useContext(LanguageContext);
    const { agenciesPage } = language;
    const {editAgency} = agenciesPage;
    const { currentStep, onValueChanged } = props;
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
            <ComboBoxWithGroup onValueChanged={((agency) => onValueChanged(agency))} items={[{ key: '131s', value: 'آژانس بانوان خورشید' }, { key: '2', value: '131 لاهیجان' }]}
                label={agenciesPage.agencyName} />
            <ComboBoxWithGroup items={countryList}
                label={editAgency.localization} />
            <Alert severity='warning'>
                {editAgency.localizationWarning}
            </Alert>
        </TabPanel>
    );

};
export default AgencySelector;