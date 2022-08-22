import Alert from '@mui/material/Alert';
import AutoCompletePlus, { ItemProps } from '../../controls/AutoCompletePlus';
import { getCountryList } from '../../../lib/Geography';
import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { useContext, useEffect, useState } from 'react';

export type AgencySelectorProps = {
    currentStep: number;
    onAgencyChanged?: (agency: string) => void;
    onCountryCodeChanged?: (country: string) => void;
};

const AgencySelector = (props: AgencySelectorProps) => {

    const { currentStep, onAgencyChanged, onCountryCodeChanged } = props;

    const { language } = useContext(LanguageContext);
    const { agenciesPage } = language;
    const { editAgency } = agenciesPage;
    const [items, setItems] = useState<ItemProps[]>();

    const agencyChanged = (agency: string) => {
        if (onAgencyChanged)
            onAgencyChanged(agency);
    };

    const countryCodeChanged = (country: string) => {
        if (onCountryCodeChanged)
            onCountryCodeChanged(country);
    };


    useEffect(() => {
        getCountryList().then(countries => {
            if (countries) {
                const _items = countries.data.map(country => {
                    return { key: country.country_code, value: country.englishName + ' - ' + country.nativeName };
                });
                setItems(_items);
            }
        }
        );
    }, []);

    return (
        <TabPanel activeIndex={currentStep.toString()} index='0'>
            <AutoCompletePlus onChanged={(agency) => agencyChanged(!agency ? '' : agency.value)} items={[{ key: '131s', value: 'آژانس بانوان خورشید' }, { key: '2', value: '131 لاهیجان' }]}
                label={agenciesPage.agencyName} />
            <AutoCompletePlus onChanged={(countryCode) => countryCodeChanged(!countryCode ? '' : countryCode.key)} items={items}
                label={editAgency.localization} />
            <Alert severity='warning'>
                {editAgency.localizationWarning}
            </Alert>
        </TabPanel>
    );

};

export default AgencySelector;