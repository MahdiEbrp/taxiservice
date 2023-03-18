import { getData } from './axiosRequest';

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
    code: string;
    name: string;
};

export type CountryType = {
    data: country[];
};

export type LocalizationInfoType = {
    name: string;
    currency: string;
    lat: number;
    long: number;
    firstDayOfWeek: number;
};

export const defaultLocalizationInfo: LocalizationInfoType = {
    name: 'United States-United States', currency: '$', lat: 38.89511, long: -77.03637, firstDayOfWeek: 0,
};

export const fetchCitiesLocation = async (cityName: string) => {

    // eslint-disable-next-line quotes
    const url = encodeURI(`https://photon.komoot.io/api/?q=${cityName}&lang=en`);
    const response = await getData(url);
    if (response) {
        if (response.status === 200) {
            const data = response.data as cities;
            return data;
        }
    }
    return null;

};


export default fetchCitiesLocation;