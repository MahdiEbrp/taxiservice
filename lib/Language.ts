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
    switch (error) {
        case 'ERR_UNKNOWN':
            return responseError.ERR_UNKNOWN;
        case 'ERR_EMAIL_EXISTS':
            return responseError.ERR_EMAIL_EXISTS;
        case 'ERR_INVALID_CAPTCHA':
            return responseError.ERR_INVALID_CAPTCHA;
        case 'ERR_INVALID_FORMAT':
            return responseError.ERR_INVALID_FORMAT;
        case 'ERR_INVALID_METHOD':
            return responseError.ERR_INVALID_METHOD;
        case 'ERR_POST_DATA':
            return responseError.ERR_POST_DATA;
        case 'ERR_UNKNOWN_CREATING_USER':
            return responseError.ERR_UNKNOWN_CREATING_USER;
        case 'ERR_SERVICE_UNAVAILABLE':
            return responseError.ERR_SERVICE_UNAVAILABLE;
        case 'ERR_INVALID_REQUEST':
            return responseError.ERR_INVALID_REQUEST;
        case 'ERR_REQUEST_EXPIRED':
            return responseError.ERR_REQUEST_EXPIRED;
        case 'ERR_INTERNAL_UPDATE':
            return responseError.ERR_INTERNAL_UPDATE;
        case 'ERR_NULL_RESPONSE':
            return responseError.ERR_NULL_RESPONSE;
        case 'HTML_ERROR_404':
            return responseError.HTML_ERROR_404;
        default:
            return responseError.ERR_UNKNOWN;
    }
};
export default getLanguage;