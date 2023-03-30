import { createContext, Dispatch } from 'react';
import { AgencyDataList } from '../../types/agencies';
import { PlacesList } from '../../types/placeType';
import { PriceList } from '../../types/priceType';

export const PriceContext = createContext<{
    agencyList: AgencyDataList | undefined;
    priceList: PriceList | undefined;
    placesList: PlacesList | undefined;
    setAgencyList: Dispatch<AgencyDataList | undefined>;
    setPriceList: Dispatch<PriceList | undefined>;
    setPlacesList: Dispatch<PlacesList | undefined>;

}>({
    agencyList: [],
    priceList: [],
    placesList:[],
    setAgencyList: () => void 0,
    setPriceList: () => void 0,
    setPlacesList: () => void 0
});