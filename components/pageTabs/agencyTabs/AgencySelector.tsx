import Alert from '@mui/material/Alert';
import AutoCompletePlus, { taggedItem } from '../../controls/AutoCompletePlus';
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

    const [items, setItems] = useState<taggedItem<string>[]>();

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
                    return { tag: country.country_code, displayText: country.englishName + ' - ' + country.nativeName };
                });
                setItems(_items);
            }
        }
        );
    }, []);

    return (
        <TabPanel activeIndex={currentStep.toString()} index='0'>
            <AutoCompletePlus onChanged={(agency) => agencyChanged(!agency ? '' : agency.displayText)} items={[{ tag: '131s', displayText: 'آژانس بانوان خورشید' }, { tag: '2', displayText: '131 لاهیجان' }]}
                label={agenciesPage.agencyName} />
            <AutoCompletePlus onChanged={(countryCode) => countryCodeChanged(!countryCode ? '' : countryCode.tag)} items={items}
                label={agenciesPage.localization} />
            <Alert severity='warning'>
                {agenciesPage.localizationWarning}
            </Alert>
        </TabPanel>
    );

};

export default AgencySelector;