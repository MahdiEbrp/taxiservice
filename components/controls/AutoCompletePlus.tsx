import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../../lib/context/LanguageContext';

export type ItemProps= {
    value: string;
    key: string;
}

export type AutoCompletePlusProps= {
    items: ItemProps[] | undefined;
    label: string;
    loading?: boolean;
    onChanged?: (element: ItemProps | null) => void;
    onInputTextChanged?: (value: string) => void;
}

const AutoCompletePlus: React.FC<AutoCompletePlusProps> = (props: AutoCompletePlusProps) => {
    const { items, label, loading, onChanged, onInputTextChanged } = props;
    const { language } = useContext(LanguageContext);

    const { settings, components } = language;
    const { direction } = settings;

    const options = items?.map((item) => {
        const firstLetter = item.value[0].toUpperCase();
        return {
            value: item.value,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            key: item.key,
        };
    });

    return (
        <Autocomplete
            id='grouped-demo'
            loading={loading && true}
            options={options ? options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)): []}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.value}
            renderOption={(props, option) => {
                return (
                    <li key={option.key}  {...props}>
                        {option.value}
                    </li>
                );
            }}
            sx={{ width: 300 }}
            noOptionsText={components.noOptionsText}
            loadingText={components.loadingText}
            onChange={(event, item) => onChanged && onChanged(item)}
            PopperComponent={(props) => <Popper dir={direction} {...props} />}
            renderInput={(params) => <TextField onChange={e => onInputTextChanged && onInputTextChanged(e.target.value)} label={label} {...params} />}
        />
    );
};

export default AutoCompletePlus;