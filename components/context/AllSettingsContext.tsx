import { createContext, Dispatch } from 'react';
import { Settings } from '../../types/settings';
export const AllSettingsContext = createContext<{
    userSettings: Settings | null;
    setUserSettings: Dispatch<Settings|null>;
}>({
    userSettings:null ,
    setUserSettings: () => void 0
});