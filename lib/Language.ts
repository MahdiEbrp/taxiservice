import english from './languages/english';
import persian from './languages/persian';

const getLanguage = (locale:string | undefined) => {
    switch (locale) {
        case 'en':
            return english;
        case 'en-US':
            return english;
        case 'fa':
            return persian;
        case 'fa-IR':
            return persian;
        default:
            return english;
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