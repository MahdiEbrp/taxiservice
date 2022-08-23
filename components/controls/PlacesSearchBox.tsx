import AutoCompletedPlus, { taggedItem } from './AutoCompletePlus';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { fetchCitiesLocation } from '../../lib/Geography';
import { useCallback, useContext, useEffect, useState } from 'react';

export type PlacesSearchBoxProps = {
    onChange?: (value: taggedItem<number[]> | null) => void;
};

const PlacesSearchBox = (props: PlacesSearchBoxProps) => {

    const { onChange } = props;

    const { language } = useContext(LanguageContext);

    const [suggestState, setSuggestState] = useState<'typing' | 'fetching' | 'ready'>('ready');
    const [suggestionItems, setSuggestionItems] = useState<taggedItem<number[]>[]>([]);

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
            const cities = await fetchCitiesLocation(city);
            if (cities) {
                const values = cities.features.map(({ properties, geometry }) => (
                    {
                        displayText: properties.name,
                        tag: geometry.coordinates,
                    }
                ) );
                setSuggestionItems(values);
            }
            setSuggestState('ready');
        }
        if (city === '')
            setSuggestState('ready');
    }, [delayTime, suggestState, city]);

    useEffect(() => {
        lazySuggest();
    }, [lazySuggest]);

    return (
        <>
            <AutoCompletedPlus onInputTextChanged={(city) => onTextChange(city)} loading={suggestState !== 'ready'} items={suggestionItems} label={components.locations} onChanged={(item) => onChange && onChange(item)} />
        </>
    );
};

export default PlacesSearchBox;


