import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import JalaliUtils from '@date-io/jalaali';
import { TextField } from '@mui/material';
import moment from 'moment';
import 'moment/locale/fa';
import jMoment, { Moment } from 'moment-jalaali';

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

export type JalaliDatePickerProps = {
    label: string;
    onDateChange: (date: Date | null) => void;
};
const JalaliDatePicker = (props: JalaliDatePickerProps) => {

    const { onDateChange,label } = props;
    const [selectedDate, setSelectedDate] = useState<Moment | null>(moment());

    const handleDateChange = (value: Moment | null) => {

        setSelectedDate(value);
        if (!value)
            onDateChange(null);
        else
            onDateChange(value.toDate());
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    return (
        <LocalizationProvider dateAdapter={JalaliUtils}>

            <DatePicker
                value={selectedDate}
                label={label}
                inputFormat='jDD-jMMMM-jYYYY'
                disableMaskedInput
                renderInput={(params) => <TextField onKeyDown={handleKeyDown} {...params} />}
                onChange={handleDateChange}
            />
        </LocalizationProvider>
    );
};

export default JalaliDatePicker;