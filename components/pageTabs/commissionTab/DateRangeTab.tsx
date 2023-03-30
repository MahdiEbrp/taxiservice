import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CenterBox from '../../controls/CenterBox';
import GregorianDatePicker from '../../controls/GregorianDatePicker';
import JalaliDatePicker from '../../controls/JalaliDatePicker';
import React, { useContext, useState } from 'react';
import moment from 'moment';
import { LanguageContext } from '../../context/LanguageContext';
import { ToastContext } from '../../context/ToastContext';
import { Trip } from '../../../types/trips';
import { postData } from '../../../lib/axiosRequest';

export type DateRangeProps = {
    onLoadingTextChange: (text: string) => void;
    onDataChange: (trips: Trip[]) => void;
};

const DateRangeTab = (props: DateRangeProps) => {

    const publicUrl = process.env.NEXT_PUBLIC_WEB_URL;

    const { onLoadingTextChange, onDataChange } = props;

    const { setToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext);
    const { commissionPage, settings, notification } = language;

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const getTrips = async () => {
        if (!startDate || !endDate) {
            setToast({ id: Math.random(), message: notification.unspecifiedPeriodOfTime, alertColor: 'error' });
            return;
        }
        const utcStartDate = moment(startDate).clone().utc();
        utcStartDate.hour(0);
        utcStartDate.minute(0);
        utcStartDate.second(0);

        const utcEndDate = moment(endDate).clone().utc();
        utcEndDate.hour(23);
        utcEndDate.minute(59);
        utcEndDate.second(59);

        if (utcStartDate.isAfter(utcEndDate)) {
            setToast({ id: Math.random(), message: notification.ensuringProperTiming, alertColor: 'error' });
            return;
        }
        const data = { startDate: utcStartDate.toISOString(), endDate: utcEndDate.toISOString() };

        onLoadingTextChange(commissionPage.ReceivingTraveledTrips);
        const response = await postData(publicUrl + '/api/trips/getTraveledTrip', data);
        onLoadingTextChange('');
        if (response && response.status === 200) {
            onDataChange(response.data as Trip[]);
        }
    };
    return (
        <>
            <CenterBox wrapMode>
                {settings.code === 'fa' ?
                    <>
                        <JalaliDatePicker onDateChange={(s) => setStartDate(s)} label={commissionPage.startDate} />
                        <JalaliDatePicker onDateChange={(e) => setEndDate(e)} label={commissionPage.endDate} />
                    </>
                    :
                    <>
                        <GregorianDatePicker onDateChange={(s) => setStartDate(s)} label={commissionPage.startDate} />
                        <GregorianDatePicker onDateChange={(e) => setEndDate(e)} label={commissionPage.endDate} />
                    </>
                }
                <Button onClick={getTrips}>{commissionPage.search}</Button>
            </CenterBox>
            <Alert severity='info'>
                {commissionPage.searchInfo}
            </Alert>
        </>
    );
};

export default DateRangeTab;