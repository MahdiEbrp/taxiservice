import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../../lib/context/LanguageContext';
export interface ItemProps {
    value: string;
    key: string;
}
export interface ComboBoxWithOptionProps {
    items: ItemProps[];
    label: string;
    onValueChanged?: (element: string) => void;
    onKeyChanged?: (element: string) => void;
}
const ComboBoxWithGroup: React.FC<ComboBoxWithOptionProps> = (props: ComboBoxWithOptionProps) => {
    const { items, label, onValueChanged, onKeyChanged } = props;
    const { language } = useContext(LanguageContext);
    /* #region Language section */
    const { settings, components } = language;
    const { direction } = settings;
    /* #endregion */
    /* #region Functions section */
    const options = items.map((item) => {
        const firstLetter = item.value[0].toUpperCase();
        return {
            value: item.value,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            key: item.key,
        };
    });
    const inputBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
        if (event.target && onValueChanged)
            onValueChanged(event.target.value);
    };
    const keyChange = (key: string) => {
        if (onKeyChanged)
            onKeyChanged(key);
    };
    /* #endregion */
    return (
        <Autocomplete
            id='grouped-demo'
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
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
            onChange={(event, item) => !item ? keyChange('') : keyChange(item.key)}
            PopperComponent={(props) => <Popper dir={direction} {...props} />}
            renderInput={(params) => <TextField onBlur={(event) => inputBlur(event)} label={label} {...params} />}
        />
    );
};


export default ComboBoxWithGroup;