import AutoCompletedPlus, { ItemProps } from './AutoCompletePlus';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { fetchCitiesLocation } from '../../lib/Geography';
import { useCallback, useContext, useEffect, useState } from 'react';

const PlacesSearchBox = (props: { localization:string}) => {

    const { localization } = props;

    const { language } = useContext(LanguageContext);

    const [suggestState, setSuggestState] = useState<'typing' | 'fetching' | 'ready'>('ready');
    const [suggestionItems, setSuggestionItems] = useState<ItemProps[]>([]);

    const delayTime = 1.5 * 1000;
    let city = '';

    const onTextChange = (value: string) => {
        city = value;
        if (suggestState !== 'typing')
            setSuggestState('typing');
    };

    const components = language.components;

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const lazySuggest = useCallback(async () => {

        await delay(delayTime);
        if (suggestState === 'typing' && city) {
            setSuggestState('fetching');
            const cities = await fetchCitiesLocation(city, localization);
            if (cities) {
                const values = cities.map(({ display_name, lat, lon }) => (
                    {
                        value: display_name + ' - ' + city,
                        key: lat + ',' + lon,
                    }
                ));
                setSuggestionItems(values);
            }
            setSuggestState('ready');
        }
        if (city === '')
            setSuggestState('ready');
    }, [delayTime, suggestState, city, localization]);

    useEffect(() => {
        lazySuggest();
    }, [lazySuggest]);

    return (
        <>
            <AutoCompletedPlus onInputTextChanged={(city) => onTextChange(city)} loading={suggestState !== 'ready'} items={suggestionItems} label={components.locations} />
        </>
    );
};

export default PlacesSearchBox;


