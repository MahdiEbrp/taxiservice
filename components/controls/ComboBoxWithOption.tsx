import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../../lib/context/LanguageContext';
export interface ItemProps {
    value: string;
    key: string;
}
export interface ComboBoxWithGroupProps {
    items: ItemProps[];
    label: string;
    onChanged?: (element:ItemProps | null) => void;
}
const ComboBoxWithGroup: React.FC<ComboBoxWithGroupProps> = (props: ComboBoxWithGroupProps) => {
    const { items, label, onChanged } = props;
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
            onChange={(event, item) => onChanged && onChanged(item)}
            PopperComponent={(props) => <Popper dir={direction} {...props} />}
            renderInput={(params) => <TextField label={label} {...params} />}
        />
    );
};


export default ComboBoxWithGroup;