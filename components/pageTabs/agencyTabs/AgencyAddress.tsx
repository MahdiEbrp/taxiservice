import { useCallback, useEffect, useState } from 'react';
import { fetchCitiesLocation } from '../../../lib/Geography';
import AutoCompletedPlus, { ItemProps } from '../../controls/AutoCompletePlus';
import TabPanel from '../../controls/TabPanel';

export type AgencyAddressProps = {
    currentStep: number;
    localization: string,
};

const AgencyAddress = (props: AgencyAddressProps) => {

    const { currentStep, localization } = props;

    const [suggestState, setSuggestState] = useState<'typing' | 'fetching' | 'ready'>('ready');
    const [suggestionItems, setSuggestionItems] = useState<ItemProps[]>([]);

    const delayTime = 1.5 * 1000;
    let city = '';

    const onTextChange = (value: string) => {
        city = value;
        if (suggestState !== 'typing')
            setSuggestState('typing');
    };

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
        <TabPanel activeIndex={currentStep.toString()} index='2'>
            <AutoCompletedPlus onInputTextChanged={(city) => onTextChange(city)} loading={suggestState !== 'ready'} items={suggestionItems} label='locations' />
        </TabPanel>
    );
};

export default AgencyAddress;