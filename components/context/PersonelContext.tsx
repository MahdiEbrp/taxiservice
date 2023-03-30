import { createContext, Dispatch } from 'react';
import { PersonelList } from '../../types/personel';
export const PersonelContext = createContext<{
    personelList: PersonelList | undefined;
    setPersonelList: Dispatch<PersonelList | undefined>;
}>({
    personelList: undefined,
    setPersonelList: () => void 0
});