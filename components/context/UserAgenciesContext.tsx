import { createContext, Dispatch } from 'react';
import { AgencyDataList } from '../../lib/types/agencies';

export const UserAgenciesContext = createContext<{
    agencyData: AgencyDataList | [];
    setAgencyData: Dispatch<AgencyDataList | []>;
}>({
    agencyData: [],
    setAgencyData: () => void 0,
});