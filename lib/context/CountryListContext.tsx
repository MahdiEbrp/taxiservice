import { createContext } from 'react';
import { CountryType } from '../Geography';

export const CountryListContext = createContext<{
    countryList: CountryType | null;
}>({
    countryList: null,
});