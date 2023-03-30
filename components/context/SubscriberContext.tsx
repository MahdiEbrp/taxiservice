import { createContext, Dispatch } from 'react';
import { AgencyDataList } from '../../types/agencies';
import { PlacesList } from '../../types/placeType';
import { SubscriberDataList } from '../../types/subscriberType';

export const SubscriberContext = createContext<{
    agencyList: AgencyDataList | undefined;
    placesList: PlacesList | undefined;
    subscriberList: SubscriberDataList | undefined;
    setAgencyList: Dispatch<AgencyDataList | undefined>;
    setPlacesList: Dispatch<PlacesList | undefined>;
    setSubscriberList: Dispatch<SubscriberDataList | undefined>;
}>({
    agencyList: [],
    placesList: [],
    subscriberList: [],
    setAgencyList: () => void 0,
    setPlacesList: () => void 0,
    setSubscriberList: () => void 0,
});