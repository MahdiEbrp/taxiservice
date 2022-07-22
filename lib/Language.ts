import English from './languages/English';
import Persian from './languages/Persian';

const getLanguage = (locale:string | undefined) => {
    switch (locale) {
        case 'en':
            return English;
        case 'en-US':
            return English;
        case 'fa':
            return Persian;
        case 'fa-IR':
            return Persian;
        default:
            return English;
    }
};
export const getResponseError = (error: string, language = getLanguage('en')) => {

    const { responseError } = language;
    for (const [key, value] of Object.entries(responseError)) {
        if (key === error) {
            return value;
        }
    }
    return responseError.ERR_UNKNOWN;
};
export default getLanguage;