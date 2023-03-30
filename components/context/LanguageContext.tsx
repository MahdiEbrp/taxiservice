import { createContext } from 'react';
import english from '../../lib/languages/english';

export const LanguageContext = createContext({
    language: english,
});
