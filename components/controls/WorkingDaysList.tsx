import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { LanguageContext } from '../context/LanguageContext';
import { LocalizationInfoContext } from '../context/LocalizationInfoContext';
import { flaggedWorkingDays, orderedWorkingDays } from '../../lib/dateTimeLocalization';
import { useMemo, useContext, useState, useEffect } from 'react';
export type WorkingDaysListProps = {
    onWorkingDaysChanged?: (days: number) => void;
    defaultWorkingDays?: number;
};
const WorkingDaysList = (props: WorkingDaysListProps) => {

    const { onWorkingDaysChanged, defaultWorkingDays } = props;

    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { language } = useContext(LanguageContext);

    const { settings } = language;

    const days = useMemo(() => {
        return orderedWorkingDays(settings.days, localizationInfo.firstDayOfWeek);
    }, [settings.days, localizationInfo.firstDayOfWeek]);

    //if bit is set, day is active
    const [activeDaysFlag, setActiveDaysFlag] = useState<number>(127);

    const workdays = useMemo(() => {
        return flaggedWorkingDays(activeDaysFlag, localizationInfo.firstDayOfWeek);
    }, [activeDaysFlag, localizationInfo.firstDayOfWeek]);

    const changeActiveDays = (day: number) => {
        const newActiveDays = workdays.changeActiveDays(day);

        if (onWorkingDaysChanged)
            onWorkingDaysChanged(newActiveDays);

        setActiveDaysFlag(newActiveDays);
    };

    useEffect(() => {
        if (defaultWorkingDays)
            setActiveDaysFlag(defaultWorkingDays);
    }, [defaultWorkingDays]);

    return (
        <>
            <Paper sx={{ width: '100%', maxWidth: 360 }} >
                <List>
                    {days.map((day, index) =>
                        <ListItemButton key={index} onClick={() => changeActiveDays(index)}>
                            <ListItem key={index} >
                                <ListItemText primary={day} />
                                <Switch checked={workdays.isDayActive(index)} />
                            </ListItem>
                        </ListItemButton>
                    )}
                </List>
            </Paper>
        </>
    );
};

export default WorkingDaysList;