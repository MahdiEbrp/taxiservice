import * as countries from './countries.json';
import { GetData } from './FetchData';

export type cities = city[];

export interface city {
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


const countryList = countries.data;

export default countryList;