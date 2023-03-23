import AutoCompletePlus, { TaggedItem } from '../../controls/AutoCompletePlus';
import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../context/LanguageContext';
import { useContext, useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import { UserAgenciesContext } from '../../context/UserAgenciesContext';
import { AgencyDataList } from '../../../types/agencies';
import { AllSettingsContext } from '../../context/AllSettingsContext';
import SettingFetcher from '../../controls/SettingFetcher';
import Typography from '@mui/material/Typography';
import { LocalizationInfoContext } from '../../context/LocalizationInfoContext';
import { LocalizationInfoType } from '../../../lib/geography';

export type AgencySelectorProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
    onValuesChanged: (agencyName: string, countryCode: string) => void;
    editMode: boolean;
};

const AgencySelector = (props: AgencySelectorProps) => {


    const { currentStep, onValidationChanged, onValuesChanged, editMode } = props;

    const { language } = useContext(LanguageContext);
    const { agencyData } = useContext(UserAgenciesContext);
    const { userSettings } = useContext(AllSettingsContext);
    const { localizationInfo, setLocalizationInfo } = useContext(LocalizationInfoContext);

    const [agencyName, setAgencyName] = useState('');
    const [countryCode, setCountryCode] = useState('');

    const { agenciesPage } = language;


    const agencyChanged = (agency: string) => {
        setAgencyName(agency);
        onValuesChanged(agency, countryCode);
    };


    useEffect(() => {
        onValidationChanged(agencyName.length > 0 && countryCode.length > 0);
    }, [agencyName, countryCode, onValidationChanged]);
    useEffect(() => {
        if (userSettings) {
            const setLocalization = async () => {
                const response = await import('../../../data/localization/' + userSettings.localization + '.json');
                const localization = response.default as LocalizationInfoType;
                setLocalizationInfo(localization);
            };
            setCountryCode(userSettings.localization);
            onValuesChanged(agencyName, userSettings.localization);
            setLocalization();
        }
    }, [agencyName, onValuesChanged, setLocalizationInfo, userSettings]);

    const agencyItems: TaggedItem<string>[] = useMemo(() => {
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
            {userSettings ?
                <Typography sx={{ mt: 2 }} variant='body2'>{agenciesPage.localization}: {localizationInfo.name}</Typography>
                :
                <SettingFetcher />
            }
        </TabPanel>
    );

};

export default AgencySelector;