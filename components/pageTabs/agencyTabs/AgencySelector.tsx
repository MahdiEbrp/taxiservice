import Alert from '@mui/material/Alert';
import AutoCompletePlus, { taggedItem } from '../../controls/AutoCompletePlus';
import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../context/LanguageContext';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CountryListContext } from '../../context/CountryListContext';
import TextField from '@mui/material/TextField';
import { UserAgenciesContext } from '../../context/UserAgenciesContext';
import { AgencyDataList } from '../../../types/agencies';

export type AgencySelectorProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
    onValuesChanged: (agencyName: string, countryCode: string) => void;
    editMode: boolean;
};

const AgencySelector = (props: AgencySelectorProps) => {

    const { currentStep, onValidationChanged, onValuesChanged, editMode } = props;

    const { language } = useContext(LanguageContext);
    const { countryList } = useContext(CountryListContext);
    const { agencyData } = useContext(UserAgenciesContext);

    const [agencyName, setAgencyName] = useState('');
    const [countryCode, setCountryCode] = useState('');

    const { agenciesPage } = language;

    const [items, setItems] = useState<taggedItem<string>[]>();

    const agencyChanged = (agency: string) => {
        setAgencyName(agency);
        onValuesChanged(agency, countryCode);
    };

    const countryCodeChanged = (country: string) => {
        setCountryCode(country);
        onValuesChanged(agencyName, country);
    };

    useEffect(() => {
        onValidationChanged(agencyName.length > 0 && countryCode.length > 0);
    }, [agencyName, countryCode, onValidationChanged]);

    useEffect(() => {
        if (countryList) {
            const _items = countryList.data.map(country => {
                return { tag: country.code, displayText: country.name };
            });
            setItems(_items);
        }
    }, [countryList]);

    const agencyItems: taggedItem<string>[] = useMemo(() => {
        if (agencyData && agencyData.length > 0) {
            const values = agencyData as AgencyDataList;
            return values.map(agency => {
                return { tag: agency.id, displayText: agency.agencyName };
            });
        }
        return [];
    }, [agencyData]);

    return (
        <TabPanel activeIndex={currentStep.toString()} index='0'>
            {editMode ?
                <AutoCompletePlus onChanged={(agency) => agencyChanged(!agency ? '' : agency.displayText)} items={agencyItems} label={agenciesPage.agencyName} />
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