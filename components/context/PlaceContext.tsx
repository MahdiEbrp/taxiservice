import { createContext, Dispatch } from 'react';
import { PlacesList } from '../../types/placeType';

export const PlaceContext = createContext<{ placesList: PlacesList | undefined; setPlacesList: Dispatch<PlacesList | undefined>; }>
    ({
        placesList: undefined,
        setPlacesList: () => void 0,
    });