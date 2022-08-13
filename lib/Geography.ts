import * as countries from './countries.json';
import { GetData } from './FetchData';

declare module cities {


    export interface Fields {
        coordinates: number[];
        cou_name_en: string;
        label_en: string;
        feature_code: string;
        population: number;
        dem: number;
        geoname_id: string;
        name: string;
        ascii_name: string;
        alternate_names: string;
        admin1_code: string;
        feature_class: string;
        country_code: string;
        timezone: string;
        modification_date: string;
    }

    export interface Geometry {
        type: string;
        coordinates: number[];
    }

    export interface Record {
        datasetid: string;
        recordid: string;
        fields: Fields;
        geometry: Geometry;
        record_timestamp: Date;
    }

    export interface data {
        records: Record[];
    }

}

export const fetchCitiesLocation = async (cityName: string, countryCode: string) => {

    // eslint-disable-next-line quotes
    const url = encodeURI(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${cityName}&sort=name&facet=feature_code&facet=cou_name_en&facet=timezone&refine.country_code=${countryCode}`);
    const response = await GetData(url);
    if (response) {
        if (response.status === 200) {
            const data = response.data as cities.data;
            return data;
        }
    }
    return null;

};


const countryList = countries.data;

export default countryList;