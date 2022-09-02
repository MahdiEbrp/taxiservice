import { createContext } from 'react';
import getLanguage from '../language';

export const LanguageContext = createContext({
    language:getLanguage('en'),
});
