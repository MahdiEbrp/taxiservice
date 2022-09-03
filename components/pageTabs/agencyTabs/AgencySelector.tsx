import Alert from '@mui/material/Alert';
import AutoCompletePlus, { taggedItem } from '../../controls/AutoCompletePlus';
import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { useContext, useEffect, useState } from 'react';
import { CountryListContext } from '../../../lib/context/CountryListContext';
import TextField from '@mui/material/TextField';

export type AgencySelectorProps = {
    currentStep: number;
    onAgencyChanged?: (agency: string) => void;
    onCountryCodeChanged?: (country: string) => void;
    editMode: boolean;
};

const AgencySelector = (props: AgencySelectorProps) => {

    const { currentStep, onAgencyChanged, onCountryCodeChanged, editMode } = props;

    const { language } = useContext(LanguageContext);
    const { countryList } = useContext(CountryListContext);

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
        if (countryList) {
            const _items = countryList.data.map(country => {
                return { tag: country.code, displayText: country.name };
            });
            setItems(_items);
        }
    }, [countryList]);

    return (
        <TabPanel activeIndex={currentStep.toString()} index='0'>
            {editMode ?
                <AutoCompletePlus onChanged={(agency) => agencyChanged(!agency ? '' : agency.displayText)} items={[{ tag: '131s', displayText: 'آژانس بانوان خورشید' }, { tag: '2', displayText: '131 لاهیجان' }]}
                    label={agenciesPage.agencyName} />
                :
                <TextField sx={{ width: 'min(70vw, 300px)' }} label={agenciesPage.agencyName} onBlur={(e) => agencyChanged(e.target.value)}
                    inputProps={{ maxLength: 50 }} helperText={agenciesPage.maximumLengthOfAgencyName} />
            }
            <AutoCompletePlus onChanged={(countryCode) => countryCodeChanged(!countryCode ? '' : countryCode.tag)} items={items}
                label={agenciesPage.localization} />
            <Alert severity='warning'>
                {agenciesPage.localizationWarning}
            </Alert>
        </TabPanel>
    );

};

export default AgencySelector;