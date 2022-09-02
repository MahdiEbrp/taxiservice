import { createContext } from 'react';
import { CountryType } from '../geography';

export const CountryListContext = createContext<{
    countryList: CountryType | null;
}>({
    countryList: null,
});