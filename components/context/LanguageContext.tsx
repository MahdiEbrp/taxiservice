import { createContext } from 'react';
import getLanguage from '../../lib/language';

export const LanguageContext = createContext({
    language:getLanguage('en'),
});
