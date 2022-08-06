import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
export interface ComboBoxWithOptionProps {
    items: string[];
    dir: 'rtl' | 'ltr';
    label: string;
}
const ComboBoxWithGroup = (props: ComboBoxWithOptionProps) => {
    const { items, dir, label } = props;
    const options = items.map((item) => {
        const firstLetter = item[0].toUpperCase();
        return {
            item: item,
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter
        };
    });
    return (
        <Autocomplete
            id='grouped-demo'
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.item}
            sx={{ width: 300 }}
            PopperComponent={(props) => <Popper dir={dir} {...props} />}
            renderInput={(params) => <TextField label={label} {...params} />}
        />
    );
};

export default ComboBoxWithGroup;