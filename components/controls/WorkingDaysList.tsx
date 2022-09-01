import React, { useContext, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { LocalizationInfoContext } from '../../lib/context/LocalizationInfoContext';
export enum WorkingDays {
    Sunday = 1,
    Monday = 2,
    Tuesday = 4,
    Wednesday = 8,
    Thursday = 16,
    Friday = 32,
    Saturday = 64
}
const WorkingDaysList = () => {

    const { localizationInfo } = useContext(LocalizationInfoContext);
    const { language } = useContext(LanguageContext);

    const { settings } = language;

    const orderedWorkdays = () => {
        const days = settings.days;
        const firstDay = localizationInfo.firstDayOfWeek;
        return days.slice(firstDay).concat(days.slice(0, firstDay));
    };
    const days = orderedWorkdays();
    //127 is the equal of 1111111 in binary
    //that's mean that if the bit is 1 the day is active
    const [activeDays, setActiveDays] = useState(127);

    const changeActiveDays = (day: number) => {
        const newActiveDays = activeDays ^ 1 << day;
        setActiveDays(newActiveDays);
    };
    const checkActiveDay = (day: number) => {
        return (activeDays & 1 << day) > 0;
    };
    return (
        <>
            <Paper sx={{ width: '100%', maxWidth: 360 }} >
                <List>
                    {days.map((day, index) =>
                        <ListItemButton key={index} onClick={() => changeActiveDays(index)}>
                            <ListItem key={index} >
                                <ListItemText primary={day} />
                                <Switch checked={checkActiveDay(index)} />
                            </ListItem>
                        </ListItemButton>
                    )}
                </List>
            </Paper>
        </>
    );
};

export default WorkingDaysList;