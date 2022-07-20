import { createContext } from 'react';
import getLanguage from '../Language';

export const LanguageContext = createContext({
    language:getLanguage('en'),
});
