import MomentUtils from '@date-io/moment';
import Switch from '@mui/material/Switch';
import TabPanel from '../../controls/TabPanel';
import TextField from '@mui/material/TextField';
import moment, { Moment } from 'moment';
import { LanguageContext } from '../../../lib/context/LanguageContext';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { useContext, useState } from 'react';
import CenterBox from '../../controls/CenterBox';
import Typography from '@mui/material/Typography';
import WorkingDaysList from '../../controls/WorkingDaysList';


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
        <LocalizationProvider dateAdapter={MomentUtils}>
            <TabPanel dir={settings.direction} activeIndex={currentStep.toString()} index='3'>

                <CenterBox sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Typography variant='body2'>{agenciesPage.activeAgency}</Typography>
                    <Switch defaultChecked />
                </CenterBox>
                <WorkingDaysList />
                <TimePicker
                    label={agenciesPage.workingHours}
                    value={selectedDate}
                    onChange={handleChange}
                    ampm={false}
                    renderInput={(params) => <TextField {...params} />}
                />
            </TabPanel >
        </LocalizationProvider>
    );
};

export default AgencyWorkingHours;