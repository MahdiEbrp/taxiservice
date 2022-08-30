import TabPanel from '../../controls/TabPanel';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { useContext, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import moment, { Moment } from 'moment';
import MomentUtils from '@date-io/moment';

export type WorkingHoursProps = {
    currentStep: number;
    onWorkingDaysChanged?: (address: string) => void;
    onWorkingHoursChanged?: (address: string) => void;
};

const AgencyWorkingHours = (props: WorkingHoursProps) => {

    const { currentStep } = props;

    const { language } = useContext(LanguageContext);

    const [selectedDate, setDate] = useState(moment());

    const { settings, agenciesPage } = language;

    const handleChange = (newValue: Moment | null) => {
        if (newValue)
            setDate(newValue);
    };
    return (
        <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='3'>

            <LocalizationProvider dateAdapter={MomentUtils}>

                <TimePicker
                    label={agenciesPage.workingHours}
                    value={selectedDate}
                    onChange={handleChange}
                    ampm={false}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </TabPanel >
    );
};

export default AgencyWorkingHours;