import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../../lib/context/LanguageContext';
import { SxProps, Theme } from '@mui/material/styles';

export type taggedItem<T> = {
    displayText: string;
    tag: T;
};

export type AutoCompletePlusProps<T> = {
    items: taggedItem<T>[] | undefined;
    label: string;
    loading?: boolean;
    onChanged?: (element: taggedItem<T> | null) => void;
    onInputTextChanged?: (value: string) => void;
    sx?: SxProps<Theme>;
};

const AutoCompletePlus = <T extends {}>(props: AutoCompletePlusProps<T>) => {

    const { items, label, loading, onChanged, onInputTextChanged, sx } = props as AutoCompletePlusProps<T>;

    const style: SxProps<Theme> = { ...{ width: 300,...sx } };
    const { language } = useContext(LanguageContext);

    const { settings, components } = language;
    const { direction } = settings;

    const options = items?.map((item, index) => {
        const firstLetter = item.displayText ? item.displayText[0].toUpperCase() : ' ';
        return {
            displayText: item.displayText,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            tag: item.tag,
            key: index,
        };
    });

    return (
        <Autocomplete
            id='grouped-demo'
            loading={loading && true}
            options={options ? options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)) : []}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.displayText}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.key}  >
                        {option.displayText}
                    </li>
                );
            }}
            sx={style}
            noOptionsText={components.noOptionsText}
            loadingText={components.loadingText}
            onChange={(event, item) => onChanged && onChanged(item)}
            PopperComponent={(props) => <Popper dir={direction} {...props} />
            }
            renderInput={(params) => <TextField onChange={e => onInputTextChanged && onInputTextChanged(e.target.value)} label={label} {...params} />}
        />
    );
};

export default AutoCompletePlus;