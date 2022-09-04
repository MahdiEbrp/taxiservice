import CenterBox from '../../controls/CenterBox';
import MomentUtils from '@date-io/moment';
import Switch from '@mui/material/Switch';
import TabPanel from '../../controls/TabPanel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import WorkingDaysList from '../../controls/WorkingDaysList';
import moment, { Moment } from 'moment';
import { LanguageContext } from '../../context/LanguageContext';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { useContext, useState } from 'react';

export type WorkingHoursProps = {
    currentStep: number;
    onActiveDaysChanged?: (days: number) => void;
    onAgencyActiveChanged?: (isActive: boolean) => void;
    onActiveHoursChanged?: (start: Moment, end: Moment) => void;
};

const AgencyWorkingHours = (props: WorkingHoursProps) => {

    const { currentStep, onActiveDaysChanged, onAgencyActiveChanged, onActiveHoursChanged } = props;

    const { language } = useContext(LanguageContext);

    const [startOfWorkingHours, setStartOfWorkingHours] = useState(moment());
    const [endOfWorkingHours, setEndOfWorkingHours] = useState(moment());
    const [isAgencyActive, setIsAgencyActive] = useState(true);
    const { settings, agenciesPage } = language;

    const startHandleChange = (newValue: Moment | null) => {
        if (newValue)
            setStartOfWorkingHours(newValue);
        else
            return;

        if (onActiveHoursChanged)
            onActiveHoursChanged(newValue, endOfWorkingHours);
    };

    const endHandleChange = (newValue: Moment | null) => {
        if (newValue)
            setEndOfWorkingHours(newValue);
        else
            return;

        if (onActiveHoursChanged)
            onActiveHoursChanged(startOfWorkingHours, newValue);
    };

    const activeDaysChanged = (days: number) => {
        if (onActiveDaysChanged)
            onActiveDaysChanged(days);
    };
    const agencyActiveChanged = (isActive: boolean) => {
        if (onAgencyActiveChanged)
            onAgencyActiveChanged(isActive);
        setIsAgencyActive(isActive);
    };

    return (
        <LocalizationProvider dateAdapter={MomentUtils}>
            <TabPanel wrapMode={true} dir={settings.direction} activeIndex={currentStep.toString()} index='3'>

                <WorkingDaysList onWorkingDaysChanged={(flag) => activeDaysChanged(flag)} />
                <CenterBox >
                    <TimePicker
                        label={agenciesPage.startOfWorkingHours}
                        value={startOfWorkingHours}
                        onChange={startHandleChange}
                        ampm={false}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <TimePicker
                        label={agenciesPage.endOfWorkingHours}
                        value={endOfWorkingHours}
                        onChange={endHandleChange}
                        ampm={false}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </CenterBox>
                <CenterBox sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Typography variant='body2'>{isAgencyActive? agenciesPage.activeAgency : agenciesPage.inactiveAgency}</Typography>
                    <Switch checked={isAgencyActive} onChange={(e) => agencyActiveChanged(e.target.checked)} />
                </CenterBox>
            </TabPanel >
        </LocalizationProvider>
    );
};

export default AgencyWorkingHours;