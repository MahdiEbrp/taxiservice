import 'moment/locale/fa';
import MomentUtils from '@date-io/moment';
import React, { useContext, useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { LanguageContext } from '../context/LanguageContext';
import { TextField } from '@mui/material';

export type GregorianDatePickerProps = {
    label: string;
    onDateChange: (date: Date | null) => void;
};
const GregorianDatePicker = (props: GregorianDatePickerProps) => {

    const { onDateChange, label } = props;
    const [selectedDate, setSelectedDate] = useState<Moment | null>(moment());
    const { language } = useContext(LanguageContext);
    const { settings } = language;
    const handleDateChange = (value: Moment | null) => {

        setSelectedDate(value);
        if (!value)
            onDateChange(null);
        else
            onDateChange(value.toDate());
    };

    useEffect(() => {
        if (settings.code && settings.code !== 'en') {
            import(`moment/locale/${settings.code}`).then(() => {
                moment.locale(settings.code);
            });
        }
    }, [settings.code]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <LocalizationProvider dateAdapter={MomentUtils}>

            <DatePicker
                value={selectedDate}
                inputFormat='DD-MMMM-YYYY'
                label={label}
                disableMaskedInput
                renderInput={(params) => <TextField onKeyDown={handleKeyDown}  {...params} />}
                onChange={handleDateChange}
            />
        </LocalizationProvider>
    );
};

export default GregorianDatePicker;