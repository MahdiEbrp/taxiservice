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
import { useContext, useEffect, useState } from 'react';
import { ToastContext } from '../../context/ToastContext';
import { AgencyData } from '../../../lib/types/agencies';

export type WorkingHoursProps = {
    currentStep: number;
    onValidationChanged: (isValid: boolean) => void;
    onValuesChange: (isActive: boolean, workingDays: number, startOfWorkingHours: Moment, endOfWorkingHours: Moment) => void;
    selectedAgencyData: AgencyData | null;
};
const AgencyWorkingHours = (props: WorkingHoursProps) => {

    const { currentStep, onValidationChanged, onValuesChange, selectedAgencyData } = props;
    const defaultAgencyName = selectedAgencyData?.agencyName || '';
    const defaultActive = selectedAgencyData?.isEnable || true;
    const defaultWorkingDays = selectedAgencyData?.workingDays || 127;
    const defaultStartOfWorkingHours = selectedAgencyData?.startOfWorkingHours;
    const defaultEndOfWorkingHours = selectedAgencyData?.endOfWorkingHours;

    const { language } = useContext(LanguageContext);
    const { setToast } = useContext(ToastContext);

    const [agencyName, setAgencyName] = useState(defaultAgencyName);
    const [workingDays, setWorkingDays] = useState(defaultWorkingDays);
    const [isAgencyActive, setIsAgencyActive] = useState<boolean>(defaultActive);
    const [startOfWorkingHours, setStartOfWorkingHours] = useState(moment());
    const [endOfWorkingHours, setEndOfWorkingHours] = useState(moment());
    const { settings, agenciesPage, notification } = language;

    const startHandleChange = (newValue: Moment | null) => {

        if (!newValue)
            return;
        if (newValue.isBefore(endOfWorkingHours)) {
            setStartOfWorkingHours(newValue);
            onValuesChange(isAgencyActive, workingDays, newValue, endOfWorkingHours);
        }
        else
            setToast({ id: Date.now(), message: notification.startDateError, alertColor: 'error' });

    };

    const endHandleChange = (newValue: Moment | null) => {

        if (!newValue)
            return;
        if (newValue.isAfter(startOfWorkingHours)) {
            setEndOfWorkingHours(newValue);
            onValuesChange(isAgencyActive, workingDays, startOfWorkingHours, newValue);
        }
        else
            setToast({ id: Date.now(), message: notification.endDateError, alertColor: 'error' });
    };

    const activeDaysChanged = (days: number) => {
        setWorkingDays(days);
        onValuesChange(isAgencyActive, days, startOfWorkingHours, endOfWorkingHours);
    };
    const agencyActiveChanged = (isActive: boolean) => {
        setIsAgencyActive(isActive);
        onValuesChange(isActive, workingDays, startOfWorkingHours, endOfWorkingHours);
    };

    useEffect(() => {
        if (agencyName !== defaultAgencyName && selectedAgencyData) {
            setAgencyName(defaultAgencyName);
            setIsAgencyActive(defaultActive);
            setWorkingDays(defaultWorkingDays);
            setStartOfWorkingHours(moment(defaultStartOfWorkingHours));
            setEndOfWorkingHours(moment(defaultEndOfWorkingHours));
            onValuesChange(defaultActive, defaultWorkingDays, moment(defaultStartOfWorkingHours), moment(defaultEndOfWorkingHours));
        }
    }, [agencyName, defaultActive, defaultAgencyName, defaultEndOfWorkingHours, defaultStartOfWorkingHours, defaultWorkingDays, onValuesChange, selectedAgencyData]);

    useEffect(() => {
        const isValid = workingDays > 0 && startOfWorkingHours.isBefore(endOfWorkingHours) && endOfWorkingHours.isAfter(startOfWorkingHours);
        onValidationChanged(isValid);
    }, [workingDays, startOfWorkingHours, endOfWorkingHours, onValidationChanged]);

    return (
        <LocalizationProvider dateAdapter={MomentUtils}>
            <TabPanel wrapMode={true} dir={settings.direction} activeIndex={currentStep.toString()} index='3'>

                <WorkingDaysList defaultWorkingDays={workingDays} onWorkingDaysChanged={(flag) => activeDaysChanged(flag)} />
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
                    <Typography variant='body2'>{isAgencyActive ? agenciesPage.activeAgency : agenciesPage.inactiveAgency}</Typography>
                    <Switch checked={isAgencyActive} onChange={(e) => agencyActiveChanged(e.target.checked)} />
                </CenterBox>
            </TabPanel >
        </LocalizationProvider>
    );
};

export default AgencyWorkingHours;