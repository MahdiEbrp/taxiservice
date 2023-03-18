import { Language } from '../../types/language';

export const languageList= () => {
    const languages: Language[] = [];
    languages.push({ code: 'en', name: 'English', import: 'english' });
    languages.push({ code: 'fa', name: 'فارسی-Persian', import: 'persian'});
    return languages;
};
export default languageList;