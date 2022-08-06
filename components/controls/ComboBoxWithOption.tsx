import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import { useContext } from 'react';
import { LanguageContext } from '../../lib/context/LanguageContext';
export interface ComboBoxWithOptionProps {
    items: string[];
    label: string;
}
const ComboBoxWithGroup = (props: ComboBoxWithOptionProps) => {
    const { items, label } = props;
    const { language } = useContext(LanguageContext);
    /* #region Language section */
    const { settings, components } = language;
    const { direction } =settings;
    /* #endregion */
    /* #region Functions section */
    const options = items.map((item) => {
        const firstLetter = item[0].toUpperCase();
        return {
            item: item,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter
        };
    });
    /* #endregion */
    return (
        <Autocomplete
            id='grouped-demo'
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.item}
            sx={{ width: 300 }}
            noOptionsText={'No results found'}
            PopperComponent={(props) => <Popper dir={direction} {...props} />}
            renderInput={(params) => <TextField label={label} {...params} />}
        />
    );
};

export default ComboBoxWithGroup;