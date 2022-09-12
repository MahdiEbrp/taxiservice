import { createContext, Dispatch } from 'react';

export const AllAgenciesContext = createContext<{
    agencyNames: string[];
    setAgencyNames: Dispatch<string[]>;
}>({
    agencyNames: [],
    setAgencyNames: () => void 0,
});