import { GetData } from './FetchData';

export type cities = city[];

export type city = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon: string;
};

export type country= {
    country_code: string;
    englishName: string;
    nativeName: string;
}

export type countries= {
    data: country[];
}


export const fetchCitiesLocation = async (cityName: string, countryCode: string) => {

    // eslint-disable-next-line quotes
    const url = encodeURI(`https://nominatim.openstreetmap.org/search?country=${countryCode}&city=${cityName}&format=json`);
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