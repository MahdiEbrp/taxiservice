import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { LanguageContext } from '../../lib/context/LanguageContext';
export interface ComboBoxWithOptionProps {
    items: string[];
    label: string;
    // eslint-disable-next-line no-unused-vars
    onValueChanged?: (element: string) => void;
}
const ComboBoxWithGroup: React.FC<ComboBoxWithOptionProps> = (props: ComboBoxWithOptionProps) => {
    const { items, label, onValueChanged } = props;
    const { language } = useContext(LanguageContext);
    /* #region Language section */
    const { settings, components } = language;
    const { direction } = settings;
    /* #endregion */
    /* #region Functions section */
    const options = items.map((item) => {
        const firstLetter = item[0].toUpperCase();
        return {
            item: item,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter
        };
    });
    const inputBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
        if (event.target && onValueChanged)
            onValueChanged(event.target.value);
    };
    /* #endregion */
    return (
        <Autocomplete
            id='grouped-demo'
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.item}
            sx={{ width: 300 }}
            noOptionsText={components.noOptionsText}
            PopperComponent={(props) => <Popper dir={direction} {...props} />}
            renderInput={(params) => <TextField onBlur={(event) => inputBlur(event)} label={label} {...params} />}
        />
    );
};


export default ComboBoxWithGroup;