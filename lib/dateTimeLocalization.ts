import moment from 'moment';

export const flaggedWorkingDays = (activeDaysFlag: number) => {

    const isDayActive = (day: number) => {
        return (activeDaysFlag & 1 << day) > 0;
    };
    const changeActiveDays = (day: number) => {
        return activeDaysFlag ^= 1 << day;
    };
    const daysToString = (days: string[]) => {
        const result:string[] = [];
        days.forEach((element,index) => {
            if (isDayActive(index)) {
                result.push(element);
            }
        });

        return result.join(', ');
    };
    return {
        isDayActive: isDayActive,
        changeActiveDays: changeActiveDays,
        daysToString: daysToString
    };
};
export const orderedWorkingDays = (days: string[], firstDayOfWeek: number) => {

    if (days.length !== 7 && firstDayOfWeek < 0 && firstDayOfWeek > 6)
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return days.slice(firstDayOfWeek).concat(days.slice(0, firstDayOfWeek));
};

export const convertTimeToUtcIso = (hour: number, minute: number) => {

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    return moment(date).utc().toISOString();
};