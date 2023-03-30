import { createContext, Dispatch } from 'react';
import { defaultLocalizationInfo, LocalizationInfoType } from '../../lib/geography';
export const LocalizationInfoContext = createContext<{
    localizationInfo: LocalizationInfoType;
    setLocalizationInfo: Dispatch<LocalizationInfoType>;
}>({
    localizationInfo: defaultLocalizationInfo,
    setLocalizationInfo: () => void 0,
});