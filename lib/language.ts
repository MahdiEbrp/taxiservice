import english from './languages/english';
import languageList from './languages/list';
const importLanguage = async (locale: string | undefined) => {

    if (!locale || ['en', 'en-US'].includes(locale))
        return english;

    type languageType = typeof english;
    const languageInfo = languageList().find((language) => language.code === locale);

    if (!languageInfo)
        return english;

    const defaultFunc = await import('./languages/' + languageInfo.import);
    const result = defaultFunc.default as languageType;
    if (!result)
        return english;
    else
        return result;

};

export const getResponseError = (error: string, language: typeof english) => {

    const { responseError } = language;
    for (const [key, value] of Object.entries(responseError)) {
        if (key === error) {
            return value;
        }
    }
    return responseError.ERR_UNKNOWN;
};
export const getSystemMessage = (message: string, language: typeof english) => {
    const { systemMessages } = language;
    for (const [key, value] of Object.entries(systemMessages)) {
        message = message.replace(key, value);
    }
    return message;
};
export default importLanguage;