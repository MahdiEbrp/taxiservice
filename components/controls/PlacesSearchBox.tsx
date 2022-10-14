import AutoCompletedPlus, { TaggedItem } from './AutoCompletePlus';
import { LanguageContext } from '../context/LanguageContext';
import { fetchCitiesLocation } from '../../lib/geography';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

export type PlacesSearchBoxProps = {
    onLocationChanged?: (value: TaggedItem<number[]> | null) => void;
    sx?: SxProps<Theme>;
};

const PlacesSearchBox = (props: PlacesSearchBoxProps) => {

    const { onLocationChanged, sx } = props;

    const { language } = useContext(LanguageContext);

    const [suggestState, setSuggestState] = useState<'typing' | 'fetching' | 'ready'>('ready');
    const [suggestionItems, setSuggestionItems] = useState<TaggedItem<number[]>[]>([]);

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
                        displayText: properties.name + ' (' + city + '...)',
                        tag: geometry.coordinates.length === 2 ? geometry.coordinates.reverse() : [0, 0],
                    }
                ));
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
            <AutoCompletedPlus sx={sx} onInputTextChanged={(city) => onTextChange(city)} loading={suggestState !== 'ready'} items={suggestionItems} label={components.locations} onChanged={(item) => onLocationChanged && onLocationChanged(item)} />
        </>
    );
};

export default PlacesSearchBox;


