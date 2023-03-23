import moment from 'moment';

const dateCounter = (date: Date, language: string) => {
    if (language === 'en')
        return moment(date).locale('en').fromNow();
    import(`moment/locale/${language}`).catch(() => {
        return moment(date).locale('en').fromNow();
    });

    return moment(date).locale(language).fromNow();
};
export const customCalender = (date: Date, language: string) => {
    if (language === 'en')
        return moment(date).format('DD/MM/YYYY HH:mm');
    import(`moment/locale/${language}`).catch(() => {
        return moment(date).locale('en').calendar();
    });
    const persianCalender = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    if (language === 'fa') {
        const parts = persianCalender.formatToParts(new Date(date));
        const result = parts.reduce((acc, part) => {
            switch (part.type) {
                case 'year':
                    return acc + part.value;
                case 'month':
                    return acc + '/' + part.value;
                case 'day':
                    return acc + '/' + part.value;
                case 'hour':
                    return acc + ' ' + part.value;
                case 'minute':
                    return acc + ':' + part.value;
                default:
                    return acc;
            }
        }, '');
        return result;
    }
    return moment(date).locale(language).format('DD/MM/YYYY HH:mm');
};

export default dateCounter;