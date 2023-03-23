import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../context/LanguageContext';
import { SxProps, Theme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
export type TaggedItem<T> = {
    displayText: string;
    tag: T;
    avatar?: string;
    id?: string;
};

export type AutoCompletePlusProps<T> = {
    items: TaggedItem<T>[] | undefined;
    label: string;
    loading?: boolean;
    onChanged?: (element: TaggedItem<T> | null) => void;
    onInputTextChanged?: (value: string) => void;
    selectedValue?: string;
    sx?: SxProps<Theme>;
};

const AutoCompletePlus = <T,>(props: AutoCompletePlusProps<T>) => {

    const { items, label, loading, selectedValue, onChanged, onInputTextChanged, sx } = props as AutoCompletePlusProps<T>;

    const style: SxProps<Theme> = { ...{ width: 'min(70vw, 300px)', ...sx } };
    const { language } = useContext(LanguageContext);
    const { settings, components } = language;
    const { direction } = settings;
    const [selectedItem, setSelectedItem] = useState<string | undefined>(selectedValue);
    const options = items?.map((item, index) => {
        const firstLetter = item.displayText ? item.displayText[0].toUpperCase() : ' ';
        return {
            displayText: item.displayText,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            tag: item.tag,
            key: index,
            avatar: item.avatar,
            id: item.id
        };
    });
    useEffect(() => {
        setSelectedItem(selectedValue);
    }, [selectedValue]);
    const item = options?.find((item) => item.displayText === selectedItem);

    return (
        <Autocomplete
            loading={loading && true}
            options={options ? options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)) : []}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.displayText}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.key} style={{ display: 'flex', gap: '1rem' }}  >
                        {option.avatar && <Avatar key={option.key} src={option.avatar} sx={{ width: 48, height: 48 }} />}
                        {option.displayText}
                    </li>
                );
            }}
            sx={style}
            noOptionsText={components.noOptionsText}
            loadingText={components.loadingText}
            value={item || null}
            onChange={(event, item) => {
                if (onChanged) {
                    onChanged(item);
                }
                setSelectedItem(item?.displayText || undefined);
            }}
            onInputChange={(event, value) => {
                if (onInputTextChanged)
                    onInputTextChanged(value);
            }}
            PopperComponent={(props) => <Popper dir={direction} {...props} />}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
};

export default AutoCompletePlus;