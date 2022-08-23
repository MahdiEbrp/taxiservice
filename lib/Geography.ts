import { GetData } from './FetchData';

export type cities = {
    features: Feature[];
};

export type Feature = {
    geometry: Geometry;
    properties: Properties;
};

export type Geometry = {
    coordinates: number[];
};

export type Properties = {
    osm_type: string;
    osm_id: number;
    country: string;
    osm_key: string;
    countrycode: string;
    osm_value: string;
    postcode?: string;
    name: string;
    county?: string;
    state?: string;
    type: string;
    extent?: number[];
    city?: string;
    street?: string;
};

export type country = {
    country_code: string;
    englishName: string;
    nativeName: string;
};

export type countries = {
    data: country[];
};


export const fetchCitiesLocation = async (cityName: string) => {

    // eslint-disable-next-line quotes
    const url = encodeURI(`https://photon.komoot.io/api/?q=${cityName}&lang=en`);
    const response = await GetData(url);
    if (response) {
        if (response.status === 200) {
            const data = response.data as cities;
            return data;
        }
    }
    return null;

};

export const getCountryList = async () => {
    const response = await GetData('/data/countries.json');
    if (response)
        if (response.status === 200) {
            const data = response.data as countries;
            return data;
        }
    return null;
};

export default getCountryList;