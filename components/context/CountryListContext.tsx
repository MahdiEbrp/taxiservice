import { createContext } from 'react';
import { CountryType } from '../../lib/geography';

export const CountryListContext = createContext<{
    countryList: CountryType | null;
}>({
    countryList: null,
});